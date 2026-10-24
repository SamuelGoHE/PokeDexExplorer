import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import ListFooter from '../components/ListFooter';
import LoadingState from '../components/LoadingState';
import PokemonCard from '../components/PokemonCard';
import SearchBar from '../components/SearchBar';
import { usePokemonList } from '../hooks/usePokemonList';
import { usePokemonSearch } from '../hooks/usePokemonSearch';
import { colors, spacing } from '../theme/colors';

export default function HomeScreen() {
  const list = usePokemonList();
  const search = usePokemonSearch();
  // Lo que el usuario escribe en el input. No dispara nada hasta pulsar "Buscar".
  const [draft, setDraft] = useState('');

  function handleClear() {
    setDraft('');
    search.clear();
  }

  // La pantalla no tiene fetch: solo elige qué dibujar según el estado.
  function renderSearchContent() {
    if (search.loading) {
      return <LoadingState message="Buscando..." />;
    }
    if (search.error) {
      return <ErrorState message={search.error} onRetry={search.retry} />;
    }
    if (!search.result) {
      return <EmptyState query={search.query} onClear={handleClear} />;
    }
    return (
      <View style={styles.result}>
        <PokemonCard pokemon={search.result} />
      </View>
    );
  }

  function renderListContent() {
    if (list.loading) {
      return <LoadingState />;
    }
    if (list.error) {
      return <ErrorState message={list.error} onRetry={list.retry} />;
    }
    return (
      // CONCEPTO: FlatList renderiza solo lo visible (a diferencia de ScrollView + map).
      <FlatList
        data={list.pokemon}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
        contentContainerStyle={styles.list}
        // CONCEPTO: scroll infinito. onEndReached se dispara al acercarse al final de la lista;
        // el umbral 0.5 significa "cuando falte media pantalla", así el usuario casi no espera.
        onEndReached={list.loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          <ListFooter
            loadingMore={list.loadingMore}
            error={list.loadMoreError}
            onRetry={list.retryLoadMore}
          />
        }
      />
    );
  }

  return (
    // CONCEPTO: SafeAreaView mantiene el contenido lejos del notch y las barras del sistema.
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>PokéDex Explorer</Text>
      <SearchBar value={draft} onChangeText={setDraft} onSubmit={() => search.search(draft)} />
      {/* Con búsqueda activa se muestra su resultado; sin ella, la lista completa. */}
      {search.query ? renderSearchContent() : renderListContent()}
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
  result: {
    paddingHorizontal: spacing.sm,
  },
});
