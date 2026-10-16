import React, { useState } from 'react';
import {
  Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Pressable, Alert,
} from 'react-native';
import Field from '../components/Field';
import Button from '../components/Button';
import { useAuth, authErrorMessage } from '../context/AuthContext';
import { colors } from '../theme';

export default function RegisterScreen({ navigation }) {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Atenção', 'As senhas não coincidem.');
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password); // após criar, o usuário já fica logado
    } catch (e) {
      Alert.alert('Erro no cadastro', authErrorMessage(e));
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
        <Text style={styles.title}>Criar conta</Text>

        <Field
          label="E-mail"
          placeholder="voce@email.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Field
          label="Senha"
          placeholder="Mínimo 6 caracteres"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Field
          label="Confirmar senha"
          placeholder="Repita a senha"
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
        />

        <Button title="Cadastrar" onPress={handleRegister} loading={loading} style={{ marginTop: 6 }} />

        <Pressable onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
          <Text style={styles.link}>
            Já tem conta? <Text style={{ fontWeight: '700' }}>Entrar</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 24 },
  link: { textAlign: 'center', color: colors.primaryDark, fontSize: 15 },
});
