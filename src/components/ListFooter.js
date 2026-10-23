import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme/colors';

// Pie de la lista: muestra el indicador mientras se cargan más Pokémon,
// o un mensaje con "Reintentar" si esa carga falló (la lista ya cargada se conserva).
export default function ListFooter({ loadingMore, error, onRetry }) {
  if (loadingMore) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.text}>Cargando más...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{error}</Text>
        <Pressable style={styles.button} onPress={onRetry}>
          <Text style={styles.buttonText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: spacing.md,
  },
  text: {
    marginTop: spacing.sm,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
  button: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
  },
  buttonText: {
    color: colors.onPrimary,
    fontWeight: '600',
  },
});
