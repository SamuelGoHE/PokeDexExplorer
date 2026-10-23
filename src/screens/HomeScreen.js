import { FlatList, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import PokemonCard from '../components/PokemonCard';
import { usePokemonList } from '../hooks/usePokemonList';
import { colors, spacing } from '../theme/colors';

export default function HomeScreen() {
  const { pokemon, loading, error, retry } = usePokemonList();

  // The screen has no fetch: it only chooses what to draw for each state.
  function renderContent() {
    if (loading) {
      return <LoadingState />;
    }
    if (error) {
      return <ErrorState message={error} onRetry={retry} />;
    }
    return (
      // CONCEPT: FlatList renders only what is visible (unlike ScrollView + map).
      <FlatList
        data={pokemon}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
        contentContainerStyle={styles.list}
      />
    );
  }

  return (
    // CONCEPT: SafeAreaView keeps content away from the notch and system bars.
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>PokéDex Explorer</Text>
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  list: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.lg,
  },
});
