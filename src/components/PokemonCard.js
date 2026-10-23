import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme/colors';
import { capitalize, formatId } from '../utils/format';

// La tarjeta solo dibuja: recibe los datos y el callback por props.
export default function PokemonCard({ pokemon, onPress }) {
  return (
    // El contenedor ocupa exactamente la mitad de la fila, así una tarjeta suelta
    // (número impar en la última fila) no se estira a todo el ancho.
    <Pressable style={styles.slot} onPress={() => onPress?.(pokemon)}>
      <View style={styles.card}>
        {/* CONCEPTO: una Image remota necesita width y height explícitos o no se ve. */}
        <Image source={{ uri: pokemon.image }} style={styles.image} resizeMode="contain" />
        <Text style={styles.id}>{formatId(pokemon.id)}</Text>
        <Text style={styles.name}>{capitalize(pokemon.name)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  slot: {
    width: '50%',
    padding: spacing.sm,
  },
  card: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: 110,
    height: 110,
  },
  id: {
    marginTop: spacing.sm,
    fontSize: 13,
    color: colors.textMuted,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
});
