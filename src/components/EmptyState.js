import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme/colors';

// Estado de interfaz: sin resultados (el nombre o número buscado no existe)
export default function EmptyState({ query, onClear }) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>No encontramos ningún Pokémon con «{query}».</Text>
      <Text style={styles.hint}>Revisa el nombre o prueba con un número.</Text>
      <Pressable style={styles.button} onPress={onClear}>
        <Text style={styles.buttonText}>Ver todos</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.text,
  },
  hint: {
    marginTop: spacing.xs,
    fontSize: 14,
    textAlign: 'center',
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
  },
  buttonText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});
