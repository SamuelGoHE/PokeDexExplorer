// CONCEPTO: la URL base vive en un solo lugar. Si la API cambia, solo se edita esta línea.
const BASE_URL = 'https://pokeapi.co/api/v2';

// El endpoint de la lista no trae imágenes, así que armamos la URL a partir del id.
const ARTWORK_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

// CONCEPTO: la lista solo da { name, url }. El id es el último segmento de la url
// (".../pokemon/25/" -> 25), así evitamos una petición extra por cada Pokémon.
function getIdFromUrl(url) {
  const parts = url.split('/').filter(Boolean);
  return Number(parts[parts.length - 1]);
}

function getArtworkUrl(id) {
  return `${ARTWORK_URL}/${id}.png`;
}

// CONCEPTO: mapper. Convierte la respuesta cruda de la API en solo los campos que usa la app,
// así las pantallas no dependen de la forma de la API (igual que mapMeal en el recetario).
export function mapPokemon(row) {
  return {
    id: row.id,
    name: row.name,
    image: row.sprites?.other?.['official-artwork']?.front_default ?? getArtworkUrl(row.id),
    types: row.types.map((item) => item.type.name),
    // La altura viene en decímetros y el peso en hectogramos: se divide entre 10 para m y kg.
    height: row.height / 10,
    weight: row.weight / 10,
    stats: row.stats.map((item) => ({
      name: item.stat.name,
      value: item.base_stat,
    })),
  };
}

// CONCEPTO: async/await + fetch. `signal` permite cancelar la petición (AbortController),
// por ejemplo cuando el componente se desmonta.
export async function getPokemonList(limit = 20, offset = 0, signal) {
  const url = `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`;
  const response = await fetch(url, { signal });
  // CONCEPTO: fetch NO lanza error con los errores HTTP (404, 500...). Hay que revisar
  // response.ok antes de llamar a response.json().
  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status}`);
  }
  const data = await response.json();
  return {
    // `next` es null en la última página: la pantalla lo usa para dejar de cargar más.
    hasMore: data.next !== null,
    results: data.results.map((item) => {
      const id = getIdFromUrl(item.url);
      return { id, name: item.name, image: getArtworkUrl(id) };
    }),
  };
}

// Devuelve el Pokémon, o null cuando no existe (estado "sin resultados" en la interfaz).
// Cualquier otro fallo lanza un Error (estado "error" en la interfaz).
export async function getPokemon(nameOrId, signal) {
  // La búsqueda ignora mayúsculas y los espacios al inicio o al final.
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
