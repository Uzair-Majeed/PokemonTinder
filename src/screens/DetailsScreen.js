import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchPokemonDetails, capitalize, formatId } from '../api/pokeapi';
import { COLORS, TYPE_COLORS } from '../constants/theme';
import { useCollection } from '../context/CollectionContext';
import StatBar from '../components/StatBar';
import LoadingView from '../components/LoadingView';
import ErrorView from '../components/ErrorView';

export default function DetailsScreen({ route, navigation }) {
  // 1. Read route parameters
  const { pokemonId, name: routeName } = route.params || {};

  const { isBookmarked, toggleBookmark } = useCollection();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const bookmarked = pokemonId ? isBookmarked(pokemonId) : false;

  // 2. Set customized header title and header bookmark toggle button
  useLayoutEffect(() => {
    const title = pokemon?.name
      ? capitalize(pokemon.name)
      : routeName
      ? capitalize(routeName)
      : `Pokémon #${pokemonId}`;

    navigation.setOptions({
      headerTitle: title,
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerBookmarkBtn}
          onPress={() => {
            if (pokemon) {
              toggleBookmark(pokemon);
            } else if (pokemonId) {
              toggleBookmark({
                id: pokemonId,
                name: routeName || `Pokemon #${pokemonId}`,
                imageUrl: pokemon?.imageUrl,
                types: pokemon?.types || [],
              });
            }
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name={bookmarked ? 'bookmark' : 'bookmark-outline'}
            size={22}
            color={bookmarked ? COLORS.highlight : '#FFFFFF'}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, pokemon, routeName, pokemonId, bookmarked, toggleBookmark]);

  // Fetch full details using the received ID
  const loadDetails = async () => {
    if (!pokemonId) {
      setError('No Pokémon ID provided via route parameters.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await fetchPokemonDetails(pokemonId);
      setPokemon(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch Pokémon details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [pokemonId]);

  if (loading) {
    return <LoadingView message={`Loading details for Pokémon #${pokemonId}...`} />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadDetails} />;
  }

  if (!pokemon) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Route Parameter Badge Banner */}
      <View style={styles.routeParamBanner}>
        <Ionicons name="git-branch-outline" size={16} color={COLORS.secondary} />
        <Text style={styles.routeParamText}>
          Route Parameter: <Text style={styles.boldText}>ID: {pokemonId}</Text>
          {routeName ? ` | Initial Name: "${routeName}"` : ''}
        </Text>
      </View>

      {/* Main Card */}
      <View style={styles.card}>
        {/* Top Info */}
        <View style={styles.cardHeader}>
          <Text style={styles.pokeIdBadge}>{formatId(pokemon.id)}</Text>
          <Text style={styles.pokeName}>{capitalize(pokemon.name)}</Text>
        </View>

        {/* Artwork Sprite */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: pokemon.imageUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Types */}
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

        {/* Physical Stats: Height & Weight */}
        <View style={styles.dimensionsRow}>
          <View style={styles.dimensionBox}>
            <Text style={styles.dimensionLabel}>Height</Text>
            <Text style={styles.dimensionValue}>{pokemon.height} m</Text>
          </View>
          <View style={styles.dimensionDivider} />
          <View style={styles.dimensionBox}>
            <Text style={styles.dimensionLabel}>Weight</Text>
            <Text style={styles.dimensionValue}>{pokemon.weight} kg</Text>
          </View>
        </View>

        {/* Base Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Base Stats</Text>
          {pokemon.stats.map((stat) => (
            <StatBar
              key={stat.name}
              name={stat.name}
              value={stat.value}
              maxValue={160}
            />
          ))}
        </View>

        {/* Primary Screen Bookmark Button */}
        <TouchableOpacity
          style={[
            styles.actionButton,
            bookmarked ? styles.actionButtonActive : styles.actionButtonInactive,
          ]}
          onPress={() => toggleBookmark(pokemon)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={bookmarked ? 'bookmark' : 'bookmark-outline'}
            size={18}
            color={bookmarked ? COLORS.primary : '#FFFFFF'}
          />
          <Text
            style={[
              styles.actionButtonText,
              bookmarked ? styles.actionButtonTextActive : styles.actionButtonTextInactive,
            ]}
          >
            {bookmarked ? 'Saved to Collection' : 'Add to Collection'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
    paddingBottom: 36,
  },
  headerBookmarkBtn: {
    marginRight: 10,
    padding: 6,
  },
  routeParamBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFE7F2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 14,
    gap: 6,
  },
  routeParamText: {
    fontSize: 12,
    color: COLORS.secondary,
  },
  boldText: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  pokeIdBadge: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.secondary,
    marginBottom: 2,
  },
  pokeName: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.primary,
  },
  imageWrapper: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF8FB',
    borderRadius: 100,
    marginVertical: 12,
  },
  image: {
    width: 180,
    height: 180,
  },
  typesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  typeBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 16,
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  dimensionsRow: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#FAF8FB',
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dimensionBox: {
    flex: 1,
    alignItems: 'center',
  },
  dimensionDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  dimensionLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  dimensionValue: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  statsSection: {
    width: '100%',
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  actionButtonInactive: {
    backgroundColor: COLORS.primary,
  },
  actionButtonActive: {
    backgroundColor: '#F5ECF7',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  actionButtonTextInactive: {
    color: '#FFFFFF',
  },
  actionButtonTextActive: {
    color: COLORS.primary,
  },
});
