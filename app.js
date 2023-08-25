const pokemonListElement = document.getElementById("pokemon-list");
const prevButton = document.getElementById("prev-btn");
const nextButton = document.getElementById("next-btn");
const pageNumElement = document.getElementById("page-num");
const searchInput = document.getElementById("search-input");
const searchResultsElement = document.getElementById("search-results");
const pokemonDetailsElement = document.getElementById("pokemon-details");

let currentPage = 1;
const itemsPerPage = 16;

function displayPokemons(pageNumber) {
    pokemonListElement.innerHTML = "";

    const startIndex = (pageNumber - 1) * itemsPerPage;

    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${itemsPerPage}&offset=${startIndex}`)
        .then(response => response.json())
        .then(data => {
            const pokemons = data.results;
            pokemons.forEach(pokemon => {
                const pokemonCard = document.createElement("div");
                pokemonCard.classList.add("pokemon-card");
                pokemonCard.innerHTML = `
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.split('/')[6]}.png" alt="${pokemon.name}">
                    <p>${pokemon.name}</p>
                `;
                pokemonCard.addEventListener("click", () => {
                    displayPokemonDetails(pokemon.name);
                });
                pokemonListElement.appendChild(pokemonCard);
            });
        })
        .catch(error => console.error("Error fetching Pokémon:", error));
}

function displayPokemonDetails(pokemonName) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        .then(response => response.json())
        .then(data => {
            const species = data.species.name;
            const stats = data.stats.map(stat => `${stat.stat.name}: ${stat.base_stat}`).join(", ");
            const types = data.types.map(type => type.type.name).join(", ");
            const weight = data.weight;
            const moves = data.moves.map(move => move.move.name).slice(0, 5).join(", ");
            
            pokemonDetailsElement.innerHTML = `
                <h2>${pokemonName}</h2>
                <p>Species: ${species}</p>
                <p>Stats: ${stats}</p>
                <p>Types: ${types}</p>
                <p>Weight: ${weight}</p>
                <p>Moves: ${moves}</p>
            `;
        })
        .catch(error => console.error("Error fetching Pokémon details:", error));
}

function updatePaginationButtons() {
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = false;

    if (currentPage * itemsPerPage >= 1100) {
        nextButton.disabled = true;
    }
}

prevButton.addEventListener("click", () => {
    currentPage -= 1;
    displayPokemons(currentPage);
    updatePageNumber();
    updatePaginationButtons();
});

nextButton.addEventListener("click", () => {
    currentPage += 1;
    displayPokemons(currentPage);
    updatePageNumber();
    updatePaginationButtons();
});

function updatePageNumber() {
    pageNumElement.textContent = `Page ${currentPage}`;
}

searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.trim().toLowerCase();

    searchResultsElement.innerHTML = "";

    if (searchTerm.length >= 3) {
        fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`)
            .then(response => response.json())
            .then(data => {
                const pokemonName = data.name;
                const pokemonCard = document.createElement("div");
                pokemonCard.classList.add("pokemon-card");
                pokemonCard.innerHTML = `
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png" alt="${pokemonName}">
                    <p>${pokemonName}</p>
                `;
                searchResultsElement.appendChild(pokemonCard);
            })
            .catch(error => {
                searchResultsElement.textContent = "No results found.";
            });
    }
});

// Initial display
displayPokemons(currentPage);
updatePageNumber();
updatePaginationButtons();
