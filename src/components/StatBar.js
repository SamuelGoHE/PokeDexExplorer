import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme/colors';
import { MAX_STAT, getStatLabel } from '../utils/statLabels';

// Una estadística: nombre, valor y una barra cuyo ancho es proporcional al valor.
export default function StatBar({ name, value, color }) {
  // CONCEPTO: ancho proporcional. valor / máximo posible, expresado como porcentaje (tope 100%).
  const widthPercent = Math.min((value / MAX_STAT) * 100, 100);

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{getStatLabel(name)}</Text>
      <Text style={styles.value}>{value}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${widthPercent}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xs + 2,
  },
  label: {
    width: 96,
    fontSize: 14,
    color: colors.textMuted,
  },
  value: {
    width: 36,
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  track: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E4E7EB',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 5,
  },
});
