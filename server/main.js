import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Accounts } from 'meteor/accounts-base';
import ldap from 'ldapjs';
import { Policies } from '../imports/collections/policies.js';
import { AppUsers } from '../imports/collections/app_users.js';
import { Logging } from '../imports/collections/logging.js';
import '../config/at-config.js';

var ldapClient;

function parseAdminStatus(memberOf) {
	let regex = new RegExp(Meteor.settings.ldap.adminCN);
	let isAdmin = false;
	if (Array.isArray(memberOf)) {
		memberOf.forEach(e => {
			if (regex.test(e)) {
				isAdmin = true;
			}
		});
	} else {
		if (regex.test(memberOf)) {
			isAdmin = true;
		}
	}

	return isAdmin;
}

Meteor.startup(() => {
	LDAP_DEFAULTS.dn = Meteor.settings.ldap.bind;
	LDAP_DEFAULTS.url = 'ldap://' + Meteor.settings.ldap.hostname;
	LDAP_DEFAULTS.port = Meteor.settings.ldap.port;
	LDAP_DEFAULTS.base = Meteor.settings.ldap.baseDN;
	LDAP_DEFAULTS.searchDN = Meteor.settings.ldap.bind;
	LDAP_DEFAULTS.searchCredentials = Meteor.settings.ldap.creds;
	LDAP_DEFAULTS.customProps = {
		profile: {
			isAdmin: false,
			policies: []
		}
	};
	LDAP_DEFAULTS.customSearchAttributes = ['dn','memberOf'];
	LDAP_DEFAULTS.customProfileFunc = (entry) => {
		return _.defaults({
			profile: {
				isAdmin: parseAdminStatus(entry.memberOf)
			}
		}, LDAP_DEFAULTS.customProps);
	};

	ldapClient = ldap.createClient({
		url: LDAP_DEFAULTS.url + ':' + LDAP_DEFAULTS.port,
		reconnect: true // ALSO APPARENTLY NECESSARY TO STOP THE ENTIRE APP CRASHING ... LDAPJS HAS THE BEST DOCS EVER 
	});
	ldapClient.on('error',(err)=>{
		console.warn('LDAP connection failed; reconnecting');
	});

	Meteor.call('fortiGate.getPolicies');
	Meteor.call('ldap.syncUsers');
	Meteor.setInterval(()=>{Meteor.call('ldap.syncUsers')}, Meteor.settings.ldap.syncInterval * 1e3);

	Meteor.publish('allowedPolicies', data => {
		const mUser = Meteor.users.findOne({_id: data.userId});
		if (mUser.profile.isAdmin) {
			// return a cursor to all pols
			return Policies.find({});
		} else {
			// lookup by ID since that's all meteor gives you to start with
			const user = AppUsers.findOne({ _id: mUser.username });	/* also deliberate but very suboptimal */
			// return a cursor to only those pols in the profile
			return Policies.find({ _id: { $in: user.profile.policies.map(e => {return e.toString()}) } });
		}
	});
	
	Meteor.publish('ownUserData', data => {
		return AppUsers.find({ _id: Meteor.users.findOne({_id: data.userId},{fields: {profile: 1}}).username });
	});
	
	Meteor.publish('allUserData', () => {
		return AppUsers.find({},{fields: {profile: 1, username: 1}});
	});

	Accounts.onLoginFailure((attempt) => { 
		console.log(attempt);
	});
});

Meteor.onConnection((connection) => {
	console.log("connected: " + connection.id);
});

Meteor.methods({
	'fortiGate.getPolicies': fortiGateGetPolicies,
	'fortiGate.putPolicy': fortiGatePutPolicy,
	'ldap.syncUsers': ldapSyncUsers,
	'updateUserPolicies': updateUserPolicies,
	'log': log,
});

function optionsBuilder(opts) {
	if (Meteor.isDevelopment) {
		opts.rejectUnauthorized = false; 
	}
	return opts;
}

function fortiGateGetPolicies() {
	console.log('GETTING POLICIES');
	HTTP.call(
		'GET',
		'https://' + Meteor.settings.fortiGate.hostname + '/api/v2/cmdb/firewall/policy/?vdom=' + Meteor.settings.fortiGate.vdom + '&format=policyid|name|comments|status',
		{
			npmRequestOptions: optionsBuilder({
				headers: {
					'Authorization': 'Bearer ' + Meteor.settings.fortiGate.token
				}
			})
		},
		(err, res) => {
			if (!err) {
				for (var i in res.data.results) {
					const doc = res.data.results[i];
					Policies.update(
						{ "_id": "" + doc['policyid'] },
						doc,
						{ upsert: true }
					);
				}
			} else {
				console.log(err);
			}			
		}
	);
}

