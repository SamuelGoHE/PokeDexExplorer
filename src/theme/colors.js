// CONCEPTO: los valores de StyleSheet viven en un solo lugar para que todo se vea consistente.
export const colors = {
  background: '#F4F5F7',
  card: '#FFFFFF',
  text: '#1F2933',
  textMuted: '#7B8794',
  primary: '#E3350D',
  onPrimary: '#FFFFFF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
};

// CONCEPTO: backgroundImage. React Native acepta degradados con sintaxis web
// (linear-gradient / radial-gradient) directamente en el estilo, sin librerías extra.
export const gradients = {
  // Marco metálico de las cartas.
  silver: 'linear-gradient(135deg, #F1F3F6 0%, #9AA0AB 30%, #E6E8EC 55%, #8A909C 100%)',
  // Fondo de las tarjetas de la lista (igual para todas: la lista no trae el tipo).
  holo: 'linear-gradient(160deg, #1B1F4B 0%, #3B2C73 50%, #1D5073 100%)',
  // Halo de luz detrás de la imagen.
  glow: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 65%)',
  // Reflejo diagonal translúcido que cruza la carta.
  gloss:
    'linear-gradient(115deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.25) 46%, rgba(255,255,255,0) 62%)',
};
