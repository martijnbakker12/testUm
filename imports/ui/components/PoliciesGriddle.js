import React, { Component } from 'react';
import Griddle, { connect as griddleConnect, plugins, RowDefinition, ColumnDefinition } from 'griddle-react';
import { Accordion } from 'react-accessible-accordion';
import { connect } from 'react-redux';
import PolicyToggle from './PolicyToggle.js';
import UsersDropdownToggle from './UsersDropdownToggle.js';
import PropTypes from 'prop-types';
import 'react-accessible-accordion/dist/minimal-example.css';

// export default
 class PoliciesGriddle extends Component {
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

		if (!this.props.loading) {
			return (
				<div className="container">
					<Accordion>
						<Griddle 
							data={this.props.policies}
							plugins={[plugins.LocalPlugin]}
							components={{Layout: griddleLayout}}>
							<RowDefinition>
								<ColumnDefinition id="_id" isMetadata/>
								<ColumnDefinition id="griddleKey" isMetadata />
								<ColumnDefinition id="status" isMetadata />
								<ColumnDefinition id="users" title=" " width="10%" visible={this.props.userIsAdmin} 
									customComponent={enhancedWithRowData(UsersDropdownToggle)}
									extraData={{selected: this.props.tableState.selectedRow}}/> 
								<ColumnDefinition id="policyid" title="Policy ID" visible />
								<ColumnDefinition id="q_origin_key" title="Origin Key" visible />
								<ColumnDefinition id="name" title="Name" visible />
								<ColumnDefinition id="comments" title="Comments" visible={false} />
								<ColumnDefinition id="toggle" title=" " width="30%" visible
									customComponent={enhancedWithRowData(PolicyToggle)}/>
							</RowDefinition>
						</Griddle>
					</Accordion>
				</div>
			);
		} else {
			return null;
		}
	}
}

PoliciesGriddle.propTypes = {
	loading: PropTypes.bool,
	policies: PropTypes.array,
	userIsAdmin: PropTypes.bool,
};

const rowDataSelector = (state, { griddleKey }) => {
	return state.get('data').find(rowMap => rowMap.get('griddleKey') === griddleKey).toJSON();
};

const enhancedWithRowData = griddleConnect((state, props) => {
	return {
		rowData: rowDataSelector(state, props)
	};
});

export default connect(
	(state, ownProps) => {
		return {
			tableState: { selectedRow: state.tableState.selectedRow }
		};
	},
	dispatch => {
		return {
			selectRow: (row) => {
				dispatch({
					type: 'SELECT_ROW',
					payload: { row: row }
				});
			},
			deselectRow: () => {
				dispatch({ type: 'DESELECT_ROW' });
			},
		};
	}
)(PoliciesGriddle);