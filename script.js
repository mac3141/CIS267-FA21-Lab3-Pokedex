const poke_container = document.getElementById('poke-container');
const pokemon_count = 150;
const typeColors = {
    fire: '#FEAC72',
    grass: '#B6DA81',
    electric: '#F4E47C',
    water: '#73ADD3',
    ground: '#C6B56C',
    rock: '#D5B834',
    fairy: '#FEEBF9',
    poison: '#D0A9DB',
    bug: '#92BF5F',
    dragon: '#9D75FA',
    psychic: '#F7A1D3',
    flying: '#7BDAF4',
    fighting: '#E59461',
    normal: '#C9CDCF',
    ice: '#93DBF0',
    ghost: '#9E8BBB',
    dark: '#8F8F8F',
    steel: '#C4D3D4'
};

const main_types = Object.keys(typeColors); // ["fire", "grass", "electric", ...]

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

    const type1 = pokemon.types[0].type.name;
    const type2 = pokemon.types.length > 1 ? pokemon.types[1].type.name : null;

    let allTypes = [type1];
    if (type2 != null) {
        allTypes.push(type2);
    }

    let colors = [typeColors[type1]];
    colors.push(pokemon.types.length > 1 ? typeColors[type2] : typeColors[type1]);

    //console.log(`${type1} | ${type2}`);

    pokemonEl.style.background = `linear-gradient(30deg, ${colors[0]} 50%, ${colors[1]} 50%)`;

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
        <small class="type">Type: <span>${allTypes.join(" | ")}</span> </small>
    </div>
    `;

    pokemonEl.innerHTML = pokemonInnerHTML;

    poke_container.appendChild(pokemonEl);

    // It works, but the heart color changing is weird and I don't like how updating the favorites list works
    const heart = document.getElementById(pokemon.id);
    heart.addEventListener("click", () => {
        pokemon.isFavorite = !pokemon.isFavorite;
        heart.style.color = pokemon.isFavorite ? "#F52F07" : "rgba(255, 255, 255, 0.5)";
        // Maybe make favorites an array like colors? "name": object -- somehow need to remove specific pokemon when unclick
        favorites = allPokemon.filter(poke => {
            return poke.isFavorite;
        });
    });
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