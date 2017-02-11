import React from 'react';

const SearchForm = React.createClass({
	getInitialState: function() {
		return {
			term: '',
			loading: false,
			result: []
		}
	},
		
	handleChange: function(e) {
		this.setState({ term: e.target.value });
	},

	search: function(e) {
		e.preventDefault();

		this.setState({ loading: true });

		fetch(`http://pokeapi.co/api/v2/pokemon/${this.state.term}/`)
			.then(res => {
				if(res.status === 404) {
					this.setState({
						term: '',
						loading: false,
						result: []
					});
				} else {
					return res.json();
				}
			}).then(pokemon =>  {
				console.log(pokemon);
				this.setState({
					term: '',
					loading: false,
					result: pokemon
				});
			}).catch(error => {
				console.log(error);
			});
	},

	render: function() {
		return (
			<div>
				<h1>Search for Pokemon</h1>
				<form onSubmit={ this.search }>
					<p>Enter a valid Pokemon name to get details on that specific Pokemon.</p>
					<input type='text' 
						placeholder='Search for Pokemon'
						value={ this.state.term }
						onChange={ this.handleChange }
					/>
				</form>
				<PokemonDetails pokemon={ this.state.result } />
			</div>
		);
	}
});

const PokemonDetails = React.createClass({

	render: function() {
		return (
			<div>
				<h1>{ this.props.pokemon.name }</h1>
				<img src={ `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${ this.props.pokemon.id }.png` } />
				<p>Base Exp: { this.props.pokemon.base_experience }</p>
				<p>Height: { this.props.pokemon.height }</p>
				<p>Weight: { this.props.pokemon.weight }</p>
				<ul>
					
				</ul>
			</div>
		)
	}
});

const Loading = React.createClass({
	render: function() {
		return (
			<div>
				<h1 id='loading'>Loading
					<span className='dot' id='dot-one'>.</span>
					<span className='dot' id='dot-two'>.</span>
					<span className='dot' id='dot-three'>.</span>
				</h1>
			</div>
		);
	}
});

module.exports = SearchForm;