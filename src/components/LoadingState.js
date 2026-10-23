import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme/colors';

// UI state: loading (spinner + text)
export default function LoadingState({ message = 'Cargando Pokémon...' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>{message}</Text>
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
  text: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.textMuted,
  },
});
