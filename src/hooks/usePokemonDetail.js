import { useEffect, useState } from 'react';
import { getPokemon } from '../services/pokeAPI';

// CONCEPTO: custom hook de la ficha. La tarjeta de la lista solo trae id, nombre e imagen;
// aquí se pide la ficha completa (tipos, altura, peso, estadísticas).
export function usePokemonDetail(id) {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  // CONCEPTO: dependencias [id, attempt]. Se vuelve a pedir si cambia el Pokémon
  // o si el usuario pulsa "Reintentar".
  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const found = await getPokemon(id, controller.signal);
        if (!found) {
          // null = la API respondió 404: ese Pokémon no existe.
          setError('No encontramos este Pokémon.');
          return;
        }
        setPokemon(found);
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }
        setError('No pudimos cargar la ficha. Revisa tu conexión e inténtalo de nuevo.');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => controller.abort();
  }, [id, attempt]);

  function retry() {
    setAttempt((current) => current + 1);
  }

  return { pokemon, loading, error, retry };
}
