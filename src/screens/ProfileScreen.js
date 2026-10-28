import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useCollection } from '../context/CollectionContext';
import { COLORS } from '../constants/theme';

export default function ProfileScreen({ navigation }) {
  const { user, isGuest, logout } = useAuth();
  const { collection } = useCollection();

  const confirmLogout = async () => {
    try {
      await logout();
    } catch (error) {
      const message = error?.message || 'Could not sign out. Please try again.';
      if (Platform.OS === 'web') {
        window.alert(message);
      } else {
        Alert.alert('Sign Out Failed', message);
      }
    }
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to sign out of PokéTinder?')) {
        void confirmLogout();
      }
      return;
    }

    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of PokéTinder?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => void confirmLogout(),
        },
      ]
    );
  };

  const handleGuestLogin = async () => {
    await logout(); // Resets guest mode and brings up login
  };

  const trainerName = user?.displayName || (isGuest ? 'Guest Trainer' : 'Pokémon Trainer');
  const trainerEmail = user?.email || (isGuest ? 'Not signed in' : 'No email');
  const initial = trainerName ? trainerName.charAt(0).toUpperCase() : 'T';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Trainer Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <Text style={styles.trainerName}>{trainerName}</Text>
        <Text style={styles.trainerEmail}>{trainerEmail}</Text>

        <View style={[styles.badge, isGuest ? styles.guestBadge : styles.authBadge]}>
          <Ionicons
            name={isGuest ? 'person-outline' : 'shield-checkmark'}
            size={14}
            color={isGuest ? '#92400E' : '#15803D'}
            style={{ marginRight: 4 }}
          />
          <Text style={[styles.badgeText, isGuest ? styles.guestBadgeText : styles.authBadgeText]}>
            {isGuest ? 'Guest Mode' : 'Firebase Verified'}
          </Text>
        </View>
      </View>

      {/* Trainer Stats */}
      <View style={styles.statsCard}>
        <Text style={styles.sectionTitle}>Trainer Stats</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Ionicons name="bookmark" size={24} color={COLORS.primary} />
            <Text style={styles.statValue}>{collection.length}</Text>
            <Text style={styles.statLabel}>Saved Pokémon</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Ionicons name="flash" size={24} color={COLORS.warmAccent} />
            <Text style={styles.statValue}>Gen 1</Text>
            <Text style={styles.statLabel}>Pokedex Region</Text>
          </View>
        </View>
      </View>

      {/* Account Info / Firebase status */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Account Details</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>User ID</Text>
          <Text style={styles.infoValue} numberOfLines={1}>
            {user?.uid ? `${user.uid.slice(0, 12)}...` : 'None (Guest)'}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Authentication</Text>
          <Text style={styles.infoValue}>
            {user ? 'Firebase Auth' : 'Local Session'}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionContainer}>
        {user ? (
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleGuestLogin}
            activeOpacity={0.8}
          >
            <Ionicons name="log-in-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.loginButtonText}>Sign In with Firebase</Text>
          </TouchableOpacity>
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
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    alignItems: 'center',
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarText: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  trainerName: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
  },
  trainerEmail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 12,
  },
  authBadge: {
    backgroundColor: '#DCFCE7',
  },
  guestBadge: {
    backgroundColor: '#FEF3C7',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  authBadgeText: {
    color: '#15803D',
  },
  guestBadgeText: {
    color: '#92400E',
  },
  statsCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
  },
  infoCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F0F6',
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    maxWidth: '60%',
  },
  actionContainer: {
    marginTop: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.error,
    borderRadius: 12,
    height: 48,
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 48,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
