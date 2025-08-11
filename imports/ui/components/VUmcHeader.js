import React, { Component } from 'react';

export default class VUmcHeader extends Component {
	render() {
		return (
			<div className="container header-container">
				<header>
					<img className="logo" src="imgs/umc.jpg"/>
					<div className="header-stickybar"/>
					<h1>VPN Control v3.0</h1>
				</header>
			</div>
		);
	}
}