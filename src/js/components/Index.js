import React from 'react';
import { Link } from 'react-router';

const Index = React.createClass({
	render: function() {
		return (
			<div>
				<h1>Pokemon ES6 App</h1>
				<div className='btn-container'>
					<Link className='btn' to='/search'>Search</Link>
					<Link className='btn' to='/team'>Team</Link>
				</div>
			</div>
		);
	}
});

module.exports = Index;