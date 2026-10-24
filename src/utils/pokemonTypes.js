// CONCEPTO: mapeo de datos. La API devuelve el tipo en inglés ("fire"); aquí lo traducimos
// y le asignamos un color propio. La paleta es la clásica de los juegos de Pokémon.
// `text` se eligió según el contraste: oscuro sobre fondos claros, blanco sobre oscuros.
const DARK_TEXT = '#1F2933';
const LIGHT_TEXT = '#FFFFFF';

const TYPES = {
  normal: { label: 'Normal', color: '#A8A77A', text: DARK_TEXT },
  fire: { label: 'Fuego', color: '#EE8130', text: DARK_TEXT },
  water: { label: 'Agua', color: '#6390F0', text: DARK_TEXT },
  electric: { label: 'Eléctrico', color: '#F7D02C', text: DARK_TEXT },
  grass: { label: 'Planta', color: '#7AC74C', text: DARK_TEXT },
  ice: { label: 'Hielo', color: '#96D9D6', text: DARK_TEXT },
  fighting: { label: 'Lucha', color: '#C22E28', text: LIGHT_TEXT },
  poison: { label: 'Veneno', color: '#A33EA1', text: LIGHT_TEXT },
  ground: { label: 'Tierra', color: '#E2BF65', text: DARK_TEXT },
  flying: { label: 'Volador', color: '#A98FF3', text: DARK_TEXT },
  psychic: { label: 'Psíquico', color: '#F95587', text: DARK_TEXT },
  bug: { label: 'Bicho', color: '#A6B91A', text: DARK_TEXT },
  rock: { label: 'Roca', color: '#B6A136', text: DARK_TEXT },
  ghost: { label: 'Fantasma', color: '#735797', text: LIGHT_TEXT },
  dragon: { label: 'Dragón', color: '#6F35FC', text: LIGHT_TEXT },
  dark: { label: 'Siniestro', color: '#705746', text: LIGHT_TEXT },
  steel: { label: 'Acero', color: '#B7B7CE', text: DARK_TEXT },
  fairy: { label: 'Hada', color: '#D685AD', text: DARK_TEXT },
};

// Por si la API agrega un tipo nuevo: se muestra con su nombre original y un gris neutro.
export function getTypeInfo(type) {
  return TYPES[type] ?? { label: type, color: '#9AA5B1', text: DARK_TEXT };
}

// Mezcla un color hex con otro (negro o blanco) para obtener una versión más oscura o más clara.
function mix(hex, target, amount) {
  const channels = (value) => [1, 3, 5].map((i) => parseInt(value.slice(i, i + 2), 16));
  const [from, to] = [channels(hex), channels(target)];
  const mixed = from.map((c, i) => Math.round(c + (to[i] - c) * amount));
  return `rgb(${mixed.join(',')})`;
}

// Fondo de la carta de detalle: oscuro arriba (para que se lea el texto blanco) y claro abajo.
// Con dos tipos, el degradado termina en el color del segundo.
export function getCardBackground(types) {
  const first = getTypeInfo(types[0]).color;
  const last = types[1] ? getTypeInfo(types[1]).color : mix(first, '#FFFFFF', 0.35);
  return `linear-gradient(160deg, ${mix(first, '#000000', 0.45)} 0%, ${first} 50%, ${last} 100%)`;
}
