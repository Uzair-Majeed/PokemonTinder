import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, TYPE_COLORS } from '../constants/theme';
import { capitalize, formatId } from '../api/pokeapi';
import { Ionicons } from '@expo/vector-icons';
import { useCollection } from '../context/CollectionContext';

export default function PokemonRow({ pokemon, onPress, showBookmarkAction = false }) {
  const { isBookmarked, toggleBookmark } = useCollection();
  const bookmarked = isBookmarked(pokemon.id);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: pokemon.imageUrl }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.idText}>{formatId(pokemon.id)}</Text>
        <Text style={styles.nameText}>{capitalize(pokemon.name)}</Text>
        {pokemon.types && pokemon.types.length > 0 && (
          <View style={styles.typesRow}>
            {pokemon.types.map((type) => (
              <View
                key={type}
                style={[
                  styles.typeBadge,
                  { backgroundColor: TYPE_COLORS[type] || COLORS.secondary },
                ]}
              >
                <Text style={styles.typeText}>{capitalize(type)}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.actions}>
        {showBookmarkAction ? (
          <TouchableOpacity
            style={styles.bookmarkButton}
            onPress={() => toggleBookmark(pokemon)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={bookmarked ? 'bookmark' : 'bookmark-outline'}
              size={22}
              color={bookmarked ? COLORS.secondary : COLORS.textSecondary}
            />
          </TouchableOpacity>
        ) : (
          <Ionicons name="chevron-forward" size={20} color={COLORS.secondary} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 4,
    marginHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  imageWrapper: {
    width: 54,
    height: 54,
    borderRadius: 8,
    backgroundColor: '#F3EEF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  image: {
    width: 48,
    height: 48,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  idText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginVertical: 2,
  },
  typesRow: {
    flexDirection: 'row',
    marginTop: 2,
    gap: 6,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actions: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkButton: {
    padding: 6,
  },
});
