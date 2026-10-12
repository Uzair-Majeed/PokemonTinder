import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

const STAT_LABELS = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'Sp. ATK',
  'special-defense': 'Sp. DEF',
  speed: 'SPD',
};

export default function StatBar({ name, value, maxValue = 160, compact = false }) {
  const label = STAT_LABELS[name] || name.toUpperCase();
  const percentage = Math.min(100, Math.round((value / maxValue) * 100));

  return (
    <View style={[styles.container, compact && styles.compactContainer]}>
      <Text style={[styles.label, compact && styles.compactLabel]} numberOfLines={1}>
        {label}
      </Text>
      <Text style={[styles.value, compact && styles.compactValue]}>{value}</Text>
      <View style={styles.barTrack}>
        <View
          style={[
            styles.barFill,
            {
              width: `${percentage}%`,
              backgroundColor: percentage > 50 ? COLORS.warmAccent : COLORS.secondary,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  compactContainer: {
    marginVertical: 2,
  },
  label: {
    width: 68,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  compactLabel: {
    width: 52,
    fontSize: 10,
  },
  value: {
    width: 34,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'right',
    marginRight: 10,
  },
  compactValue: {
    width: 28,
    fontSize: 11,
    marginRight: 6,
  },
  barTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#EBE6EE',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
});
