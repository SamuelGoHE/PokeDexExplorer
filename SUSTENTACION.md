# Guía de sustentación

Preguntas probables y cómo las respondo. Cada respuesta indica dónde está el código.

## Arquitectura

**¿Por qué organizaste el proyecto así?**
Separé tres capas: el servicio hace la petición (`services/pokeAPI.js`), el hook guarda el estado de esa petición (`hooks/`) y la pantalla solo dibuja (`screens/`, `components/`). Así cumplí la regla del taller: ninguna llamada a la API queda mezclada con estilos o JSX. Si la API cambia, edito un solo archivo.

**¿Qué hace un mapper y por qué creaste `mapPokemon`?**
Convierte la respuesta cruda en solo los campos que usa mi app (`pokeAPI.js`). Así las pantallas no dependen de la forma de la API: si un campo cambia de nombre, lo arreglo en el mapper. También divido `height` y `weight` entre 10 para tener metros y kilogramos.

**¿Por qué sacas el id de la lista a partir de la URL?**
El endpoint de lista solo devuelve `name` y `url`. El id es el último segmento (`.../pokemon/25/`), y con él armo la URL de la imagen. Así evito pedir la ficha de cada Pokémon, que serían 20 peticiones por página.

## fetch y errores

**¿Por qué revisas `response.ok` antes de `response.json()`?**
`fetch` no lanza error con un 404 o un 500; solo falla si no hay red. Si llamo a `.json()` sobre una respuesta de error, intento leer algo que puede no ser JSON.

**¿En qué se diferencian `null` y `Error` en `getPokemon`?**
`null` significa que la API respondió 404: el Pokémon no existe, y mi interfaz muestra "sin resultados". Un `Error` significa que algo falló (red, servidor), y mi interfaz muestra el error con "Reintentar". Los separé porque son dos situaciones distintas para el usuario.

## useEffect

**¿Qué pasa si quitas el array de dependencias de un `useEffect`?**
El efecto correría después de cada render. Como dentro hago `setState`, eso provocaría otro render y otra petición: un bucle infinito. Es el riesgo que advierte el taller.

**¿Qué dependencias tiene cada efecto y por qué?**
- `usePokemonList`: `[attempt]`. Corre al montar y cuando pulso "Reintentar".
- `usePokemonSearch`: `[query, attempt]`. Corre al confirmar una búsqueda nueva, no con cada tecla.
- `usePokemonDetail`: `[id, attempt]`. Corre al abrir un Pokémon distinto.
- `App.js` (botón atrás): `[selectedId]`. El listener solo existe mientras hay una ficha abierta.

**¿Para qué sirve la función que devuelve el efecto (`return () => controller.abort()`)?**
Es la función de limpieza. React la ejecuta antes de repetir el efecto o al desmontar. La uso para cancelar la petición con `AbortController`: si el usuario busca otra cosa antes de que termine la anterior, la vieja se cancela y nunca aparece un resultado viejo sobre el nuevo.

**¿Por qué haces `if (err.name === 'AbortError') return`?**
Una petición cancelada no es un error real. Si lo mostrara, el usuario vería un mensaje de error por algo que yo mismo provoqué.

## Listas y scroll infinito

**¿Por qué usas `FlatList` y no `ScrollView` con `map`?**
`FlatList` renderiza solo lo visible; `ScrollView` renderiza todo de golpe. Con más de mil Pokémon, la diferencia es enorme. En la ficha sí uso `ScrollView` porque son pocos elementos.

**¿Cómo funciona tu scroll infinito?**
`onEndReached` se dispara cuando el usuario se acerca al final (`onEndReachedThreshold={0.5}` = cuando falta media pantalla). `loadMore` pide la siguiente página con `offset = pokemon.length` y agrega los resultados al final. Cuando la API devuelve `next: null`, `hasMore` pasa a `false` y dejo de pedir.

**¿Por qué usas `useRef` en `loadMore`?**
`onEndReached` puede dispararse varias veces seguidas. Un `useState` (`loadingMore`) se actualiza hasta el siguiente render, así que dos llamadas rápidas verían `false` y pedirían la misma página dos veces. Un `ref` cambia al instante y me sirve como guarda.

**¿Qué pasa si falla la carga de "más"?**
Conservo los Pokémon ya cargados y el pie de la lista muestra un mensaje con "Reintentar". `loadMore` no insiste solo, porque entraría en un bucle de peticiones fallidas.

## Búsqueda

**¿Por qué tienes dos textos, `draft` y `query`?**
`draft` es lo que el usuario escribe y cambia con cada tecla; `query` es la búsqueda confirmada con el botón. Si el efecto dependiera de `draft`, haría una petición por letra.

**¿Cómo ignoras mayúsculas, espacios y el formato del número?**
`getPokemon` aplica `trim().toLowerCase()`, y si el texto es un número (`25`, `025` o `#025`) lo normalizo a `25`, que es lo que acepta la API.

## Interfaz

**¿Por qué una `Image` remota necesita `width` y `height`?**
React Native no conoce el tamaño de una imagen remota antes de descargarla, así que sin dimensiones explícitas no reserva espacio y no se ve.

**¿Cómo calculas el ancho de las barras de estadísticas?**
`valor / 255 * 100` como porcentaje (`StatBar.js`). 255 es el máximo posible de una estadística base, y limito el resultado a 100%.

**¿Por qué la lista no se pierde al abrir una ficha?**
En `App.js` no desmonto `HomeScreen`: la oculto con `display: 'none'`. Si la cambiara con un `if`, se desmontaría y perdería los Pokémon cargados, la búsqueda y el scroll.

**¿Qué es "estado elevado" (lifting state up) en `App.js`?**
`selectedId` vive en `App` porque lo necesitan dos pantallas: la lista lo establece al tocar una tarjeta y la ficha lo lee para saber qué pedir.

**¿Por qué las tarjetas de la lista no tienen el color del tipo?**
El endpoint de lista no trae los tipos. Para pintarlas tendría que pedir la ficha de cada Pokémon, 20 peticiones por página, y el taller indica no hacerlo. Los colores por tipo se ven en la ficha.

## Preguntas de práctica

1. Si el usuario escribe "Pikachu " y pulsa Buscar dos veces seguidas, ¿cuántas peticiones hago? (Una: `query` no cambió.)
2. Si apagan el wifi a mitad de una búsqueda, ¿qué ve el usuario? (Error con "Reintentar".)
3. Si buscan "xyz", ¿es un `null` o un `Error`? ¿Cómo lo muestro? (`null`; "sin resultados" con "Ver todos".)
4. ¿Qué cambiaría para que cada tarjeta de la lista mostrara su tipo? (Pedir la ficha de cada una y guardar el resultado en caché; el costo son más peticiones.)
