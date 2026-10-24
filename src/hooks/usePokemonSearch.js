import { useEffect, useState } from 'react';
import { getPokemon } from '../services/pokeAPI';

// CONCEPTO: otro custom hook, separado del de la lista: cada hook tiene una sola responsabilidad.
export function usePokemonSearch() {
  // Texto buscado (ya confirmado con el botón). Vacío = no hay búsqueda activa.
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  // CONCEPTO: useEffect con [query, attempt]. Se ejecuta SOLO cuando cambia lo buscado
  // o cuando se pulsa "Reintentar", no en cada render ni en cada tecla escrita.
  useEffect(() => {
    if (!query) {
      setResult(null);
      setError(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function runSearch() {
      setLoading(true);
      setError(null);
      setResult(null);
      try {
        // getPokemon devuelve el Pokémon o null si no existe.
        setResult(await getPokemon(query, controller.signal));
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }
        setError('No pudimos realizar la búsqueda. Revisa tu conexión e inténtalo de nuevo.');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    runSearch();

    // CONCEPTO: la limpieza cancela la búsqueda anterior si el usuario busca otra cosa
    // antes de que termine. Así un resultado viejo nunca aparece sobre el nuevo.
    return () => controller.abort();
  }, [query, attempt]);

  function retry() {
    setAttempt((current) => current + 1);
  }

  function search(text) {
    const next = text.trim();
    if (next === query) {
      // Misma búsqueda: no hay nada nuevo que pedir, salvo que la anterior haya fallado.
      if (error) {
        retry();
      }
      return;
    }
    setQuery(next);
    // Se marca "cargando" ya, para no mostrar "sin resultados" un instante antes de que corra el efecto.
    setLoading(next !== '');
  }

  function clear() {
    setQuery('');
  }

  return { query, result, loading, error, search, retry, clear };
}
