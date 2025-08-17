import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Login from '../ui/components/Login.js';

class LoginView extends Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		if (this.props.isLoggedIn) {
			return (
				<Redirect to="/" />
			); 
		} else {
			return (
				<div className="container">
					<Login/>
				</div>
			);
		}
	}
}

const mapStateToProps = (state, ownProps) => {
	return { 
		isLoggedIn: state.loginState.isLoggedIn,
	};
};

export default connect(mapStateToProps)(withRouter(LoginView));