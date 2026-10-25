# PokéDex Explorer

App con Expo y React Native que consume la [PokéAPI](https://pokeapi.co/): lista Pokémon con scroll infinito, permite buscarlos por nombre o número y muestra su ficha, con aspecto de carta coleccionable, con imagen, tipos, medidas y estadísticas.

## Arquitectura

La regla del taller: las llamadas a la API no se mezclan con los estilos ni el JSX de los componentes. Se separó en capas:

```
Pantalla (screens)  →  Hook (hooks)  →  Servicio (services)  →  PokéAPI
   dibuja             estado de la        fetch + mappers
                      petición
```

- **services/** es la única capa que conoce la API (URL, `fetch`, `response.ok`, mappers).
- **hooks/** guarda el estado de cada petición (`cargando / error / éxito`) con `useState` y `useEffect`.
- **screens/** y **components/** solo dibujan lo que reciben; no hay ningún `fetch` en ellos.

Es el mismo patrón de `recetario-app` (`mealAPI.js`): `BASE_URL`, un mapper, funciones `async` con `signal` y `response.ok` revisado antes de `.json()`.

## Árbol de carpetas y responsabilidad de cada archivo

```
pokedex-explorer/
├── App.js
└── src/
    ├── services/
    │   └── pokeAPI.js
    ├── hooks/
    │   ├── usePokemonList.js
    │   ├── usePokemonSearch.js
    │   └── usePokemonDetail.js
    ├── screens/
    │   ├── HomeScreen.js
    │   └── DetailScreen.js
    ├── components/
    │   ├── PokemonCard.js
    │   ├── PokemonDetailCard.js
    │   ├── SearchBar.js
    │   ├── StatBar.js
    │   ├── TypeBadge.js
    │   ├── LoadingState.js
    │   ├── ErrorState.js
    │   ├── EmptyState.js
    │   └── ListFooter.js
    ├── utils/
    │   ├── format.js
    │   ├── pokemonTypes.js
    │   └── statLabels.js
    └── theme/
        └── colors.js
```

| Archivo | Responsabilidad |
|---|---|
| `App.js` | Punto de entrada. Guarda qué Pokémon está seleccionado (`selectedId`), alterna entre lista y ficha y maneja el botón "atrás" de Android. |
| `services/pokeAPI.js` | `getPokemonList` (lista paginada), `getPokemon` (ficha por nombre o número, `null` si no existe) y `mapPokemon` (respuesta cruda → campos de la app). |
| `hooks/usePokemonList.js` | Carga inicial de 20, scroll infinito (`loadMore`), estados de carga y error, y reintento. |
| `hooks/usePokemonSearch.js` | Ejecuta la búsqueda confirmada con el botón; cancela la búsqueda anterior si se lanza otra. |
| `hooks/usePokemonDetail.js` | Pide la ficha completa de un Pokémon (tipos, medidas, estadísticas). |
| `screens/HomeScreen.js` | Título, barra de búsqueda y, según el estado, la lista o el resultado de la búsqueda. |
| `screens/DetailScreen.js` | Botón "Volver a la lista" y la ficha con sus estados de carga y error. |
| `components/PokemonCard.js` | Tarjeta de la lista: nombre, imagen y número. |
| `components/PokemonDetailCard.js` | Ficha estilo carta: encabezado, imagen, 6 estadísticas, medidas y tipos. |
| `components/SearchBar.js` | `TextInput` controlado y botón "Buscar". |
| `components/StatBar.js` | Una estadística con barra proporcional (máximo 255). |
| `components/TypeBadge.js` | Distintivo de tipo con su color y nombre en español. |
| `components/LoadingState.js` | Estado "cargando": indicador con texto. |
| `components/ErrorState.js` | Estado "error": mensaje y botón "Reintentar". |
| `components/EmptyState.js` | Estado "sin resultados": mensaje y botón "Ver todos". |
| `components/ListFooter.js` | Pie de la lista: "Cargando más..." o error con "Reintentar". |
| `utils/format.js` | `formatId` (`25` → `#025`) y `capitalize`. |
| `utils/pokemonTypes.js` | Color y nombre en español de los 18 tipos, y el fondo de la carta según el tipo. |
| `utils/statLabels.js` | Nombres en español de las estadísticas y el máximo (255). |
| `theme/colors.js` | Colores, espaciados y degradados compartidos. |

## Decisiones de diseño (por qué se organizó así)

- **Red en `services/`:** si la API cambia, se edita un solo archivo; las pantallas no se enteran.
- **Un hook por responsabilidad:** lista, búsqueda y detalle tienen ciclos de vida distintos y se prueban por separado.
- **`getPokemon` devuelve `null` en un 404 y lanza `Error` en otros fallos:** la interfaz distingue "sin resultados" de "error de red".
- **El id de la lista se saca de la URL** y la imagen se arma con la URL de sprites: evita una petición por cada Pokémon.
- **La lista se oculta, no se desmonta, al abrir una ficha:** conserva los Pokémon cargados, la búsqueda y el scroll.
- **`useRef` en el scroll infinito:** evita lanzar varias cargas a la vez, porque un `useState` se actualiza hasta el siguiente render.
- **Degradados con `backgroundImage`** (incluido en React Native): sin librerías adicionales.
- **Las tarjetas de la lista tienen el mismo fondo:** la lista no trae el tipo y pedirlo costaría 20 peticiones por página.

## Fases de desarrollo

1. Proyecto base y estructura de carpetas
2. Capa de API (`services/pokeAPI.js`)
3. Lista con `FlatList` y estados de carga/error
4. Scroll infinito
5. Búsqueda por nombre o número
6. Ficha de detalle y diseño de cartas
7. Cierre: botón "atrás" de Android, revisión y documentación

## Ejecutar

```bash
npm install
npx expo start
```

Escanea el QR con Expo Go, o presiona `i` (simulador iOS) o `a` (emulador Android).
