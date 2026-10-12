import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchPokemonList } from '../api/pokeapi';
import PokemonCard from '../components/PokemonCard';
import LoadingView from '../components/LoadingView';
import ErrorView from '../components/ErrorView';
import { COLORS } from '../constants/theme';

export default function HomeScreen({ navigation }) {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Random Pokémon handler for Header button
  const handleRandomPokemon = () => {
    // Generate a random ID between 1 and 151 (Gen 1)
    const randomId = Math.floor(Math.random() * 151) + 1;
    // Pass route parameters: pokemonId and name
    navigation.navigate('PokemonDetails', {
      pokemonId: randomId,
      name: `Pokemon #${randomId}`,
    });
  };

  // Configure header button for Home screen
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Pokémon Explorer',
      headerRight: () => (
        <TouchableOpacity
          onPress={handleRandomPokemon}
          style={styles.headerButton}
          activeOpacity={0.8}
        >
          <Ionicons name="dice-outline" size={20} color="#FFFFFF" />
          <Text style={styles.headerButtonText}>Random</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const loadPokemon = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      // Fetch a modest first page of Pokémon (30 items)
      const data = await fetchPokemonList(30, 0);
      setPokemonList(data);
    } catch (err) {
      setError(err.message || 'Failed to load Pokémon');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPokemon();
  }, []);

  const handleSelectPokemon = (item) => {
    // Pass route parameters: pokemonId and name
    navigation.navigate('PokemonDetails', {
      pokemonId: item.id,
      name: item.name,
    });
  };

  if (loading) {
    return <LoadingView message="Exploring Pokémon world..." />;
  }

  if (error && pokemonList.length === 0) {
    return <ErrorView message={error} onRetry={() => loadPokemon()} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>
          Browse Generation I Pokémon or tap "Random" in header to discover!
        </Text>
      </View>

      <FlatList
        data={pokemonList}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <PokemonCard
            pokemon={item}
            onPress={() => handleSelectPokemon(item)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadPokemon(true)}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  subtitleContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  listContent: {
    padding: 10,
    paddingBottom: 24,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 10,
    gap: 4,
  },
  headerButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
