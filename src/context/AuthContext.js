import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getAuth,
  onIdTokenChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from '@react-native-firebase/auth';
import { trackEvent, setAnalyticsUser } from '../services/analytics';

const AuthContext = createContext(null);

const ERRORS = {
  'auth/invalid-email': 'E-mail inválido.',
  'auth/invalid-credential': 'E-mail ou senha incorretos.',
  'auth/user-not-found': 'E-mail ou senha incorretos.',
  'auth/wrong-password': 'E-mail ou senha incorretos.',
  'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
  'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
  'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
  'auth/network-request-failed': 'Sem conexão com a internet.',
};

export function authErrorMessage(e) {
  return ERRORS[e?.code] || 'Algo deu errado. Tente novamente.';
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // JWT (ID token do Firebase)
  const [initializing, setInitializing] = useState(true);

  // O Firebase Auth já persiste a sessão no dispositivo:
  // ao reabrir o app, o usuário continua logado e o JWT é renovado automaticamente.
  useEffect(() => {
    const unsub = onIdTokenChanged(getAuth(), async (u) => {
      setUser(u);
      setToken(u ? await u.getIdToken() : null);
      setAnalyticsUser(u ? u.uid : null);
      setInitializing(false);
    });
    return unsub;
  }, []);

  const signIn = async (email, password) => {
    await signInWithEmailAndPassword(getAuth(), email.trim(), password);
    trackEvent('login', { method: 'password' });
  };

  const signUp = async (email, password) => {
    await createUserWithEmailAndPassword(getAuth(), email.trim(), password);
    trackEvent('sign_up', { method: 'password' });
  };

  const logout = async () => {
    trackEvent('logout');
    await signOut(getAuth());
  };

  return (
    <AuthContext.Provider value={{ user, token, initializing, signIn, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
