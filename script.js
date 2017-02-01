'use strict';

// fetch options object
const fetchOptions = {
	headers: {
		'Content-Type': 'application/json'	
	},
	mode: 'cors'
};

// helper function to flatten 2 dimensional arrays
const flatten = (a,b) => [...a,...b];

// helper function to get random pokemon
function getRandomPokemon(pokemonArray) {
	return pokemonArray[ Math.floor(Math.random() * pokemonArray.length) ];
};

// helper function to convert data to json using promises
function getPromiseData(promisesArray) {
	return new Promise((resolve, reject) => {
		Promise.all(promisesArray)
			.then(res => {
				return res.map(type => type.json());
			})
			.then(res => {
				Promise.all(res)
					.then(resolve);
			})
			.catch(reject);
	});
};

// function to build pokemon team
function buildTeam(pokemons) {
	let team = [];

	pokemons = pokemons.map(pokemon => {
		return pokemon.pokemon;
	})
	.reduce(flatten, [])
	.map(pokemon => pokemon.pokemon);

	for(let i = 0; i < 6; i++) {
		team.push(getRandomPokemon(pokemons));
	}

	console.log('Team:', team);

	team = team.map(pokemon => {
		return fetch(pokemon.url, fetchOptions);
	});

	getPromiseData(team)
		.then(pokemonData => {
			displayPokemon(pokemonData);
		});
};

// get the double damage types of pokemon then call fetch with each types url
function getDoubleDamagePokemon(pokemonTypes) {
	pokemonTypes = pokemonTypes.map(types => {
		return types.damage_relations.double_damage_from;
	})
	.reduce(flatten, [])
	.map(type => {
		return fetch(type.url, fetchOptions)
	});

	getPromiseData(pokemonTypes)
		.then(results => {
			buildTeam(results);
		});
};

// on submit form function
$('.team-form').on('submit', function(e) {
	// prevent default
	e.preventDefault();

	// set types to user input - account for extra spaces
	let types = $('#team-search').val().replace(/\s/g, '').split(',');

	// map over the trainer calls, and call fetch with each element
	let trainerTypeCalls = types.map(elem => {
		return fetch(`http://pokeapi.co/api/v2/type/${elem}/`, fetchOptions)
	});

	// call helper function and convert our data
	getPromiseData(trainerTypeCalls)
		.then(result => {
			getDoubleDamagePokemon(result);
		});
});

$('.search-form').on('submit', function(e) {
	e.preventDefault();

	let term = $('#specific-search').val();

	fetch(`http://pokeapi.co/api/v2/pokemon/${term}/`, fetchOptions)
		.then(res => res.json())
		.then(data => console.log(data))
});

function displayPokemon(pokemons) {
	pokemons.forEach(pokemon => {
		var $container = $('<div>').addClass('pokemon card');
		var $image = $('<img>').attr('src', `http://pokeapi.co/media/img/${pokemon.id}.png`);
		var $title = $('<h2>').text(pokemon.name);
		$container.append($image, $title);
		$('.pokemon-container').append($container);
	});
};