function fortiGatePutPolicy(data) {
	const newStatus = data.enable ? "enable" : "disable";
	HTTP.call(
		'PUT',
		'https://' + Meteor.settings.fortiGate.hostname + '/api/v2/cmdb/firewall/policy/' + data.rowData.policyid + '/?vdom=' + Meteor.settings.fortiGate.vdom,
		{
			npmRequestOptions: optionsBuilder({
				headers: {
					'Authorization': 'Bearer ' + Meteor.settings.fortiGate.token
				}
			}),
			data: {
				"json": {
					"status": newStatus
				}
			}
		},
		(err, res) => {
			if (!err && res.data.status == "success") {
				Policies.update(
					{ "_id": "" + data.rowData.policyid },
					{ $set: { status: newStatus }}
				);
				fortiGateGetPolicies();
			} else {
				console.log(err);
			}
		}
	);
	return 0;
}

function ldapSyncUsers() {
	console.log("LOADING USERS FROM LDAP");

	/* 
	ldapsearch -LLL -h sa-dc01.acc01.vumc.nl -x 
	-D "CN=svc-ldap-vpnctrl,OU=Service Accounts,DC=acc01,DC=vumc,DC=nl" -w 1D2aQkp27j36Ub1CRA1t 
	-b "DC=acc01,DC=vumc,DC=nl" 
	"(&(objectCategory=Person)(memberOf=CN=GG_VPNControl,OU=ICT,OU=VUMC Users,DC=acc01,DC=vumc,DC=nl))"
	*/

	ldapClient.bind(Meteor.settings.ldap.bind, Meteor.settings.ldap.creds, Meteor.bindEnvironment((err) => {
		if (!err) {
			// create entryset
			let ldapEntries = {};

			ldapClient.search(
				Meteor.settings.ldap.baseDN,
				{ 
					filter: Meteor.settings.ldap.searchFilter,
					scope: 'sub' // THIS IS APPARENTLY NECESSARY, THANKS FOR DOCUMENTING IT LDAPJS ... NOT
				},
				Meteor.bindEnvironment((err, res) => {
					if (!err) {
						res.on('searchEntry', (entry) => {
							ldapEntries[entry.object.sAMAccountName.toLowerCase()] = entry.object.memberOf;
						});
						res.on('searchReference', (referral) => {
							// console.log('referral: ' + referral.uris.join());
						});
						res.on('error', (err) => {
							console.error('error: ' + err.message);
						});
						res.on('end', Meteor.bindEnvironment((result) => {
							console.log('LDAP QUERY EXIT STATUS: ' + result.status);
							
							//create lookup
							let mongoUsers = {};

							AppUsers.find({}).fetch().forEach((e)=>{
								mongoUsers[e['_id']] = e['_id'];
							});
							
							// use the lookup 
							for (var ldapEntryId in ldapEntries) {
								if (typeof mongoUsers[ldapEntryId] == 'undefined') {
									// case: in ldap, not in mongo
									// add to mongoDB directly 
									let user = {
										_id: ldapEntryId, // also deliberate 
										username: ldapEntryId,
										profile: {
											isAdmin: parseAdminStatus(ldapEntries[ldapEntryId]),
											policies: []
										}
									};

									AppUsers.insert(user);
								} else {
									// case: in ldap AND in mongo	
									// pop it off the mongo object, we're done here
									delete mongoUsers[ldapEntryId];
								}
							}
							
							// mongo object should now contain only the users that were NOT in ldap
							// remove them
							for (var mongoUserId in mongoUsers) {
								AppUsers.remove({_id: mongoUsers[mongoUserId]});
							}
						}));
					}
				}
			));
		} else {
			console.log(err);		
		}
	}));
}

function updateUserPolicies(username, newPoliciesArray) {
	const appUser = AppUsers.findOne({ username: username });
	const newAppUserProfile = {
		isAdmin: appUser.profile.isAdmin,
		policies: newPoliciesArray
	};
	AppUsers.update(
		{ _id: appUser['_id'] },
		{ $set: { profile: newAppUserProfile } }
	);
}

async function log(user, event, data) {
	/*
	Per actie:
		-	Gebruikersnaam
		-	Datetime van actie
		-	Actietype
			o	1 Inloggen
			o	2 uitloggen
			o	3 Policy aangezet
			o	4 policy uitgezet
		-	Policynaam (indien actietype 3 of 4)
	*/
	
	const appUser = Meteor.users.findOne({_id: user}).username;
	
	let rec = {
		user: appUser,
		event: event,
		datetime: Date.now()
	}
	if (data) {
		let policy = await Policies.findOne({policyid: data.policy});
		rec.data = data;
		rec.data.policyName = policy.name;
	}
	let logged = await Logging.insert(rec);
	return logged;
}