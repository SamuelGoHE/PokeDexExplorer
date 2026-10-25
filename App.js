import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DetailScreen from './src/screens/DetailScreen';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  // CONCEPTO: estado elevado (lifting state up). El Pokémon seleccionado vive en App porque
  // lo necesitan dos pantallas: la lista lo establece y la ficha lo lee.
  const [selectedId, setSelectedId] = useState(null);

  // CONCEPTO: useEffect con limpieza. Mientras hay una ficha abierta, el botón "atrás" de Android
  // vuelve a la lista en vez de cerrar la app. Depende de [selectedId]: el listener solo existe
  // cuando hay ficha, y la limpieza lo quita al cerrarla o al desmontar.
  useEffect(() => {
    if (selectedId === null) {
      return;
    }
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      setSelectedId(null);
      // true = "ya manejé el evento": Android no cierra la app.
      return true;
    });
    return () => subscription.remove();
  }, [selectedId]);

  return (
    <SafeAreaProvider>
      {/* La lista NO se desmonta al abrir la ficha, solo se oculta: así conserva los Pokémon
          cargados, la búsqueda y la posición del scroll al volver. */}
      <View style={[styles.screen, selectedId !== null && styles.hidden]}>
        <HomeScreen onSelect={setSelectedId} />
      </View>
      {selectedId !== null && <DetailScreen id={selectedId} onBack={() => setSelectedId(null)} />}
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  hidden: {
    display: 'none',
  },
});
