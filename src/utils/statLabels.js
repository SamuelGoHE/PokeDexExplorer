// Nombres en español de las 6 estadísticas base (la API los devuelve en inglés).
const STAT_LABELS = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'Ataque esp.',
  'special-defense': 'Defensa esp.',
  speed: 'Velocidad',
};

export function getStatLabel(name) {
  return STAT_LABELS[name] ?? name;
}

// Valor máximo posible de una estadística base: la barra al 100% equivale a 255.
export const MAX_STAT = 255;
