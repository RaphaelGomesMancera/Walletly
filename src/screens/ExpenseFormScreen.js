import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import Field from '../components/Field';
import Button from '../components/Button';
import { useExpenses } from '../hooks/useExpenses';
import { parseAmount, brToISO, isoToBR, maskDate, todayBR } from '../utils/format';
import { colors, CATEGORIES } from '../theme';

export default function ExpenseFormScreen({ route, navigation }) {
  const editing = route.params?.expense;
  const { addExpense, updateExpense } = useExpenses();

  const [amount, setAmount] = useState(editing ? String(editing.amount).replace('.', ',') : '');
  const [category, setCategory] = useState(editing?.category || CATEGORIES[0]);
  const [date, setDate] = useState(editing ? isoToBR(editing.date) : todayBR());
  const [description, setDescription] = useState(editing?.description || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const value = parseAmount(amount);
    if (!Number.isFinite(value) || value <= 0) {
      Alert.alert('Atenção', 'Informe um valor válido (ex: 25,90).');
      return;
    }
    const iso = brToISO(date);
    if (!iso) {
      Alert.alert('Atenção', 'Data inválida. Use o formato DD/MM/AAAA.');
      return;
    }
    setSaving(true);
    try {
      const data = { amount: value, category, date: iso, description: description.trim() };
      if (editing) await updateExpense(editing.id, data);
      else await addExpense(data);
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar o gasto.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
        <Field
          label="Valor (R$)"
          placeholder="0,00"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />

        <Text style={styles.label}>Categoria</Text>
        <View style={styles.chips}>
          {CATEGORIES.map((c) => (
            <Pressable
              key={c}
              onPress={() => setCategory(c)}
              style={[styles.chip, category === c && styles.chipActive]}
            >
              <Text style={[styles.chipText, category === c && { color: '#fff' }]}>{c}</Text>
            </Pressable>
          ))}
        </View>

        <Field
          label="Data"
          placeholder="DD/MM/AAAA"
          keyboardType="number-pad"
          value={date}
          onChangeText={(t) => setDate(maskDate(t))}
        />
        <Field
          label="Descrição (opcional)"
          placeholder="Ex: almoço com amigos"
          autoCapitalize="sentences"
          value={description}
          onChangeText={setDescription}
        />

        <Button
          title={editing ? 'Salvar alterações' : 'Salvar gasto'}
          onPress={handleSave}
          loading={saving}
          style={{ marginTop: 8 }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '600', color: colors.muted, marginBottom: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: {
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    justifyContent: 'center',
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.text, fontWeight: '600' },
});
