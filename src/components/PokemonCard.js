import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';
import { capitalize, formatId } from '../api/pokeapi';
import { Ionicons } from '@expo/vector-icons';
import { useCollection } from '../context/CollectionContext';

export default function PokemonCard({ pokemon, onPress }) {
  const { isBookmarked } = useCollection();
  const bookmarked = isBookmarked(pokemon.id);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.headerRow}>
        <Text style={styles.idText}>{formatId(pokemon.id)}</Text>
        {bookmarked && (
          <Ionicons name="bookmark" size={16} color={COLORS.highlight} />
        )}
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: pokemon.imageUrl }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.nameText} numberOfLines={1}>
        {capitalize(pokemon.name)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  idText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  imageContainer: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  nameText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 4,
  },
});
