const poke_container = document.getElementById('poke-container');
const pokemon_count = 200;
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
let pokemonSpecies = [];

const fetchPokemon = async () => {
    for (let i = 1; i <= pokemon_count; i++) {
        let pokemon = await getPokemon(i);
        let species = await getPokemonSpecies(i);
        pokemon.isFavorite = false;
        pokemon.isLegendary = species.is_legendary;
        allPokemon.push(pokemon);
    }
};

const fetchPokemonSpecies = async () => {
    for (let i = 1; i <= pokemon_count; i++) {
        let p = await getPokemonSpecies(i);
        pokemonSpecies.push(p);
    }
};

const getPokemon = async function (id) {
    // Get Pokemon data from pokeapi
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const response = await fetch(url);
    const data = await response.json();

    return data;
};

const getPokemonSpecies = async function (id) {
    // Get Pokemon data from pokeapi
    const url = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
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

    const heart = document.getElementById(pokemon.id);
    heart.style.color = pokemon.isFavorite ? "#F52F07" : "rgba(255, 255, 255, 0.5)";

    heart.addEventListener("mouseover", () => {
        heart.style.color = "#F52F07";
    });

    heart.addEventListener("mouseout", () => {
        if (!pokemon.isFavorite) {
            heart.style.color = "rgba(255, 255, 255, 0.5)";
        }
    });

    heart.addEventListener("click", event => {
        event.preventDefault();
        pokemon.isFavorite = !pokemon.isFavorite;
        heart.style.color = pokemon.isFavorite ? "#F52F07" : "rgba(255, 255, 255, 0.5)";
        // console.log(favorites);
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

    // search by name or id, HALLELUJAH FIRST TRY
    let searchResults = allPokemon.filter(pokemon => {
        if (pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) || pokemon.id.toString().includes(searchQuery)) {
            return true;
        }
    });

    clearPokemon();
    renderPokemon(searchResults);
}

function updateFilters() {
    // loop through checkboxes, find all checked, render pokemon with the checked types
    let checkedTypes = [];

    checkboxes.forEach(box => {
        if (box.checked && box.id == "legendary") {
            for (let pokemon of allPokemon) {
                if (pokemon.isLegendary) {
                    checkedTypes.push(pokemon);
                }
            }
        }
        else if (box.checked) {
            // push pokemon with type that lines up with box value
            for (let pokemon of allPokemon) {
                if (pokemon.types[0].type.name == box.id && !checkedTypes.includes(pokemon)) {
                    checkedTypes.push(pokemon);
                }

                if (pokemon.types.length > 1) {
                    if (pokemon.types[1].type.name == box.id && !checkedTypes.includes(pokemon)) {
                        checkedTypes.push(pokemon);
                    }
                }
            }
        }
    });

    clearPokemon();

    if (checkedTypes.length == 0) {
        renderPokemon(allPokemon);
    }
    else {
        renderPokemon(checkedTypes);
    }

    // console.log(checkedTypes);
}

loadAllPokemon();

// EVENT LISTENERS

const searchButton = document.getElementById("searchButton");
const all = document.getElementById("all");
const favs = document.getElementById("favorites");

// Got help from https://medium.com/swlh/building-a-checkbox-filter-with-vanilla-javascript-29153cf466bd
const checkboxes = document.querySelectorAll("input[type='checkbox']");
checkboxes.forEach(box => {
    box.checked = false;
    box.addEventListener("change", () => {
        updateFilters();
    });
});

searchButton.addEventListener("click", () => {
    updateSearchResults();
});

all.addEventListener("click", () => {
    clearPokemon();
    renderPokemon(allPokemon);

    all.classList.add("active");
    favs.classList.remove("active");
});

favs.addEventListener("click", () => {
    let favorites = allPokemon.filter(pokemon => {
        return pokemon.isFavorite;
    });

    clearPokemon();
    renderPokemon(favorites);

    favs.classList.add("active");
    all.classList.remove("active");
});

// FIXME: This is only 1 filter button, and there's still 18 more, and and this one REALLY needs fixing...like BAD. Fun times ahead.
// legendary.addEventListener("click", () => {
//     legendary_count++;

//     let legends = allPokemon.filter(pokemon => {
//         return pokemon.isLegendary;
//     });

//     if (legendary_count % 2 != 0) {
//         clearPokemon();
//         renderPokemon(legends);
//     }
// });

searchInput.addEventListener("keyup", () => updateSearchResults());

document.addEventListener("keypress", e => {
    if (e.key == "Enter") {
        updateSearchResults();
    }
});