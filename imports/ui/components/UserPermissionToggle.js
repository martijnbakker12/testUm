import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

export default class UserPermissionToggle extends Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		return (
			<label className="switch">
			<input type="checkbox" onChange={this.togglePolicy.bind(this)} checked={this.parseEnabledState(this.props.policyId, this.props.rowData.profile.policies)} />
				<span className="slider round"></span>
			</label>
		);
	}
	
	parseEnabledState(policy, array) {
		return array.includes(policy);
	}
	
	togglePolicy(event) {
		var newPolicies = this.props.rowData.profile.policies;
		const targetPolicy = this.props.policyId;
		if (event.target.checked) {
			if (!newPolicies.includes(targetPolicy)) {
				newPolicies.push(targetPolicy);
			}
		} else {
			newPolicies = newPolicies.filter((p) => {
				return p != targetPolicy;
			});
		}
		Meteor.call('updateUserPolicies',this.props.rowData.username, newPolicies);
	}
}