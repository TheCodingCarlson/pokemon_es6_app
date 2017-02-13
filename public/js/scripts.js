'use strict';

// hide loading messages
document.getElementById('loading').style.display = 'none';

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
	let randomPokemon = pokemonArray[ Math.floor(Math.random() * pokemonArray.length)];
	return randomPokemon;
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

	while(team.length < 6) {
		team.push(getRandomPokemon(pokemons));
	}

	// console.log('Team:', team);

	team = team.map(pokemon => {
		return fetch(pokemon.url, fetchOptions);
	});

	getPromiseData(team)
		.then(pokemonData => {
			document.getElementById('loading').style.display = 'none';
			$('#team-search').val('');
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

// create card elements with Pokemon data
function createPokemonElements(pokemon, page) {

	var $container = $('<div>').addClass('pokemon');
	$('.pokemon-container').append($container);

	var $image = $('<img>').addClass('pokemon-sprite');
	var $title = $('<h2>').text(pokemon.name);

	if (pokemon.sprites.front_default === null) {
		$image.attr('src', '../img/no-pic.png').addClass('no-pic');
	} else {
		$image.attr('src', pokemon.sprites.front_default).addClass('pokemon-sprite');
	}

	$container.append($image, $title);

	//if we are on the search page - display more info
	if(page === 'search') {
		var $baseExp = $('<p>').text('Base Exp: ' + pokemon.base_experience);
		var $height = $('<p>').text('Height: ' + pokemon.height);
		var $weight = $('<p>').text('Weight: ' + pokemon.weight);

		$container.append($baseExp, $height, $weight);

		if(pokemon.held_items.length > 0) {
			var $itemsList = $('<ul>').addClass('items-list').append('<li>Items:</li>');

			pokemon.held_items.map(item => {
				$itemsList.append(`<li>${item.item.name}</li>`);
			});

			$container.append($itemsList);
		}

		if(pokemon.abilities.length > 0) {
			var $abilitiesList = $('<ul>').addClass('abilites-list').append('<li>Abilities:</li>');

			pokemon.abilities.map(ability => {
				$abilitiesList.append(`<li>${ability.ability.name}</li>`);
			});

			$container.append($abilitiesList);
		}

		if(pokemon.types.length > 0) {
			var $typesList = $('<ul>').addClass('types-list').append('<li>Types:</li>');

			pokemon.types.map(type => {
				$typesList.append(`<li>${type.type.name}</li>`);
			});

			$container.append($typesList);
		}
	}
};

// display Pokemon function
function displayPokemon(pokemons) {
	pokemons.forEach(pokemon => {
		createPokemonElements(pokemon, 'team');
	});
};

// on submit team build function
$('.team-form').on('submit', function(e) {
	e.preventDefault();

	$('.pokemon-container').empty();

	document.getElementById('loading').style.display = 'block';

	// set types to user input - account for extra spaces
	let types = $('#team-search').val().replace(/\s/g, '').split(',');

	// map over the trainer calls, and call fetch with each element
	let trainerTypeCalls = types.map(elem => {
		return fetch(`http://pokeapi.co/api/v2/type/${elem}/`, fetchOptions)
	});

	// call helper function and convert our data
	getPromiseData(trainerTypeCalls)
		.then(result => {
	
			if(result[0].hasOwnProperty('detail')) {
				$('.pokemon-container').append('<h2>There are no Pokemon with that type</h2>');
				document.getElementById('loading').style.display = 'none';
				$('#team-search').val('');
			}

			getDoubleDamagePokemon(result);
		});
});

// on submit search function
$('.search-form').on('submit', function(e) {
	e.preventDefault();

	$('.pokemon-container').empty();

	document.getElementById('loading').style.display = 'block';

	let term = $('#specific-search').val().toLowerCase();

	fetch(`http://pokeapi.co/api/v2/pokemon/${term}/`, fetchOptions)
		.then(res =>  {

			if(res.status === 404) {
				$('.pokemon-container').append('<h2>There are no Pokemon with that name</h2>');
			}

			document.getElementById('loading').style.display = 'none';
			$('#specific-search').val('');
			return res.json();
		})
		.then(pokemon =>  {
			createPokemonElements(pokemon, 'search');
		}).catch(err => console.log(err));
});