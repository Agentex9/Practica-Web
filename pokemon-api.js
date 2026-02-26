// Pokemon API Module
// Base URL for PokéAPI
const POKEMON_API_BASE_URL = 'https://pokeapi.co/api/v2/';

// Function to fetch Pokemon data
async function fetchPokemon(pokemonName) {
  try {
    const endpoint = `pokemon/${pokemonName}`;
    const response = await fetch(POKEMON_API_BASE_URL + endpoint);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Pokemon:', error);
    return null;
  }
}

// Function to display Pokemon info
async function displayPokemonInfo(pokemonName) {
  const pokemon = await fetchPokemon(pokemonName);
  
  if (!pokemon) {
    console.log('Failed to fetch Pokemon data');
    return;
  }
  
  // Extract key information
  const info = {
    name: pokemon.name,
    id: pokemon.id,
    height: pokemon.height + ' m',
    weight: pokemon.weight + ' kg',
    types: pokemon.types.map(t => t.type.name).join(', '),
    abilities: pokemon.abilities.map(a => a.ability.name).join(', '),
    baseExperience: pokemon.base_experience,
    sprite: pokemon.sprites.front_default,
    stats: pokemon.stats.map(s => ({
      name: s.stat.name,
      baseStat: s.base_stat
    }))
  };
  
  return info;
}

// Function to display Pokemon in HTML
async function displayPokemonCard(pokemonName, elementId) {
  const pokemon = await fetchPokemon(pokemonName);
  
  if (!pokemon) {
    console.log('Failed to fetch Pokemon data');
    return;
  }
  
  const element = document.getElementById(elementId);
  
  if (!element) {
    console.error(`Element with ID ${elementId} not found`);
    return;
  }
  
  const statsHTML = pokemon.stats
    .map(s => `<div class="stat"><span>${s.stat.name}</span>: ${s.base_stat}</div>`)
    .join('');
  
  const html = `
    <div class="pokemon-card">
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" class="pokemon-sprite" />
      <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
      <p><strong>ID:</strong> ${pokemon.id}</p>
      <p><strong>Height:</strong> ${(pokemon.height).toFixed(1)} m</p>
      <p><strong>Weight:</strong> ${(pokemon.weight).toFixed(1)} kg</p>
      <p><strong>Type:</strong> ${pokemon.types.map(t => t.type.name).join(', ')}</p>
      <p><strong>Abilities:</strong> ${pokemon.abilities.map(a => a.ability.name).join(', ')}</p>
      <p><strong>Base Experience:</strong> ${pokemon.base_experience}</p>
      <div class="pokemon-stats">
        <h3>Stats:</h3>
        ${statsHTML}
      </div>
    </div>
  `;
  
  element.innerHTML = html;
}

// Function to log Pokemon data to console
async function logPokemonData(pokemonName) {
  const pokemon = await fetchPokemon(pokemonName);
  
  if (!pokemon) {
    console.log('Failed to fetch Pokemon data');
    return;
  }
  
  console.log('=== Pokemon Data ===');
  console.log('Name:', pokemon.name);
  console.log('ID:', pokemon.id);
  console.log('Height:', (pokemon.height) + ' m');
  console.log('Weight:', (pokemon.weight) + ' kg');
  console.log('Types:', pokemon.types.map(t => t.type.name));
  console.log('Abilities:', pokemon.abilities.map(a => a.ability.name));
  console.log('Base Experience:', pokemon.base_experience);
  console.log('Stats:', pokemon.stats);
  console.log('Full Data:', pokemon);
}

// CSS Styles for Pokemon Card (optional)
function addPokemonStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .pokemon-card {
      border: 2px solid #333;
      border-radius: 8px;
      padding: 20px;
      max-width: 300px;
      margin: 20px auto;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    }
    
    .pokemon-card h2 {
      margin-top: 10px;
      text-align: center;
      font-size: 24px;
    }
    
    .pokemon-card p {
      margin: 8px 0;
    }
    
    .pokemon-sprite {
      display: block;
      margin: 0 auto;
      width: 150px;
      height: 150px;
      image-rendering: pixelated;
    }
    
    .pokemon-stats {
      margin-top: 15px;
      background: rgba(0, 0, 0, 0.2);
      padding: 10px;
      border-radius: 5px;
    }
    
    .pokemon-stats h3 {
      margin-top: 0;
      margin-bottom: 10px;
    }
    
    .stat {
      display: flex;
      justify-content: space-between;
      margin: 5px 0;
      padding: 5px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
    }
  `;
  document.head.appendChild(style);
}

// Initialize styles when DOM is ready
document.addEventListener('DOMContentLoaded', addPokemonStyles);
