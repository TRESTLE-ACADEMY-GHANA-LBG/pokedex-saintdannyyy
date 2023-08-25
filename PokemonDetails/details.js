const pokemonDetailsCard = document.getElementById("pokemon-details-card");

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const pokemonName = urlParams.get("name");

fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    .then(response => response.json())
    .then(data => {
        const species = data.species.name;
        const stats = data.stats.map(stat => `${stat.stat.name}: ${stat.base_stat}`).join(", ");
        const types = data.types.map(type => type.type.name).join(", ");
        const weight = data.weight;
        const moves = data.moves.map(move => move.move.name).slice(0, 5).join(", ");
        
        const detailsHTML = `
            <div class="pokemon-card">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png" alt="${pokemonName}">
                <h2>${pokemonName}</h2>
                <p>Species: ${species}</p>
                <p>Stats: ${stats}</p>
                <p>Types: ${types}</p>
                <p>Weight: ${weight}</p>
                <p>Moves: ${moves}</p>
            </div>
        `;

        pokemonDetailsCard.innerHTML = detailsHTML;
    })
    .catch(error => console.error("Error fetching Pokémon details:", error));
