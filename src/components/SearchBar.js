import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, spacing } from '../theme/colors';

// CONCEPTO: input controlado. El texto vive en el estado de la pantalla (`value`) y el
// TextInput solo avisa los cambios (`onChangeText`). No se busca con cada tecla: solo
// al pulsar "Buscar" o la tecla de búsqueda del teclado.
export default function SearchBar({ value, onChangeText, onSubmit }) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Busca por nombre o número..."
        placeholderTextColor={colors.textMuted}
        // Sin mayúscula automática ni autocorrector: los nombres de Pokémon no son palabras comunes.
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
      />
      <Pressable style={styles.button} onPress={onSubmit}>
        <Text style={styles.buttonText}>Buscar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.card,
    borderRadius: 8,
    fontSize: 16,
    color: colors.text,
  },
  button: {
    marginLeft: spacing.sm,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  buttonText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});
