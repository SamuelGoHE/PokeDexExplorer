import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme/colors';

// UI state: error (clear message in Spanish + "Reintentar" button)
export default function ErrorState({ message, onRetry }) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <Pressable style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>Reintentar</Text>
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
