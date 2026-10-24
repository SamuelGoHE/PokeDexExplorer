import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, gradients, spacing } from '../theme/colors';
import { capitalize, formatId } from '../utils/format';

// Tarjeta de la lista con aspecto de carta coleccionable. Solo dibuja: recibe los datos y
// el callback por props. El fondo es el mismo para todas porque la lista no trae el tipo
// (pedirlo costaría una petición por Pokémon); los colores por tipo se ven en la ficha.
export default function PokemonCard({ pokemon, onPress }) {
  return (
    // El contenedor ocupa exactamente la mitad de la fila, así una tarjeta suelta
    // (número impar en la última fila) no se estira a todo el ancho.
    <Pressable style={styles.slot} onPress={() => onPress?.(pokemon)}>
      <View style={[styles.frame, { backgroundImage: gradients.silver }]}>
        <View style={[styles.card, { backgroundImage: gradients.holo }]}>
          <Text style={styles.name} numberOfLines={1}>
            {capitalize(pokemon.name)}
          </Text>

          <View style={styles.art}>
            <View style={[styles.glow, { backgroundImage: gradients.glow }]} />
            {/* CONCEPTO: una Image remota necesita width y height explícitos o no se ve. */}
            <Image source={{ uri: pokemon.image }} style={styles.image} resizeMode="contain" />
          </View>

          <View style={[styles.footer, { backgroundImage: gradients.silver }]}>
            <Text style={styles.id}>{formatId(pokemon.id)}</Text>
          </View>

          <View pointerEvents="none" style={[styles.gloss, { backgroundImage: gradients.gloss }]} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  slot: {
    width: '50%',
    padding: spacing.sm,
  },
  frame: {
    padding: 4,
    borderRadius: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  card: {
    borderRadius: 10,
    padding: spacing.sm,
    overflow: 'hidden',
  },
  name: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  art: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
  },
  image: {
    width: 110,
    height: 110,
  },
  footer: {
    alignSelf: 'center',
    paddingVertical: 2,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
  },
  id: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
  },
  gloss: {
    ...StyleSheet.absoluteFillObject,
  },
});
