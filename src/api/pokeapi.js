const BASE_URL = 'https://pokeapi.co/api/v2';

export const getPokemonImageUrl = (id) => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatId = (id) => {
  if (!id) return '';
  return `#${String(id).padStart(3, '0')}`;
};

export const extractIdFromUrl = (url) => {
  if (!url) return null;
  const parts = url.split('/').filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
};

export const fetchPokemonList = async (limit = 30, offset = 0) => {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokémon list (${response.status})`);
  }
  const data = await response.json();
  const pokemonList = data.results.map((item) => {
    const id = extractIdFromUrl(item.url);
    return {
      id,
      name: item.name,
      url: item.url,
      imageUrl: getPokemonImageUrl(id),
    };
  });
  return pokemonList;
};

export const fetchPokemonDetails = async (idOrName) => {
  if (!idOrName) {
    throw new Error('Pokémon ID or name is required');
  }
  const formattedQuery = String(idOrName).toLowerCase().trim();
  const response = await fetch(`${BASE_URL}/pokemon/${formattedQuery}`);
  if (!response.ok) {
    throw new Error(`Pokémon "${idOrName}" not found (${response.status})`);
  }
  const data = await response.json();

  const primaryImage =
    data.sprites?.other?.['official-artwork']?.front_default ||
    data.sprites?.front_default ||
    getPokemonImageUrl(data.id);

  const types = data.types ? data.types.map((t) => t.type.name) : [];

  const stats = data.stats
    ? data.stats.map((s) => ({
        name: s.stat.name,
        value: s.base_stat,
      }))
    : [];

  return {
    id: data.id,
    name: data.name,
    imageUrl: primaryImage,
    height: data.height / 10, // decimetres to meters
    weight: data.weight / 10, // hectograms to kg
    types,
    stats,
  };
};
