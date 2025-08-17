import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PoliciesGriddle from './PoliciesGriddle.js'; 
import { Policies } from '../../collections/policies.js';
// import { AppUsers } from '../../collections/app_users.js';

export default PoliciesGriddleContainer = withTracker(userId => {
	const policiesHandle = Meteor.subscribe('allowedPolicies', userId);
	const userDataHandle = Meteor.subscribe('ownUserData', userId);

	return {
		loading: !(policiesHandle.ready() && userDataHandle.ready()),
		policies: policiesHandle.ready() ? Policies.find().fetch() : [],
		userIsAdmin: userDataHandle.ready() ? Meteor.users.findOne().profile.isAdmin : false,
	};
})(PoliciesGriddle);