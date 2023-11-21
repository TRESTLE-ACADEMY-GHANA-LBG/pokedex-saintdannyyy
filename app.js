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

            Swal.fire({
                title: `Details for ${pokemonName}`,
                html: `
                    <p>Species: ${species}</p>
                    <p>Stats: ${stats}</p>
                    <p>Types: ${types}</p>
                    <p>Weight: ${weight}</p>
                    <p>Moves: ${moves}</p>
                `,
                confirmButtonText: 'OK',
            });
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

function displaySearchResults(data) {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const matchingPokemons = data.results.filter(pokemon => pokemon.name.includes(searchTerm));

    Swal.fire({
        title: `Search Results for "${searchTerm}"`,
        html: getSearchResultsHTML(matchingPokemons),
        confirmButtonText: 'OK',
    });
}

function getSearchResultsHTML(results) {
    if (results.length > 0) {
        return results.map(pokemon => {
            return `
                <div class="pokemon-card" style="padding:20px; margin-bottom:10px;">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.split('/')[6]}.png" alt="${pokemon.name}">
                    <p>${pokemon.name}</p>
                </div>
            `;
        }).join('');
    } else {
        return "<p>No results found.</p>";
    }
}

searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (searchTerm.length > 3) {
        // Show loading indicator
        searchResultsElement.innerHTML = "<p>Loading...</p>";

        fetch(`https://pokeapi.co/api/v2/pokemon?limit=2000`)
            .then(response => response.json())
            .then(data => {
                searchResultsElement.innerHTML = ""; // Clear previous results
                const matchingPokemons = data.results.filter(pokemon => pokemon.name.includes(searchTerm));
                searchResultsElement.innerHTML = getSearchResultsHTML(matchingPokemons);
                displaySearchResults(data);
            })
            .catch(error => {
                console.error("Error fetching Pokémon:", error);
                // Display an error message
                searchResultsElement.innerHTML = "<p>Error fetching Pokémon. Please try again.</p>";
            });
    } else {
        // Clear search results if the search term is less than 3 characters
        searchResultsElement.innerHTML = "";
    }
});

// Initial display
displayPokemons(currentPage);
updatePageNumber();
updatePaginationButtons();
