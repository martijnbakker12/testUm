import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import PoliciesGriddleContainer from '../ui/components/PoliciesGriddleContainer.js';
import LogoutButton from '../ui/components/LogoutButton.js';

class AppView extends Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		if (this.props.isLoggedIn) {
			return (
				<div className="container app-level">
					<PoliciesGriddleContainer userId={Meteor.userId()}/>
					<LogoutButton />
				</div>
			);			
		} else {
			return (
				<Redirect to="/login" />
			);
		}
	}
}

const mapStateToProps = state => {
	return { isLoggedIn: state.loginState.isLoggedIn };
};

export default connect(mapStateToProps)(withRouter(AppView));