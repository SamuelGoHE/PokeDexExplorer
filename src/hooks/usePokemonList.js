import { useEffect, useState } from 'react';
import { getPokemonList } from '../services/pokeAPI';

const PAGE_SIZE = 20;

// CONCEPT: custom hook. It keeps the request logic out of the screen, so the screen
// only decides what to draw for each state.
export function usePokemonList() {
  // CONCEPT: useState. Each piece of state re-renders the screen when it changes.
  const [pokemon, setPokemon] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Changing `attempt` re-runs the effect: that is how "Reintentar" works.
  const [attempt, setAttempt] = useState(0);

  // CONCEPT: useEffect + dependency array. The request runs after the first render and
  // again ONLY when something in [attempt] changes. Without the array it would loop forever.
  useEffect(() => {
    // CONCEPT: AbortController cancels the request if the component unmounts.
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getPokemonList(PAGE_SIZE, 0, controller.signal);
        setPokemon(data.results);
        setHasMore(data.hasMore);
      } catch (err) {
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

    // CONCEPT: cleanup function. React runs it before the effect re-runs or on unmount.
    return () => controller.abort();
  }, [attempt]);

  function retry() {
    setAttempt((current) => current + 1);
  }

  return { pokemon, hasMore, loading, error, retry };
}
