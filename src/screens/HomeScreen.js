import { FlatList, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ErrorState from '../components/ErrorState';
import ListFooter from '../components/ListFooter';
import LoadingState from '../components/LoadingState';
import PokemonCard from '../components/PokemonCard';
import { usePokemonList } from '../hooks/usePokemonList';
import { colors, spacing } from '../theme/colors';

export default function HomeScreen() {
  const { pokemon, loading, error, retry, loadingMore, loadMoreError, loadMore, retryLoadMore } =
    usePokemonList();

  // La pantalla no tiene fetch: solo elige qué dibujar según el estado.
  function renderContent() {
    if (loading) {
      return <LoadingState />;
    }
    if (error) {
      return <ErrorState message={error} onRetry={retry} />;
    }
    return (
      // CONCEPTO: FlatList renderiza solo lo visible (a diferencia de ScrollView + map).
      <FlatList
        data={pokemon}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
        contentContainerStyle={styles.list}
        // CONCEPTO: scroll infinito. onEndReached se dispara al acercarse al final de la lista;
        // el umbral 0.5 significa "cuando falte media pantalla", así el usuario casi no espera.
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          <ListFooter loadingMore={loadingMore} error={loadMoreError} onRetry={retryLoadMore} />
        }
      />
    );
  }

  return (
    // CONCEPTO: SafeAreaView mantiene el contenido lejos del notch y las barras del sistema.
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
