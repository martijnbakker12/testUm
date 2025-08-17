import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AccordionItem, AccordionItemTitle, AccordionItemBody } from 'react-accessible-accordion';
import FontAwesome from 'react-fontawesome';
import UsersGriddleContainer from './UsersGriddleContainer';
import { throws } from 'assert';

var someCondition = false;

export default class UsersDropdownToggle extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		// console.log(this.props.griddleKey, this.props.selected);
		return (
			<AccordionItem>
				<AccordionItemTitle>
					<FontAwesome name="users" className={someCondition ? "user-dropdown dropped" : "user-dropdown undropped"} />
				</AccordionItemTitle>
				<AccordionItemBody>
					<UsersGriddleContainer policyId={this.props.rowData.policyid}/>
				</AccordionItemBody>
			</AccordionItem>
		);
	}
} 