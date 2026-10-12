import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchPokemonDetails, capitalize } from '../api/pokeapi';
import PokemonRow from '../components/PokemonRow';
import { COLORS } from '../constants/theme';

const SUGGESTIONS = [
  { id: 25, name: 'pikachu' },
  { id: 6, name: 'charizard' },
  { id: 1, name: 'bulbasaur' },
  { id: 150, name: 'mewtwo' },
  { id: 133, name: 'eevee' },
  { id: 94, name: 'gengar' },
];

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (searchTerm) => {
    const term = (searchTerm || query).trim().toLowerCase();
    if (!term) return;

    Keyboard.dismiss();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await fetchPokemonDetails(term);
      setResult(data);
    } catch (err) {
      setError(`No Pokémon found for "${term}". Please check the spelling or ID.`);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResult(null);
    setError(null);
  };

  const handleSelectPokemon = (item) => {
    // Pass route parameters: pokemonId and name
    navigation.navigate('PokemonDetails', {
      pokemonId: item.id,
      name: item.name,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <Ionicons name="search" size={20} color={COLORS.secondary} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search by Pokémon name or ID (e.g. pikachu, 25)..."
          placeholderTextColor={COLORS.textSecondary}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => handleSearch()}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => handleSearch()}
          activeOpacity={0.8}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Searching PokéAPI database...</Text>
        </View>
      )}

      {error && !loading && (
        <View style={styles.centerContainer}>
          <Ionicons name="information-circle-outline" size={40} color={COLORS.secondary} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {result && !loading && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsHeading}>Search Result:</Text>
          <PokemonRow
            pokemon={result}
            onPress={() => handleSelectPokemon(result)}
            showBookmarkAction={false}
          />
        </View>
      )}

      {!result && !loading && !error && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsHeading}>Quick Suggestions</Text>
          <Text style={styles.suggestionsSub}>Tap a suggestion or search any Pokémon above:</Text>
          <View style={styles.chipsWrapper}>
            {SUGGESTIONS.map((sug) => (
              <TouchableOpacity
                key={sug.id}
                style={styles.chip}
                onPress={() => {
                  setQuery(sug.name);
                  handleSearch(sug.name);
                }}
              >
                <Ionicons name="sparkles" size={14} color={COLORS.secondary} />
                <Text style={styles.chipText}>{capitalize(sug.name)}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    margin: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    paddingVertical: 6,
  },
  clearButton: {
    padding: 4,
    marginRight: 6,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: '500',
  },
  errorText: {
    marginTop: 10,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  resultsContainer: {
    marginTop: 10,
  },
  resultsHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.secondary,
    marginLeft: 16,
    marginBottom: 8,
  },
  suggestionsContainer: {
    padding: 20,
  },
  suggestionsHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  suggestionsSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 14,
  },
  chipsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    gap: 6,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
});
