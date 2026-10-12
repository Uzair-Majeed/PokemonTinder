import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchPokemonDetails, capitalize, formatId } from '../api/pokeapi';
import { COLORS, TYPE_COLORS } from '../constants/theme';
import StatBar from '../components/StatBar';

const QUICK_PICKS = [
  { id: 1, name: 'bulbasaur' },
  { id: 4, name: 'charmander' },
  { id: 7, name: 'squirtle' },
  { id: 25, name: 'pikachu' },
  { id: 150, name: 'mewtwo' },
  { id: 94, name: 'gengar' },
];

export default function CompareScreen() {
  const [pokemon1Query, setPokemon1Query] = useState('1'); // default Bulbasaur
  const [pokemon2Query, setPokemon2Query] = useState('4'); // default Charmander

  const [pokemon1, setPokemon1] = useState(null);
  const [pokemon2, setPokemon2] = useState(null);

  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const [error1, setError1] = useState(null);
  const [error2, setError2] = useState(null);

  const loadPokemon1 = async (query) => {
    const q = (query || pokemon1Query).trim().toLowerCase();
    if (!q) return;
    setLoading1(true);
    setError1(null);
    try {
      const data = await fetchPokemonDetails(q);
      setPokemon1(data);
    } catch (err) {
      setError1(`Not found: "${q}"`);
    } finally {
      setLoading1(false);
    }
  };

  const loadPokemon2 = async (query) => {
    const q = (query || pokemon2Query).trim().toLowerCase();
    if (!q) return;
    setLoading2(true);
    setError2(null);
    try {
      const data = await fetchPokemonDetails(q);
      setPokemon2(data);
    } catch (err) {
      setError2(`Not found: "${q}"`);
    } finally {
      setLoading2(false);
    }
  };

  useEffect(() => {
    loadPokemon1('1');
    loadPokemon2('4');
  }, []);

  const renderPokemonColumn = (
    pokemon,
    loading,
    error,
    query,
    setQuery,
    onFetch,
    slotNumber
  ) => {
    return (
      <View style={styles.column}>
        {/* Selection input */}
        <View style={styles.selectorBox}>
          <Text style={styles.slotLabel}>Pokémon {slotNumber}</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Name or ID"
              placeholderTextColor={COLORS.textSecondary}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={() => {
                Keyboard.dismiss();
                onFetch(query);
              }}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.fetchBtn}
              onPress={() => {
                Keyboard.dismiss();
                onFetch(query);
              }}
            >
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content / Loading / Error */}
        {loading ? (
          <View style={styles.colCenter}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : error ? (
          <View style={styles.colCenter}>
            <Ionicons name="alert-circle-outline" size={32} color={COLORS.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : pokemon ? (
          <View style={styles.pokemonContent}>
            <View style={styles.spriteWrapper}>
              <Image
                source={{ uri: pokemon.imageUrl }}
                style={styles.sprite}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.pokeId}>{formatId(pokemon.id)}</Text>
            <Text style={styles.pokeName} numberOfLines={1}>
              {capitalize(pokemon.name)}
            </Text>

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

            {/* Physical metrics */}
            <View style={styles.metricsBox}>
              <Text style={styles.metricItem}>Ht: {pokemon.height}m</Text>
              <Text style={styles.metricItem}>Wt: {pokemon.weight}kg</Text>
            </View>

            {/* Stats */}
            <View style={styles.statsSection}>
              <Text style={styles.statsHeader}>Base Stats</Text>
              {pokemon.stats.map((s) => (
                <StatBar
                  key={s.name}
                  name={s.name}
                  value={s.value}
                  maxValue={150}
                  compact={true}
                />
              ))}
            </View>
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header notice */}
      <View style={styles.headerBanner}>
        <Text style={styles.bannerTitle}>Side-by-Side Comparison</Text>
        <Text style={styles.bannerSubtitle}>
          Enter a Pokémon name/ID or pick quick suggestions below:
        </Text>
        {/* Quick select chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickPicksRow}
        >
          {QUICK_PICKS.map((qp) => (
            <TouchableOpacity
              key={qp.id}
              style={styles.quickChip}
              onPress={() => {
                // If pokemon1 is already this one, assign to 2, otherwise 1
                if (pokemon1?.name === qp.name) {
                  setPokemon2Query(qp.name);
                  loadPokemon2(qp.name);
                } else {
                  setPokemon1Query(qp.name);
                  loadPokemon1(qp.name);
                }
              }}
            >
              <Text style={styles.quickChipText}>{capitalize(qp.name)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Split screen two halves */}
      <View style={styles.splitGrid}>
        {renderPokemonColumn(
          pokemon1,
          loading1,
          error1,
          pokemon1Query,
          setPokemon1Query,
          loadPokemon1,
          1
        )}

        <View style={styles.splitDivider}>
          <View style={styles.vsCircle}>
            <Text style={styles.vsText}>VS</Text>
          </View>
        </View>

        {renderPokemonColumn(
          pokemon2,
          loading2,
          error2,
          pokemon2Query,
          setPokemon2Query,
          loadPokemon2,
          2
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  headerBanner: {
    padding: 14,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginVertical: 4,
  },
  quickPicksRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 6,
  },
  quickChip: {
    backgroundColor: '#F3EEF5',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  splitGrid: {
    flexDirection: 'row',
    padding: 8,
    position: 'relative',
  },
  column: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 480,
  },
  splitDivider: {
    position: 'absolute',
    left: '50%',
    top: 54,
    marginLeft: -16,
    zIndex: 10,
  },
  vsCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.warmAccent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  vsText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  selectorBox: {
    marginBottom: 10,
  },
  slotLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.secondary,
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  input: {
    flex: 1,
    backgroundColor: '#FAF8FB',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    fontSize: 12,
    color: COLORS.text,
  },
  fetchBtn: {
    backgroundColor: COLORS.primary,
    padding: 7,
    borderRadius: 8,
  },
  colCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 12,
    color: COLORS.secondary,
  },
  errorText: {
    marginTop: 6,
    fontSize: 11,
    color: COLORS.error,
    textAlign: 'center',
  },
  pokemonContent: {
    alignItems: 'center',
  },
  spriteWrapper: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF8FB',
    borderRadius: 45,
    marginVertical: 4,
  },
  sprite: {
    width: 80,
    height: 80,
  },
  pokeId: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  pokeName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginVertical: 2,
  },
  typesRow: {
    flexDirection: 'row',
    gap: 4,
    marginVertical: 4,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  metricsBox: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 4,
  },
  metricItem: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  statsSection: {
    width: '100%',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
  },
  statsHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
});
