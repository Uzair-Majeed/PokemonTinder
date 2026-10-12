# Assignment 2: React Navigation — Detailed Implementation & Code Explanation Guide

This document provides a comprehensive, step-by-step explanation of the entire **Pokémon Explorer** application. It details how each assignment requirement was met, which files and functions implement each concept, and how to explain the code during your viva evaluation.

---

## 📑 Table of Contents
1. [Architecture Overview & Navigator Tree](#1-architecture-overview--navigator-tree)
2. [Requirement 1: Passing Route Parameters](#2-requirement-1-passing-route-parameters)
3. [Requirement 2: Displaying Received Parameters](#3-requirement-2-displaying-received-parameters)
4. [Requirement 3: Customized Header Titles & Options](#4-requirement-3-customized-header-titles--options)
5. [Requirement 4: Navigation Header Buttons with Meaningful Actions](#5-requirement-4-navigation-header-buttons-with-meaningful-actions)
6. [Requirement 5: Navigator Combination (Stack + Bottom Tabs)](#6-requirement-5-navigator-combination-stack--bottom-tabs)
7. [Screen-by-Screen Code Walkthrough](#7-screen-by-screen-code-walkthrough)
   - [HomeScreen.js](#homescreenjs)
   - [SearchScreen.js](#searchscreenjs)
   - [CollectionScreen.js](#collectionscreenjs)
   - [CompareScreen.js](#comparescreenjs)
   - [DetailsScreen.js](#detailsscreenjs)
8. [Data Fetching & State Management](#8-data-fetching--state-management)
9. [Viva Q&A Quick Reference](#9-viva-qa-quick-reference)

---

## 1. Architecture Overview & Navigator Tree

The application implements a combination of **Two Navigator Types**:
- **Native Stack Navigator** (the root container navigator).
- **Bottom Tab Navigator** (nested inside the Stack Navigator as the main dashboard).

### Navigation Hierarchy Diagram
```
Stack Navigator (AppNavigator)
│
├── MainTabs Screen (Tab Navigator)
│   ├── Home Screen ("Pokémon Explorer")
│   ├── Search Screen ("Search")
│   ├── Collection Screen ("My Collection")
│   └── Compare Screen ("Compare Pokémon")
│
└── PokemonDetails Screen (Stack Screen)
    └── Receives: route.params = { pokemonId, name }
```

### Why this design?
- Nesting the Tab Navigator inside the Stack Navigator ensures that when a user selects a Pokémon from any tab (Home, Search, or Collection), the **Details screen pushes onto the stack over the tab bar**, providing a native mobile drill-down experience with a built-in back button.

---

## 2. Requirement 1: Passing Route Parameters

### The Requirement:
> *"Pass data from one screen to another using route parameters."*

### Where is it implemented?
1. **[src/screens/HomeScreen.js](file:///d:/Semesters/Semester%20VII/SMD/Assignment_02/src/screens/HomeScreen.js)**
2. **[src/screens/SearchScreen.js](file:///d:/Semesters/Semester%20VII/SMD/Assignment_02/src/screens/SearchScreen.js)**
3. **[src/screens/CollectionScreen.js](file:///d:/Semesters/Semester%20VII/SMD/Assignment_02/src/screens/CollectionScreen.js)**

### Code Explanation:
In React Navigation, the second argument of `navigation.navigate(routeName, params)` passes a serializable parameters object.

#### 1. From Home Screen (card tap):
```javascript
// src/screens/HomeScreen.js
const handleSelectPokemon = (item) => {
  navigation.navigate('PokemonDetails', {
    pokemonId: item.id, // e.g. 25
    name: item.name,    // e.g. "pikachu"
  });
};
```

#### 2. From Home Screen (random header button):
```javascript
// src/screens/HomeScreen.js
const handleRandomPokemon = () => {
  const randomId = Math.floor(Math.random() * 151) + 1;
  navigation.navigate('PokemonDetails', {
    pokemonId: randomId,
    name: `Pokemon #${randomId}`,
  });
};
```

#### 3. From Search Screen & Collection Screen:
```javascript
// src/screens/SearchScreen.js & CollectionScreen.js
const handleSelectPokemon = (item) => {
  navigation.navigate('PokemonDetails', {
    pokemonId: item.id,
    name: item.name,
  });
};
```

---

## 3. Requirement 2: Displaying Received Parameters

### The Requirement:
> *"Display the received parameters on the destination screen."*

### Where is it implemented?
- **[src/screens/DetailsScreen.js](file:///d:/Semesters/Semester%20VII/SMD/Assignment_02/src/screens/DetailsScreen.js)**

### Code Explanation:
The destination screen receives `route` as a prop. Parameters are accessed via `route.params`.

#### 1. Reading the route parameters:
```javascript
// src/screens/DetailsScreen.js
export default function DetailsScreen({ route, navigation }) {
  // Destructure route parameters
  const { pokemonId, name: routeName } = route.params || {};
  ...
```

#### 2. Explicitly displaying the received parameter in the UI:
A dedicated visual banner at the top of the Details screen explicitly showcases the received route parameters for quick verification during grading/viva:
```jsx
{/* Route Parameter Badge Banner */}
<View style={styles.routeParamBanner}>
  <Ionicons name="git-branch-outline" size={16} color={COLORS.secondary} />
  <Text style={styles.routeParamText}>
    Route Parameter: <Text style={styles.boldText}>ID: {pokemonId}</Text>
    {routeName ? ` | Initial Name: "${routeName}"` : ''}
  </Text>
</View>
```

#### 3. Using the received parameter to fetch PokéAPI data:
```javascript
// Uses the received pokemonId to query the PokéAPI endpoint:
// https://pokeapi.co/api/v2/pokemon/{pokemonId}
useEffect(() => {
  loadDetails();
}, [pokemonId]);
```

---

## 4. Requirement 3: Customized Header Titles & Options

### The Requirement:
> *"Customize the header title and/or other header options for different screens."*

### Where is it implemented?
- **Static Configuration:** [src/navigation/TabNavigator.js](file:///d:/Semesters/Semester%20VII/SMD/Assignment_02/src/navigation/TabNavigator.js) & [src/navigation/AppNavigator.js](file:///d:/Semesters/Semester%20VII/SMD/Assignment_02/src/navigation/AppNavigator.js)
- **Dynamic Configuration:** [src/screens/DetailsScreen.js](file:///d:/Semesters/Semester%20VII/SMD/Assignment_02/src/screens/DetailsScreen.js) & [src/screens/HomeScreen.js](file:///d:/Semesters/Semester%20VII/SMD/Assignment_02/src/screens/HomeScreen.js)

### Code Explanation:

#### 1. Custom Global Header Styles (Palette `#522D60`):
In both `TabNavigator.js` and `AppNavigator.js`:
```javascript
headerStyle: {
  backgroundColor: COLORS.primary, // #522D60
},
headerTintColor: '#FFFFFF',
headerTitleStyle: {
  fontWeight: '700',
  fontSize: 18,
},
```

#### 2. Screen-Specific Header Titles:
In `TabNavigator.js`:
```javascript
<Tab.Screen
  name="Home"
  component={HomeScreen}
  options={{
    title: 'Explorer',
    headerTitle: 'Pokémon Explorer', // Custom Title 1
  }}
/>
<Tab.Screen
  name="Search"
  component={SearchScreen}
  options={{
    title: 'Search',
    headerTitle: 'Search',           // Custom Title 2
  }}
/>
<Tab.Screen
  name="Collection"
  component={CollectionScreen}
  options={{
    title: 'Collection',
    headerTitle: 'My Collection',    // Custom Title 3
  }}
/>
<Tab.Screen
  name="Compare"
  component={CompareScreen}
  options={{
    title: 'Compare',
    headerTitle: 'Compare Pokémon',  // Custom Title 4
  }}
/>
```

#### 3. Dynamic Title Based on Parameter/Data:
In `DetailsScreen.js`, the header title is updated dynamically to the capitalized Pokémon name (e.g., "Pikachu"):
```javascript
useLayoutEffect(() => {
  const title = pokemon?.name
    ? capitalize(pokemon.name)
    : routeName
    ? capitalize(routeName)
    : `Pokémon #${pokemonId}`;

  navigation.setOptions({
    headerTitle: title, // e.g. "Charizard", "Bulbasaur"
  });
}, [navigation, pokemon, routeName, pokemonId]);
```

---

## 5. Requirement 4: Navigation Header Buttons with Meaningful Actions

### The Requirement:
> *"Add a button to the navigation header. The button should perform a meaningful action, such as navigating to another screen, updating data, or displaying an alert."*

### Implemented: Two Meaningful Header Buttons!

### Header Button 1: Random Pokémon Navigator
- **File:** [src/screens/HomeScreen.js](file:///d:/Semesters/Semester%20VII/SMD/Assignment_02/src/screens/HomeScreen.js)
- **Position:** `headerRight`
- **Meaningful Action:** Generates a random number (1–151) and navigates to `PokemonDetails`.

```javascript
// src/screens/HomeScreen.js
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
```

### Header Button 2: Bookmark Toggle Action
- **File:** [src/screens/DetailsScreen.js](file:///d:/Semesters/Semester%20VII/SMD/Assignment_02/src/screens/DetailsScreen.js)
- **Position:** `headerRight`
- **Meaningful Action:** Toggles the Pokémon's saved state in `CollectionContext` and dynamically updates the bookmark icon color (`#FFD38B` when saved, `#FFFFFF` when unsaved).

```javascript
// src/screens/DetailsScreen.js
useLayoutEffect(() => {
  navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity
        style={styles.headerBookmarkBtn}
        onPress={() => toggleBookmark(pokemon)}
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
}, [navigation, bookmarked, pokemon]);
```

---

## 6. Requirement 5: Navigator Combination (Stack + Bottom Tabs)

### The Requirement:
> *"Your application should demonstrate a combination of (two or three navigators): Stack Navigator, Drawer Navigator, Tab Navigator"*

### Where is it implemented?
- Root Stack Navigator: [src/navigation/AppNavigator.js](file:///d:/Semesters/Semester%20VII/SMD/Assignment_02/src/navigation/AppNavigator.js)
- Nested Tab Navigator: [src/navigation/TabNavigator.js](file:///d:/Semesters/Semester%20VII/SMD/Assignment_02/src/navigation/TabNavigator.js)
- Root Provider Setup: [App.js](file:///d:/Semesters/Semester%20VII/SMD/Assignment_02/App.js)

### Code Explanation:

#### 1. In `TabNavigator.js` (Bottom Tab Navigator):
```javascript
const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={...}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Collection" component={CollectionScreen} />
      <Tab.Screen name="Compare" component={CompareScreen} />
    </Tab.Navigator>
  );
}
```

#### 2. In `AppNavigator.js` (Stack Navigator wrapping Tab Navigator):
```javascript
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="MainTabs">
      {/* Tab Navigator is nested as the main route */}
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />

      {/* Details Screen pushes over the tabs */}
      <Stack.Screen
        name="PokemonDetails"
        component={DetailsScreen}
      />
    </Stack.Navigator>
  );
}
```

#### 3. In `App.js`:
```jsx
export default function App() {
  return (
    <SafeAreaProvider>
      <CollectionProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <AppNavigator />
        </NavigationContainer>
      </CollectionProvider>
    </SafeAreaProvider>
  );
}
```

---

## 7. Screen-by-Screen Code Walkthrough

### `HomeScreen.js`
- **Purpose:** Fetches a modest first page of 30 Pokémon from PokéAPI and renders a 2-column grid.
- **Key Components:** `PokemonCard`, `FlatList`, `RefreshControl` (pull-to-refresh).
- **Navigation Role:** Navigates to `PokemonDetails` on item tap and via the header `Random` button.

### `SearchScreen.js`
- **Purpose:** Allows searching any Pokémon by name or ID (e.g., `pikachu` or `25`) across PokéAPI.
- **Key Features:**
  - Real-time search with clear button.
  - Quick-suggestion chips (Pikachu, Charizard, Bulbasaur, Mewtwo, Eevee, Gengar).
  - Renders results using reusable `PokemonRow`.
- **Navigation Role:** Tapping the search result navigates to `PokemonDetails` with route parameters.

### `CollectionScreen.js`
- **Purpose:** Displays Pokémon bookmarked by the user.
- **Key Features:**
  - Consumes `useCollection()` from `CollectionContext`.
  - Empty state with an "Explore Pokémon" button redirecting to `Home`.
  - Tap row to view details; bookmark toggle icon to remove directly from collection.

### `CompareScreen.js`
- **Purpose:** Split-screen side-by-side comparison of two Pokémon.
- **Key Features:**
  - Screen divided into two clear columns with a center `VS` badge.
  - Independent search inputs for Pokémon 1 and Pokémon 2.
  - Horizontal scroll of quick-pick starter Pokémon.
  - Displays sprites, types, height, weight, and comparative `StatBar` progress bars for HP, Attack, Defense, Sp. Atk, Sp. Def, and Speed.

### `DetailsScreen.js`
- **Purpose:** Comprehensive view of the selected Pokémon.
- **Key Features:**
  - Reads `pokemonId` and `name` from `route.params`.
  - Shows top Route Parameter banner.
  - Fetches complete data from PokéAPI (`height`, `weight`, official artwork, types, base stats).
  - Dual bookmark controls: in the navigation header (`headerRight`) and on-screen button.

---

## 8. Data Fetching & State Management

### PokéAPI Integration ([src/api/pokeapi.js](file:///d:/Semesters/Semester%20VII/SMD/Assignment_02/src/api/pokeapi.js))
- Uses native `fetch` — no external API keys or heavy libraries required.
- `fetchPokemonList(limit, offset)`: Fetches paginated lists.
- `fetchPokemonDetails(idOrName)`: Fetches individual Pokémon stats, types, and official artwork sprites.

### Shared Bookmark State ([src/context/CollectionContext.js](file:///d:/Semesters/Semester%20VII/SMD/Assignment_02/src/context/CollectionContext.js))
- Implemented via React's built-in `createContext` and `useContext`.
- Provides:
  - `collection`: Array of saved Pokémon objects.
  - `isBookmarked(id)`: Checks bookmark status.
  - `toggleBookmark(pokemon)`: Adds or removes Pokémon from collection.
- Keeps `DetailsScreen`, `HomeScreen` card badges, and `CollectionScreen` perfectly in sync.

### Theme & Styling ([src/constants/theme.js](file:///d:/Semesters/Semester%20VII/SMD/Assignment_02/src/constants/theme.js))
Strictly uses the assignment's specified palette:
- **Primary:** `#522D60`
- **Secondary:** `#80426E`
- **Warm Accent:** `#F2A67B`
- **Highlight:** `#FFD38B`

---

## 9. Viva Q&A Quick Reference

| Question | Short Answer to Give | File Reference |
|---|---|---|
| **"Which navigators did you combine?"** | "We combined a Stack Navigator (`AppNavigator`) and a Bottom Tab Navigator (`TabNavigator`). The Tab Navigator is nested as the first screen of the Stack." | [AppNavigator.js](file:///d:/Semesters/Semester%20VII/SMD/Assignment_02/src/navigation/AppNavigator.js) |
| **"How do you pass route parameters?"** | "Using `navigation.navigate('PokemonDetails', { pokemonId: item.id, name: item.name })`. We pass `pokemonId` and `name`." | [HomeScreen.js](file:///d:/Semesters/Semester%20VII/SMD/Assignment_02/src/screens/HomeScreen.js#L54-L60) |
| **"Where do you read and display route parameters?"** | "In `DetailsScreen`, we read `const { pokemonId } = route.params;`, display it in the top parameter banner, and fetch details using that ID." | [DetailsScreen.js](file:///d:/Semesters/Semester%20VII/SMD/Assignment_02/src/screens/DetailsScreen.js#L17-L20) |
| **"Where is your header button?"** | "1. Home screen header has a **Random 🎲** button in `headerRight` that opens a random Pokémon.<br>2. Details screen header has a **Bookmark** toggle button in `headerRight`." | [HomeScreen.js](file:///d:/Semesters/Semester%20VII/SMD/Assignment_02/src/screens/HomeScreen.js#L30-L45), [DetailsScreen.js](file:///d:/Semesters/Semester%20VII/SMD/Assignment_02/src/screens/DetailsScreen.js#L30-L55) |
| **"How are bookmarks shared across screens?"** | "Through `CollectionContext` using standard React Context (`createContext`, `useState`), wrapping the whole app in `App.js`." | [CollectionContext.js](file:///d:/Semesters/Semester%20VII/SMD/Assignment_02/src/context/CollectionContext.js) |
| **"How does Compare screen work?"** | "It has local state for `pokemon1` and `pokemon2`, loads both from PokéAPI, and renders them in a two-column split layout with stat comparisons." | [CompareScreen.js](file:///d:/Semesters/Semester%20VII/SMD/Assignment_02/src/screens/CompareScreen.js) |
