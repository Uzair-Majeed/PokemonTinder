import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import DetailsScreen from '../screens/DetailsScreen';
import { COLORS } from '../constants/theme';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
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
      {/* 1. Main Tabs (Bottom Tab Navigator nested inside Stack) */}
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{
          headerShown: false,
        }}
      />

      {/* 2. Pokémon Details (Stack screen receiving route parameters) */}
      <Stack.Screen
        name="PokemonDetails"
        component={DetailsScreen}
        options={({ route }) => ({
          title: route.params?.name
            ? route.params.name.charAt(0).toUpperCase() + route.params.name.slice(1)
            : 'Pokémon Details',
        })}
      />
    </Stack.Navigator>
  );
}
