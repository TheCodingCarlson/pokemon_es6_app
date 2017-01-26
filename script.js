'use strict';

// fetch options object
const fetchOptions = {
	headers: {
		'Content-Type': 'application/json'	
	},
	mode: 'cors'
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

// get the double damage types of pokemon - must us spread to flatten our 2 dimensional array
function getDoubleDamagePokemon(pokemonTypes) {
	pokemonTypes = pokemonTypes.map(types => {
		return types.damage_relations.double_damage_from;
	})
	.reduce((a,b) => [...a,...b], []);


	console.log(pokemonTypes);
};

// grab types from the form, account for extra spaces
$('form').on('submit', function(e) {
	e.preventDefault();
	let types = $('input[type=text]').val().replace(/\s/g, '').split(',');
	console.log(types);

	// map over the trainer calls, and call fetch with each element
	let trainerTypeCalls = types.map(elem => {
		return fetch(`http://pokeapi.co/api/v2/type/${elem}/`, fetchOptions)
	});

	// call helper function and convert our data
	getPromiseData(trainerTypeCalls)
		.then(result => {
			console.log(result);
			getDoubleDamagePokemon(result);
		});
});








