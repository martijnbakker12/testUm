import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { AppUsers } from '../../collections/app_users.js';
import UsersGriddle from './UsersGriddle.js'; 

export default UsersGriddleContainer = withTracker(() => {
	const usersDataHandle = Meteor.subscribe('allUserData');
	return {
		loading: !usersDataHandle.ready(),
		users: usersDataHandle.ready() ? AppUsers.find().fetch().filter(e => {
			if(e.profile.isAdmin) {
				return false;
			} else {
				return true;
			}
		}).map(e => {
			delete e._id;
			return e;
		}) : []
	};
})(UsersGriddle);