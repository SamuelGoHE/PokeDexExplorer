import { Image, Pressable, StyleSheet, Text } from 'react-native';
import { colors, spacing } from '../theme/colors';
import { capitalize, formatId } from '../utils/format';

// The card only draws; it receives data and a callback through props.
export default function PokemonCard({ pokemon, onPress }) {
  return (
    <Pressable style={styles.card} onPress={() => onPress?.(pokemon)}>
      {/* CONCEPT: a remote Image needs explicit width and height or it is not visible. */}
      <Image source={{ uri: pokemon.image }} style={styles.image} resizeMode="contain" />
      <Text style={styles.id}>{formatId(pokemon.id)}</Text>
      <Text style={styles.name}>{capitalize(pokemon.name)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: spacing.sm,
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
