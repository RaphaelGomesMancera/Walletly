import React, { useState } from 'react';
import {
  Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Pressable, Alert,
} from 'react-native';
import Field from '../components/Field';
import Button from '../components/Button';
import { useAuth, authErrorMessage } from '../context/AuthContext';
import { colors } from '../theme';

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (e) {
      Alert.alert('Erro ao entrar', authErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>Walletly</Text>
        <Text style={styles.subtitle}>Controle seus gastos de forma simples</Text>

        <Field
          label="E-mail"
          placeholder="voce@email.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Field
          label="Senha"
          placeholder="••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Button title="Entrar" onPress={handleLogin} loading={loading} style={{ marginTop: 6 }} />

        <Pressable onPress={() => navigation.navigate('Register')} style={{ marginTop: 20 }}>
          <Text style={styles.link}>
            Não tem conta? <Text style={{ fontWeight: '700' }}>Cadastre-se</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logo: { fontSize: 36, fontWeight: '800', color: colors.primary, textAlign: 'center' },
  subtitle: { textAlign: 'center', color: colors.muted, marginBottom: 32, marginTop: 4 },
  link: { textAlign: 'center', color: colors.primaryDark, fontSize: 15 },
});
