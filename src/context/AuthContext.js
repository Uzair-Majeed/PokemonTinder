import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../config/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Map Firebase auth error codes to clear, trainer-friendly messages
  const formatAuthError = (error) => {
    if (!error) return null;
    const code = error.code || '';
    switch (code) {
      case 'auth/invalid-email':
        return 'Please provide a valid email address.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/operation-not-allowed':
        return 'Email/Password sign-in is not enabled in your Firebase Console.';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again in a few moments.';
      case 'auth/invalid-api-key':
      case 'auth/app-deleted':
        return 'Invalid Firebase API Key. Please update src/config/firebase.js.';
      default:
        return error.message || 'An unexpected authentication error occurred.';
    }
  };

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      },
      (error) => {
        console.warn('Auth state subscription notice:', error?.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    if (!isFirebaseConfigured()) {
      const msg = 'Firebase credentials have not been added yet in src/config/firebase.js.';
      setAuthError(msg);
      throw new Error(msg);
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      setIsGuest(false);
      return userCredential.user;
    } catch (err) {
      const readableError = formatAuthError(err);
      setAuthError(readableError);
      throw new Error(readableError);
    }
  };

  const signup = async (email, password, displayName = '') => {
    setAuthError(null);
    if (!isFirebaseConfigured()) {
      const msg = 'Firebase credentials have not been added yet in src/config/firebase.js.';
      setAuthError(msg);
      throw new Error(msg);
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      if (displayName && displayName.trim()) {
        try {
          await updateProfile(userCredential.user, {
            displayName: displayName.trim(),
          });
        } catch (profileErr) {
          console.warn('Could not update display name:', profileErr);
        }
      }
      setIsGuest(false);
      return userCredential.user;
    } catch (err) {
      const readableError = formatAuthError(err);
      setAuthError(readableError);
      throw new Error(readableError);
    }
  };

  const logout = async () => {
    setAuthError(null);
    if (auth && auth.currentUser) {
      await signOut(auth);
    }
    setUser(null);
    setIsGuest(false);
  };

  const continueAsGuest = () => {
    setAuthError(null);
    setIsGuest(true);
  };

  const clearError = () => {
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isGuest,
        authError,
        isConfigured: isFirebaseConfigured(),
        login,
        signup,
        logout,
        continueAsGuest,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
