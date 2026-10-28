import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import DetailsScreen from '../screens/DetailsScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/theme';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, isGuest, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const isAuthenticated = Boolean(user || isGuest);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
        headerBackTitleVisible: false,
      }}
    >
      {isAuthenticated ? (
        <>
          {/* Main Tabs (Explorer, Search, Collection, Compare) */}
          <Stack.Screen
            name="MainTabs"
            component={TabNavigator}
            options={{
              headerShown: false,
            }}
          />

          {/* Pokémon Details */}
          <Stack.Screen
            name="PokemonDetails"
            component={DetailsScreen}
            options={({ route }) => ({
              title: route.params?.name
                ? route.params.name.charAt(0).toUpperCase() + route.params.name.slice(1)
                : 'Pokémon Details',
            })}
          />

          {/* Trainer Profile Screen */}
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              title: 'Trainer Profile',
            }}
          />
        </>
      ) : (
        <>
          {/* Auth Flow Screens */}
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{
              title: 'Create Account',
              headerShown: true,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
