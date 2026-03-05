const POKEMON_API_BASE_URL = 'https://pokeapi.co/api/v2/';

let limit = 20;
let offset = 0;
let loading = false;

async function fetchPokemonList() {
  if (loading) return;
  loading = true;

  try {
    const endpoint = `pokemon?limit=${limit}&offset=${offset}`;
    const response = await fetch(POKEMON_API_BASE_URL + endpoint);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results; // Return the list of Pokemon
  } catch (error) {
    console.error('Error fetching Pokemon list:', error);
    return [];
  } finally {
    loading = false;
  }
}

async function fetchAllTypes() {
  try {
    const endpoint = 'type';
    const response = await fetch(POKEMON_API_BASE_URL + endpoint);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results; // Return list of all types
  } catch (error) {
    console.error('Error fetching types:', error);
    return [];
  }
}

async function fetchPokemonByType(typeName) {
  try {
    const endpoint = `type/${typeName}`;
    const response = await fetch(POKEMON_API_BASE_URL + endpoint);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.pokemon.map(p => p.pokemon); // Return list of Pokemon of that type
  } catch (error) {
    console.error('Error fetching Pokemon by type:', error);
    return [];
  }
}

async function mappinbytypepokemonList(typeName) {
  const pokemonList = await fetchPokemonByType(typeName);
  
  if (pokemonList.length === 0) {
    console.log('No Pokemon found for type:', typeName);
    return [];
  }
  
  const mappedList = pokemonList.map(pokemon => ({
    name: pokemon.name,
    url: pokemon.url
  }));
  
  return mappedList;
}
function getpokemontypesprite(pokemonUrl) {
  const id = pokemonUrl.split('/').filter(Boolean).pop();
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/${id}.png`;
}

async function mappingpokemonList() {
  const pokemonList = await fetchPokemonList();
  
  if (pokemonList.length === 0) {
    console.log('No Pokemon found');
    return;
  }
  
  const mappedList = pokemonList.map(pokemon => ({
    name: pokemon.name,
    url: pokemon.url
  }));
  
  return mappedList;
}

function getpokemonimage(pokemonUrl) {
  const id = pokemonUrl.split('/').filter(Boolean).pop();
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

function loadMorePokemon(elementId) {
  offset += limit;
  displayPokemonList(elementId);
}
let stylesInjected = false;

function injectStylesOnce() {
  if (stylesInjected) return;
  stylesInjected = true;

  const style = document.createElement("style");
  style.textContent = `
    #pokemon-display {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
    padding: 16px;
    width: 100%; /* make sure grid takes full width */
    box-sizing: border-box; /* include padding in width */
    }

    .page-container {
    width: 100%; /* fix the wrong id selector */
    max-width: 1200px; /* optional, to prevent super wide layout */
    margin: 0 auto;
    }

    .pokemon-card {
      background: white;
      border-radius: 12px;
      padding: 12px;
      text-align: center;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      cursor: pointer;
    }

    .pokemon-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 18px rgba(0,0,0,0.15);
    }

    .pokemon-card img {
      width: 120px;
      height: 120px;
      object-fit: contain;
      display: block;
      margin: 0 auto;
    }

    .pokemon-card p {
      margin-top: 8px;
      font-weight: bold;
      text-transform: capitalize;
      font-family: sans-serif;
    }
  `;
  document.head.appendChild(style);
}

async function displayPokemonList(elementId) {
  injectStylesOnce(); // inject CSS only once

  const pokemonList = await mappingpokemonList();
  
  if (!pokemonList) {
    console.log('Failed to fetch Pokemon list');
    return;
  }
  
  const element = document.getElementById(elementId);
  
  if (!element) {
    console.log(`Element with id "${elementId}" not found`);
    return;
  }

  // Only clear on first load
  if (offset === 0) {
    element.innerHTML = '';
  }

  pokemonList.forEach(pokemon => {
  const link = document.createElement('a');
  link.href = `pokemon.html?name=${pokemon.name}`;
  link.style.textDecoration = "none";
  link.style.color = "inherit";

  const card = document.createElement('div');
  card.classList.add('pokemon-card');

  const img = document.createElement('img');
  img.src = getpokemonimage(pokemon.url);
  img.alt = pokemon.name;
  img.onerror = function() {
    this.src = 'PokemonNF.png';
  };

  const name = document.createElement('p');
  name.textContent =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  card.appendChild(img);
  card.appendChild(name);
  link.appendChild(card);
  element.appendChild(link);
});
}

async function displayPokemonCardtype(elementId, typeName) {
    injectStylesOnce(); // inject CSS only once
    const pokemonList = await mappinbytypepokemonList(typeName);
  
    if (!pokemonList) {
        console.log('Failed to fetch Pokemon list');
        return;
    }
    
    const element = document.getElementById(elementId);
    
    if (!element) {
        console.log(`Element with id "${elementId}" not found`);
        return;
    }

    if (offset === 0) {
        element.innerHTML = '';
    }

    pokemonList.forEach(pokemon => {
    const link = document.createElement('a');
    link.href = `pokemon.html?name=${pokemon.name}`;
    link.style.textDecoration = "none";
    link.style.color = "inherit";

    const card = document.createElement('div');
    card.classList.add('pokemon-card');

    const img = document.createElement('img');
    img.src = getpokemonimage(pokemon.url);
    img.alt = pokemon.name;
    img.onerror = function() {
      this.src = 'PokemonNF.png';
    };

    const name = document.createElement('p');
    name.textContent =
        pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

    card.appendChild(img);
    card.appendChild(name);
    link.appendChild(card);
    element.appendChild(link);
    });
}
