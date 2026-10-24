import { StyleSheet, Text, View } from 'react-native';
import { spacing } from '../theme/colors';
import { getTypeInfo } from '../utils/pokemonTypes';

// Distintivo de tipo: el color y el nombre dependen del tipo que llega por props.
export default function TypeBadge({ type }) {
  const info = getTypeInfo(type);
  return (
    // CONCEPTO: estilo dinámico. Se combina el estilo fijo con uno calculado a partir de los datos.
    <View style={[styles.badge, { backgroundColor: info.color }]}>
      <Text style={[styles.text, { color: info.text }]}>{info.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: 999,
    marginHorizontal: spacing.xs,
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
  },
});
