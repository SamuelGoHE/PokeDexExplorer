import { useEffect, useRef, useState } from 'react';
import { getPokemonList } from '../services/pokeAPI';

const PAGE_SIZE = 20;

// CONCEPTO: custom hook. Mantiene la lógica de las peticiones fuera de la pantalla,
// así la pantalla solo decide qué dibujar en cada estado.
export function usePokemonList() {
  // CONCEPTO: useState. Cada estado vuelve a renderizar la pantalla cuando cambia.
  const [pokemon, setPokemon] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Estados de la carga de "más" Pokémon (scroll infinito), separados de la carga inicial.
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(null);
  // Al cambiar `attempt` el efecto se ejecuta de nuevo: así funciona "Reintentar".
  const [attempt, setAttempt] = useState(0);

  // CONCEPTO: useRef guarda un valor que NO provoca un nuevo render al cambiar.
  // Aquí evita que onEndReached dispare varias cargas a la vez (un useState se actualiza
  // recién en el siguiente render, un ref cambia al instante).
  const loadingMoreRef = useRef(false);
  const moreController = useRef(null);

  // CONCEPTO: useEffect + array de dependencias. La petición corre después del primer render
  // y de nuevo SOLO cuando algo de [attempt] cambia. Sin el array se repetiría sin parar.
  useEffect(() => {
    // CONCEPTO: AbortController cancela la petición si el componente se desmonta.
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getPokemonList(PAGE_SIZE, 0, controller.signal);
        setPokemon(data.results);
        setHasMore(data.hasMore);
      } catch (err) {
        // Una petición cancelada no es un error real: no se muestra al usuario.
        if (err.name === 'AbortError') {
          return;
        }
        setError('No pudimos cargar los Pokémon. Revisa tu conexión e inténtalo de nuevo.');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    load();

    // CONCEPTO: función de limpieza. React la ejecuta antes de repetir el efecto o al desmontar.
    return () => controller.abort();
  }, [attempt]);

  // Al desmontar, cancela también la carga de "más" si está en curso.
  useEffect(() => () => moreController.current?.abort(), []);

  function retry() {
    setAttempt((current) => current + 1);
  }

  // Pide la siguiente página; el offset es la cantidad de Pokémon que ya tenemos.
  async function fetchMore() {
    if (loading || error || !hasMore || loadingMoreRef.current) {
      return;
    }
    loadingMoreRef.current = true;
    setLoadingMore(true);
    setLoadMoreError(null);

    const controller = new AbortController();
    moreController.current = controller;
    try {
      const data = await getPokemonList(PAGE_SIZE, pokemon.length, controller.signal);
      // Se agregan al final de la lista actual, sin repetir ids que ya existan.
      setPokemon((current) => {
        const knownIds = new Set(current.map((item) => item.id));
        return [...current, ...data.results.filter((item) => !knownIds.has(item.id))];
      });
      setHasMore(data.hasMore);
    } catch (err) {
      if (err.name === 'AbortError') {
        return;
      }
      setLoadMoreError('No pudimos cargar más Pokémon.');
    } finally {
      loadingMoreRef.current = false;
      if (!controller.signal.aborted) {
        setLoadingMore(false);
      }
    }
  }

  // Lo llama onEndReached. Si la última carga falló, no insiste solo: espera el "Reintentar".
  function loadMore() {
    if (loadMoreError) {
      return;
    }
    fetchMore();
  }

  return {
    pokemon,
    hasMore,
    loading,
    error,
    retry,
    loadingMore,
    loadMoreError,
    loadMore,
    retryLoadMore: fetchMore,
  };
}
