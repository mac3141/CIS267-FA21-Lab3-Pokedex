const poke_container = document.getElementById('poke-container');
const pokemon_count = 150;
const colors = {
    fire: '#fd7d24',
    grass: '#9bcc50',
    electric: '#eed535',
    water: '#4592c4',
    ground: '#ab9842',
    rock: '#a38c21',
    fairy: '#fdb9e9',
    poison: '#b97fc9',
    bug: '#729f3f',
    dragon: '#7038f8',
    psychic: '#f366b9',
    flying: '#3dc7ef',
    fighting: '#d56723',
    normal: '#a4acaf',
    ice: '#51c4e7',
    ghost: '#7b62a3',
    dark: '#707070',
    steel: '#9eb7b8'
};

const main_types = Object.keys(colors); // ["fire", "grass", "electric", ...]

let allPokemon = [];
let favorites = [];

const fetchPokemon = async () => {
    for (let i = 1; i <= pokemon_count; i++) {
        let p = await getPokemon(i);
        p.isFavorite = false;
        allPokemon.push(p);
    }
};

const getPokemon = async function (id) {
    // Get Pokemon data from pokeapi
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const response = await fetch(url);
    const data = await response.json();

    return data;
};

const renderPokemon = async function (pokemonArray) {
    pokemonArray.forEach(pokemon => createPokemonCard(pokemon));
}

const createPokemonCard = (pokemon) => {
    const pokemonEl = document.createElement('div');
    pokemonEl.classList.add('pokemon');

    const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
    const id = pokemon.id.toString().padStart(3, '0');

    //const poke_types = pokemon.types.map(type => type.type.name);
    //const type = main_types.find(type => poke_types.indexOf(type) > -1);
    const type1 = pokemon.types[0].type.name;
    const type2 = pokemon.types.length > 1 ? pokemon.types[1].type.name : null;

    let allTypes = [type1];
    if (type2 != null) {
        allTypes.push(type2);
    }
    
    const color = colors[type1];

    //console.log(`${type1} | ${type2}`);

    pokemonEl.style.backgroundColor = color;

    const officialArtwork = pokemon.sprites.other["official-artwork"].front_default;

    const pokemonInnerHTML = `
    <div class="favorite"><a href="#" id="${pokemon.id}">&heartsuit;</a></div>
    <div class="img-container">
        <!--<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png"" alt="${name}">-->
        <img src="${officialArtwork}" />
    </div>
    <div class="info">
        <span class="number">#${id}</span>
        <h3 class="name">${name}</h3>
        <small class="type">Type: <span>${allTypes}</span> </small>
    </div>
    `;

    pokemonEl.innerHTML = pokemonInnerHTML;

    poke_container.appendChild(pokemonEl);

    // FIXME: It double-favorites. Not good. Maybe write a function. Maybe an if statement. I really don't know.
    /*const heart = document.getElementById(pokemon.id);
    heart.addEventListener("click", () => {
        pokemon.isFavorite = true;
        favorites.push(pokemon);
    });*/
};

async function loadAllPokemon() {
    await fetchPokemon();
    renderPokemon(allPokemon);
}

function clearPokemon() {
    poke_container.innerHTML = "";
}

function updateSearchResults() {
    const searchInput = document.getElementById("searchInput");
    const searchQuery = searchInput.value;

    console.log(searchQuery);
    console.log(typeof (searchQuery));



    // search by name or id, HALLELUJAH FIRST TRY
    let searchResults = allPokemon.filter(pokemon => {
        if (pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) || pokemon.id.toString().includes(searchQuery)) {
            return true;
        }

        //return pokemon.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    clearPokemon();
    renderPokemon(searchResults);
}

loadAllPokemon();

const searchButton = document.getElementById("searchButton");
const all = document.getElementById("all");
const favs = document.getElementById("favorites");

searchButton.addEventListener("click", () => {
    updateSearchResults();
});

all.addEventListener("click", () => {
    clearPokemon();
    loadAllPokemon();
});

favs.addEventListener("click", () => {
    clearPokemon();
    renderPokemon(favorites);
});

searchInput.addEventListener("keyup", () => updateSearchResults());

document.addEventListener("keypress", e => {
    if (e.key == "Enter") {
        updateSearchResults();
    }
});