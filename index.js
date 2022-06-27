// API endpoint --------------------------------------------
const baseUrl = 'https://pokeapi.co/api/v2/pokemon/';

// Get Elements --------------------------------------------
const searchInput = getElement('.search-input'),
      searchButton = getElement('.search-button'),
      container = getElement('.pokemon'),
      erroMessage = getElement('.error');

var pokeName, // Nome ou numero passado na caixa de busca
    pokemon, // Responsavel por guardar os dados recebidos da API
    card; // Responsavel por receber o HTML 

// Build Functions --------------------------------------------

// Função para reduzir a escrita na captura de elementos HTML
function getElement(element) {
  return document.querySelector(element);
}

// Função responsavel por fazer requisições para a API e inserir as respostas na variavel pokemon
function requestPokeInfo(url, name) {
  fetch(url + name)
    .then(response => response.json())
    .then(data => {
      pokemon = data;
    })
    .catch(err => console.log(err));
}

// Função responsavel por montar o HTML exibido na pagina
function createCard () {
  card = `
    <div class="pokemon-picture">
      <img class="pokemon-img-picture" src="${pokemon.sprites.other.dream_world.front_default}" alt="Sprite of ${pokemon.name}" style="max-width:250px">
    </div>
    <div class="pokemon-info">
        <h1 class="name">Name: ${pokemon.name}</h1>
        <h2 class="number">Nº ${pokemon.id}</h2>
        <h3 class="type">Type: ${pokemon.types.map(item => item.type.name).toString()}</h3>
        <h3 class="skill">Skills: ${pokemon.moves.map(item => ' ' + item.move.name).toString()}</h3>
        <h3 class="weight">Weight: ${pokemon.weight  / 10}kg</h3>
        <h3 class="height">Height: ${pokemon.height  / 10}m</h3>
    </div>`;
  return card;
}

// Função que faz a chamada das principais funções e inicia o app
function startApp(pokeName) {
  requestPokeInfo(baseUrl, pokeName);

  setTimeout(function () {
      container.innerHTML = createCard();
  }, 2000);
}

// Add Events --------------------------------------------
searchButton.addEventListener('click', event => {
  event.preventDefault();
  pokeName = searchInput.value.toLowerCase();
  startApp(pokeName);
});



// Mostra todos os pokemons em cards

const getPokemonUrl = id => `https://pokeapi.co/api/v2/pokemon/${id}`

const generatePokemonPromises = () => Array(160).fill().map((_, index) =>
  fetch(getPokemonUrl(index + 1)).then(response => response.json()))

const generateHTML = pokemons => pokemons.reduce((accumulator, { name, id, types }) => {
  const elementTypes = types.map(typeInfo => typeInfo.type.name)

  accumulator += `  
    <li class="card ${elementTypes[0]}">
    <img class="card-image" alt="${name}" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg ">
    <h2 class="card-title">${id}. ${name}</h2>
    <p class="card-subtitle">${elementTypes.join(' | ')}</p>
    </li>
    `
  return accumulator
}, '')

const insertPokemonsIntoPage = pokemons => {
  const ul = document.querySelector('[data-js="pokedex"]')
  ul.innerHTML = pokemons
}

const pokemonPromises = generatePokemonPromises()

Promise.all(pokemonPromises)
  .then(generateHTML)
  .then(insertPokemonsIntoPage)