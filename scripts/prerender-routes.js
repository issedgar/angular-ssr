
const TOTAL_POKEMONS = 10;
const TOTAL_PAGES = 5;

(async () => {

    const fs = require('fs');

    const pokemonIds = Array.from({ length: TOTAL_POKEMONS }, (_, i) => i + 1);
    let fileContent = pokemonIds.map(
        id => `/pokemons/${ id }`
    ).join('\n');

    for (let index = 0; index <= TOTAL_PAGES; index++) {
        fileContent += `\n/pokemons/pages/${ index }`;        
    }

    const pokemonList = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${ TOTAL_POKEMONS }`)
    .then( res => res.json());

    fileContent += '\n';

    fileContent += pokemonList.results.map(
        pokemon => `/pokemons/${ pokemon.name }`
    ).join('\n');

    fs.writeFileSync('routes.txt', fileContent);
})();