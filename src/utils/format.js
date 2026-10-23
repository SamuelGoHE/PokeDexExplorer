// CONCEPTO: padStart agrega ceros a la izquierda: 25 -> "025". Se usa para mostrar "#025".
export function formatId(id) {
  return `#${String(id).padStart(3, '0')}`;
}

// "pikachu" -> "Pikachu"
export function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
