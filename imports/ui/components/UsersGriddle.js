import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Griddle, { connect as griddleConnect, plugins, RowDefinition, ColumnDefinition } from 'griddle-react';
import UserPermissionToggle from './UserPermissionToggle.js';
import PropTypes from 'prop-types';

export default class UsersGriddle extends Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		const griddleLayout = ({Table, Pagination, Filter, SettingsWrapper}) => (
			<div>
				<Table/>
				<Pagination/>
			</div>
		);

		return (
			<div className="container">
				<div style={{display: Meteor.user().profile.isAdmin ? "inherit" : "none"}}>
					<Griddle 
						data={this.props.users}
						plugins={[plugins.LocalPlugin]}
						components={{Layout: griddleLayout}}>
						<RowDefinition>
							<ColumnDefinition id="_id" isMetadata />
							<ColumnDefinition id="griddleKey" isMetadata />
							<ColumnDefinition id="createdAt" isMetadata />
							<ColumnDefinition id="services" isMetadata />
							<ColumnDefinition id="username" title="Username" width="75%" visible />
							<ColumnDefinition id="profile" isMetadata />
							<ColumnDefinition id="permissionToggle" title= " " width="20%" visible
								customComponent={enhancedWithRowData(UserPermissionToggle)}
								extraData={{policyId: this.props.policyId}}  />
						</RowDefinition>
					</Griddle>
				</div>
			</div>
		);
	}
}

UsersGriddle.propTypes = {
	loading: PropTypes.bool,
	users: PropTypes.array,
};

const rowDataSelector = (state, { griddleKey }) => {
	return state.get('data').find(rowMap => rowMap.get('griddleKey') === griddleKey).toJSON();
};

const enhancedWithRowData = griddleConnect((state, props) => {
	return {
		rowData: rowDataSelector(state, props)
	};
});