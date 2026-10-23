# PokéDex Explorer

App con Expo y React Native que consume la [PokéAPI](https://pokeapi.co/): lista Pokémon, permite buscarlos por nombre o número y muestra su ficha con imagen, tipos y estadísticas.

## Arquitectura

La regla del taller: las llamadas a la API no se mezclan con los estilos ni el JSX de los componentes. Por eso la red vive solo en `services/`, el estado de las peticiones en `hooks/` y la interfaz en `screens/` y `components/`.

```
pokedex-explorer/
├── App.js                  # Punto de entrada: monta la pantalla principal
└── src/
    ├── services/           # Única capa que hace fetch (BASE_URL, funciones async, mappers)
    │   └── pokeAPI.js      # (fase 2)
    ├── hooks/              # Estado de cada petición: cargando / error / éxito
    ├── screens/            # Vistas completas: lista con búsqueda y ficha de detalle
    ├── components/         # Piezas reutilizables: tarjeta, distintivo de tipo, barra de stat, estados
    ├── utils/              # Funciones puras: formatear id (#025), capitalizar, colores por tipo
    └── theme/              # Colores y espaciados compartidos
```

## Fases de desarrollo

1. Proyecto base y estructura de carpetas
2. Capa de API (`services/pokeAPI.js`)
3. Lista con `FlatList` y estados de carga/error
4. Scroll infinito
5. Búsqueda por nombre o número
6. Ficha de detalle
7. Navegación entre vistas y cierre

## Ejecutar

```bash
npm install
npx expo start
```
