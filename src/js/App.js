import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

// React Components
import Index from './components/Index';
import PokemonSearch from './components/SearchForm';

const App = React.createClass({
	render: function() {
    return (
  		<Router history={ browserHistory } >
     		<Route path='/' component={ Index } />
     		<Route path='/search' component={ PokemonSearch } />
     </Router>
    );
  }
});

const app = document.getElementById('app');

ReactDOM.render(<App />, app);