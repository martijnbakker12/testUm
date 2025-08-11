import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux'

class LogoutButton extends Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		return (
			<div className="container">
				<Button block bsSize="large" onClick={this.logOut.bind(this)}>Sign Out</Button>
			</div>
		);
	}
	
	logOut(e) {
		this.props.logout();
	}
}

const mapDispatchToProps = dispatch => {
	return {
		logout: () => {
			Meteor.call('log', Meteor.userId(), "logged out");
			Meteor.logout();
			dispatch({type: 'USER_LOGOUT'});
		}
	}
};

export default connect(
	null,
	mapDispatchToProps
)(LogoutButton);