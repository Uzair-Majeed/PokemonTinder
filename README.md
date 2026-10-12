# Pokémon Explorer — Assignment 2

A React Native mobile application built with Expo demonstrating React Navigation concepts, PokéAPI integration, split-screen comparison, and shared collection state.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npx expo start
```

Press:
- `a` to open on Android Emulator / Device
- `i` to open on iOS Simulator
- `w` to open in Web Browser
- Or scan the QR code with **Expo Go** on your physical mobile phone

---

## 📱 Navigation Architecture

The app uses **Two Navigator Types**: a **Bottom Tab Navigator** nested inside a **Native Stack Navigator**.

```
Stack Navigator (AppNavigator)
├── MainTabs (Bottom Tab Navigator)
│   ├── Home ("Pokémon Explorer")
│   ├── Search ("Search")
│   ├── Collection ("My Collection")
│   └── Compare ("Compare Pokémon")
└── PokemonDetails (Stack Screen with dynamic title & bookmark toggle)
```

### Navigation Configuration Files:
- [src/navigation/AppNavigator.js](file:///d:/Semesters/Semester%20VII/SMD/Assignment_02/src/navigation/AppNavigator.js): Configures the outer Stack Navigator (`MainTabs` and `PokemonDetails`).
- [src/navigation/TabNavigator.js](file:///d:/Semesters/Semester%20VII/SMD/Assignment_02/src/navigation/TabNavigator.js): Configures the Bottom Tabs (`Home`, `Search`, `Collection`, `Compare`).

---

## 🎨 Color Palette

Adheres strictly to the assignment specification:

| Role | Color Hex | Color RGB | Usage |
|---|---|---|---|
| **Primary** | `#522D60` | `rgb(82, 45, 96)` | Navigation bars, main headers, primary buttons |
| **Secondary** | `#80426E` | `rgb(128, 66, 110)` | Supporting UI, badges, secondary actions |
| **Warm Accent** | `#F2A67B` | `rgb(242, 166, 123)` | Stat bars, VS badge, highlights |
| **Highlight** | `#FFD38B` | `rgb(255, 211, 139)` | Star/bookmark icons, active indicators |

Tokens defined in: [src/constants/theme.js](file:///d:/Semesters/Semester%20VII/SMD/Assignment_02/src/constants/theme.js)

---

## 📋 Viva Demonstration Checklist

| # | Checklist Item | How it is Demonstrated | File Reference |
|---|---|---|---|
| **1** | **Header button with meaningful action** | Tap the **"Random 🎲"** button in the Home screen header. It immediately generates a random Pokémon ID (1–151) and navigates directly to its Details screen. | [src/screens/HomeScreen.js](file:///d:/Semesters/Semester%20VII/SMD/Assignment_02/src/screens/HomeScreen.js) |
| **2** | **Route parameters & displaying them** | Tap any Pokémon from Search (or Home). The Details screen reads `route.params.pokemonId` and `route.params.name`, shows the received parameters in the top banner, and fetches its data from PokéAPI. | [src/screens/DetailsScreen.js](file:///d:/Semesters/Semester%20VII/SMD/Assignment_02/src/screens/DetailsScreen.js) |
| **3** | **Bookmark synchronization** | Bookmark a Pokémon via the header star/bookmark button or screen button. Switch to the **Collection** tab to see it synced instantly via `CollectionContext`. | [src/screens/CollectionScreen.js](file:///d:/Semesters/Semester%20VII/SMD/Assignment_02/src/screens/CollectionScreen.js), [src/context/CollectionContext.js](file:///d:/Semesters/Semester%20VII/SMD/Assignment_02/src/context/CollectionContext.js) |
| **4** | **Split-screen Compare** | Open the **Compare** tab to view side-by-side split screen comparison showing sprite, types, height, weight, and base stats for two Pokémon. Users can type any Pokémon name/ID or tap quick starters. | [src/screens/CompareScreen.js](file:///d:/Semesters/Semester%20VII/SMD/Assignment_02/src/screens/CompareScreen.js) |
| **5** | **Customized headers & navigator structure** | Explain that Stack Navigator wraps the Bottom Tabs; headers have custom titles ("Pokémon Explorer", "Search", "My Collection", "Compare Pokémon", and selected Pokémon's name on Details). | [src/navigation/AppNavigator.js](file:///d:/Semesters/Semester%20VII/SMD/Assignment_02/src/navigation/AppNavigator.js), [src/navigation/TabNavigator.js](file:///d:/Semesters/Semester%20VII/SMD/Assignment_02/src/navigation/TabNavigator.js) |

---

## 📂 Project Directory Structure

```
├── App.js                      # Root component with Providers and Navigation
├── app.json                    # Expo project configuration
├── package.json                # Project dependencies and scripts
├── src/
│   ├── api/
│   │   └── pokeapi.js          # PokéAPI fetch functions and helpers
│   ├── constants/
│   │   └── theme.js            # Color palette tokens and Pokémon type colors
│   ├── context/
│   │   └── CollectionContext.js# Shared bookmark state using React Context
│   ├── components/
│   │   ├── PokemonCard.js      # Reusable card component for grid display
│   │   ├── PokemonRow.js       # Reusable row item for lists/search
│   │   ├── StatBar.js          # Reusable stat progress bar
│   │   ├── LoadingView.js      # Loading indicator with message
│   │   └── ErrorView.js        # Error message with retry action
│   ├── navigation/
│   │   ├── AppNavigator.js     # Native Stack Navigator (MainTabs + Details)
│   │   └── TabNavigator.js     # Bottom Tab Navigator (Home, Search, Collection, Compare)
│   └── screens/
│       ├── HomeScreen.js       # Explorer grid with Random header button
│       ├── SearchScreen.js     # Search by name or ID with quick suggestions
│       ├── CollectionScreen.js # Saved bookmarks list
│       ├── CompareScreen.js    # Side-by-side split comparison screen
│       └── DetailsScreen.js    # Full Pokémon details with route params & bookmark action
```
