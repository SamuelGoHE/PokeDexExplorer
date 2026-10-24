import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, gradients, spacing } from '../theme/colors';
import { capitalize, formatId } from '../utils/format';
import { getCardBackground, getTypeInfo } from '../utils/pokemonTypes';
import StatBar from './StatBar';
import TypeBadge from './TypeBadge';

// Ficha completa con aspecto de carta coleccionable. Solo dibuja: recibe el Pokémon por props.
export default function PokemonDetailCard({ pokemon }) {
  const mainType = getTypeInfo(pokemon.types[0]);
  const hp = pokemon.stats.find((stat) => stat.name === 'hp')?.value;

  return (
    // 1. Marco metálico exterior
    <View style={[styles.frame, { backgroundImage: gradients.silver }]}>
      {/* 2. Fondo de la carta: degradado con los colores del tipo */}
      <View style={[styles.card, { backgroundImage: getCardBackground(pokemon.types) }]}>
        {/* 3. Encabezado: medallón con el número, nombre y PS con el círculo del tipo */}
        <View style={styles.header}>
          <View style={[styles.medallion, { backgroundImage: gradients.silver }]}>
            <Text style={styles.medallionText}>{formatId(pokemon.id)}</Text>
          </View>
          <Text style={styles.name} numberOfLines={1}>
            {capitalize(pokemon.name)}
          </Text>
          <Text style={styles.hpLabel}>PS</Text>
          <Text style={styles.hpValue}>{hp}</Text>
          <View style={[styles.typeDot, { backgroundColor: mainType.color }]} />
        </View>

        {/* 4. Imagen grande sobre un halo de luz */}
        <View style={styles.art}>
          <View style={[styles.glow, { backgroundImage: gradients.glow }]} />
          {/* CONCEPTO: una Image remota necesita width y height explícitos o no se ve. */}
          <Image source={{ uri: pokemon.image }} style={styles.image} resizeMode="contain" />
        </View>

        {/* 5. Estadísticas base: ocupan el lugar de los ataques de la carta original */}
        <View style={styles.panel}>
          {pokemon.stats.map((stat) => (
            <StatBar key={stat.name} name={stat.name} value={stat.value} color={mainType.color} />
          ))}
        </View>

        {/* 6. Franja de medidas, como la fila debilidad / resistencia / retirada */}
        <View style={styles.measures}>
          <View style={styles.measure}>
            <Text style={styles.measureLabel}>altura</Text>
            <Text style={styles.measureValue}>{pokemon.height.toFixed(1)} m</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.measure}>
            <Text style={styles.measureLabel}>peso</Text>
            <Text style={styles.measureValue}>{pokemon.weight.toFixed(1)} kg</Text>
          </View>
        </View>

        {/* 7. Barra plateada con los distintivos de tipo */}
        <View style={[styles.typeBar, { backgroundImage: gradients.silver }]}>
          {pokemon.types.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
        </View>

        {/* 8. Reflejo diagonal; pointerEvents="none" para que no bloquee los toques */}
        <View pointerEvents="none" style={[styles.gloss, { backgroundImage: gradients.gloss }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignSelf: 'stretch',
    padding: 8,
    borderRadius: 22,
  },
  card: {
    borderRadius: 15,
    padding: spacing.sm + 2,
    // Recorta el reflejo y el halo a las esquinas redondeadas de la carta.
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medallion: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  medallionText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
  },
  name: {
    flex: 1,
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  hpLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    marginRight: 2,
  },
  hpValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginRight: spacing.sm,
  },
  typeDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  art: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
  },
  image: {
    width: 240,
    height: 240,
  },
  panel: {
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  measures: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 10,
  },
  measure: {
    flex: 1,
    alignItems: 'center',
  },
  measureLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  measureValue: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  separator: {
    width: 1,
    height: 28,
    backgroundColor: '#C4C9D1',
  },
  typeBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: 10,
  },
  gloss: {
    ...StyleSheet.absoluteFillObject,
  },
});
