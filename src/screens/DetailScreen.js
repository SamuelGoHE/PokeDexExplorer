import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import PokemonDetailCard from '../components/PokemonDetailCard';
import { usePokemonDetail } from '../hooks/usePokemonDetail';
import { colors, spacing } from '../theme/colors';

export default function DetailScreen({ id, onBack }) {
  const { pokemon, loading, error, retry } = usePokemonDetail(id);

  function renderContent() {
    if (loading) {
      return <LoadingState message="Cargando ficha..." />;
    }
    if (error) {
      return <ErrorState message={error} onRetry={retry} />;
    }
    return (
      // CONCEPTO: ScrollView sirve aquí porque son pocos elementos (la lista larga usa FlatList).
      <ScrollView contentContainerStyle={styles.content}>
        <PokemonDetailCard pokemon={pokemon} />
      </ScrollView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* El botón queda fuera del contenido para verse también en cargando y error. */}
      <Pressable style={styles.back} onPress={onBack}>
        <Text style={styles.backText}>← Volver a la lista</Text>
      </Pressable>
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  back: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
});
