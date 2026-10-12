import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCollection } from '../context/CollectionContext';
import PokemonRow from '../components/PokemonRow';
import { COLORS } from '../constants/theme';

export default function CollectionScreen({ navigation }) {
  const { collection } = useCollection();

  const handleSelectPokemon = (item) => {
    // Pass route parameters: pokemonId and name
    navigation.navigate('PokemonDetails', {
      pokemonId: item.id,
      name: item.name,
    });
  };

  return (
    <View style={styles.container}>
      {collection.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="bookmark-outline" size={48} color={COLORS.secondary} />
          </View>
          <Text style={styles.emptyTitle}>Your Collection is Empty</Text>
          <Text style={styles.emptySubtitle}>
            Save Pokémon to your collection by tapping the bookmark icon on any Pokémon's details screen.
          </Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.8}
          >
            <Ionicons name="compass-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.exploreButtonText}>Explore Pokémon</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.headerInfo}>
            <Text style={styles.countText}>
              {collection.length} Saved {collection.length === 1 ? 'Pokémon' : 'Pokémon'}
            </Text>
            <Text style={styles.subText}>Tap to view details or remove bookmark</Text>
          </View>
          <FlatList
            data={collection}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <PokemonRow
                pokemon={item}
                onPress={() => handleSelectPokemon(item)}
                showBookmarkAction={true}
              />
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  headerInfo: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  countText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  subText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  listContent: {
    paddingVertical: 6,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F0EAF2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
