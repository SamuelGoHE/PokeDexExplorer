// CONCEPT: single place for the base URL. If the API changes, we edit only this line.
const BASE_URL = 'https://pokeapi.co/api/v2';

// The list endpoint does not return images, so we build the URL from the id.
const ARTWORK_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

// CONCEPT: the list only gives { name, url }. The id is the last segment of the url
// (".../pokemon/25/" -> 25), so we avoid one extra request per Pokémon.
function getIdFromUrl(url) {
  const parts = url.split('/').filter(Boolean);
  return Number(parts[parts.length - 1]);
}

function getArtworkUrl(id) {
  return `${ARTWORK_URL}/${id}.png`;
}

// CONCEPT: mapper. It turns the raw API response into only the fields the app uses,
// so screens never depend on the API's shape (same idea as mapMeal in the recipe app).
export function mapPokemon(row) {
  return {
    id: row.id,
    name: row.name,
    image: row.sprites?.other?.['official-artwork']?.front_default ?? getArtworkUrl(row.id),
    types: row.types.map((item) => item.type.name),
    // height comes in decimetres and weight in hectograms: divide by 10 for m and kg.
    height: row.height / 10,
    weight: row.weight / 10,
    stats: row.stats.map((item) => ({
      name: item.stat.name,
      value: item.base_stat,
    })),
  };
}

// CONCEPT: async/await + fetch. `signal` lets the caller cancel the request
// (AbortController), e.g. when the component unmounts.
export async function getPokemonList(limit = 20, offset = 0, signal) {
  const url = `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`;
  const response = await fetch(url, { signal });
  // CONCEPT: fetch does NOT throw on HTTP errors (404, 500...). We must check response.ok
  // before calling response.json().
  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status}`);
  }
  const data = await response.json();
  return {
    // `next` is null on the last page: the list screen uses it to stop loading more.
    hasMore: data.next !== null,
    results: data.results.map((item) => {
      const id = getIdFromUrl(item.url);
      return { id, name: item.name, image: getArtworkUrl(id) };
    }),
  };
}

// Returns the Pokémon, or null when it does not exist ("no results" state in the UI).
// Any other failure throws ("error" state in the UI).
export async function getPokemon(nameOrId, signal) {
  // Search ignores uppercase and leading/trailing spaces.
  const query = String(nameOrId).trim().toLowerCase();
  if (!query) {
    return null;
  }
  const url = `${BASE_URL}/pokemon/${encodeURIComponent(query)}`;
  const response = await fetch(url, { signal });
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status}`);
  }
  const data = await response.json();
  return mapPokemon(data);
}
