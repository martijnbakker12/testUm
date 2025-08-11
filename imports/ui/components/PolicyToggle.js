import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

export default class PolicyToggle extends Component {
	constructor(props) {
		super(props);
		this.state = {
			policyId: props.rowData.policyid,
			enabled: this.parseEnabledState(props.rowData.status)
		}
	}
	
	render() {
		return (
			<label className="switch">
			<input type="checkbox" policyid={this.state.policyId} onChange={this.togglePolicy.bind(this)} checked={this.parseEnabledState(this.props.rowData.status)} />
				<span className="slider round"></span>
			</label>
		);
	}
	
	parseEnabledState(string) {
		if (string == "enable") {
			return true;
		}
		return false;
	}
	
	togglePolicy(event) {
		Meteor.call('fortiGate.putPolicy',{
			rowData: this.props.rowData,
			enable: event.target.checked,
			userId: Meteor.userId()
		},(err, res) => {
			if (!err) {
				if (res === 0) {
					this.setState({enabled: !(this.state.enabled)});
					Meteor.call('log', Meteor.userId(), this.state.enabled ? "enabled" : "disabled", {policy: this.props.rowData.policyid})
				} else {
					throw new Error("fail");
				}
			}
		});
	}
}