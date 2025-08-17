import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

class Login extends Component {
	constructor(props) {
		super(props);
		Accounts.onLoginFailure((err) => { 
			try {
				JSON.parse(err.error.message);
				if (JSON.parse(err.error.message) instanceof Array) {
					let er = JSON.parse(err.error.message)[0];
					alert("Login error: " + er.name + " " + er.message);
				} 
			} catch (exc) {
				alert("Login error: " + err.error.message);
			}
		});
	}
	
	render() {
		return (
			<div className="container">
				<form className="login-form" onSubmit={this.handleSubmit.bind(this)}>
					<label>
						Username
						<input type="text" ref={username => this.username = username} />
					</label>
					<label>
						Password
						<input type="password" ref={password => this.password = password} />
					</label>
					<Button block bsSize="large" type="submit">Sign In</Button>
				</form>
			</div>
		);
	}
	
	handleSubmit(e) {
		e.preventDefault();
		let usr = this.username.value;
		let pwd = this.password.value;
		Meteor.loginWithLDAP(usr, pwd, {
			searchBeforeBind: {
				sAMAccountName: usr
			}
		}, err => {
			if (!err) {
				this.props.login();
			}
		});
	}
}

const mapStateToProps = (state, ownProps) => {
	return { 
		isLoggedIn: state.loginState.isLoggedIn,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		login: () => {
			Meteor.call('log', Meteor.userId(), "logged in");
			Meteor.call('fortiGate.getPolicies');
			dispatch({type: 'USER_LOGIN'});
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(Login));