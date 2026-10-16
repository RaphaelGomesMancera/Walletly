import React, { useMemo, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, Pressable, Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useExpenses } from '../hooks/useExpenses';
import { useFeatureFlags } from '../hooks/useFeatureFlags';
import { formatCurrency, isoToBR, currentMonthPrefix } from '../utils/format';
import { colors, CATEGORIES } from '../theme';

export default function ExpensesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { expenses, loading, error, removeExpense } = useExpenses();
  const flags = useFeatureFlags(); // Remote Config (feature toggles)
  const [filter, setFilter] = useState(null);

  const monthTotal = useMemo(() => {
    const prefix = currentMonthPrefix();
    return expenses
      .filter((e) => String(e.date).startsWith(prefix))
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  }, [expenses]);

  const visible = useMemo(
    () => (filter ? expenses.filter((e) => e.category === filter) : expenses),
    [expenses, filter]
  );

  const confirmDelete = (item) => {
    Alert.alert('Excluir gasto', `Excluir "${item.category}" de ${formatCurrency(item.amount)}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () =>
          removeExpense(item.id).catch(() => Alert.alert('Erro', 'Não foi possível excluir.')),
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemCategory}>{item.category}</Text>
        <Text style={styles.itemMeta}>
          {isoToBR(item.date)}
          {item.description ? ` · ${item.description}` : ''}
        </Text>
        <View style={styles.actions}>
          <Pressable onPress={() => navigation.navigate('ExpenseForm', { expense: item })}>
            <Text style={styles.edit}>Editar</Text>
          </Pressable>
          <Pressable onPress={() => confirmDelete(item)}>
            <Text style={styles.delete}>Excluir</Text>
          </Pressable>
        </View>
      </View>
      <Text style={styles.itemAmount}>{formatCurrency(item.amount)}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Meus gastos</Text>
          <Text style={styles.email} numberOfLines={1}>{user?.email}</Text>
        </View>
        <Pressable onPress={logout}>
          <Text style={styles.logout}>Sair</Text>
        </Pressable>
      </View>

      {flags.show_monthly_summary && (
        <View style={styles.summary}>
          <Text style={styles.summaryLabel}>Total do mês</Text>
          <Text style={styles.summaryValue}>{formatCurrency(monthTotal)}</Text>
        </View>
      )}

      {flags.show_category_filter && (
        <View style={{ height: 44 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[null, ...CATEGORIES].map((c) => (
              <Pressable
                key={c || 'all'}
                onPress={() => setFilter(c)}
                style={[styles.chip, filter === c && styles.chipActive]}
              >
                <Text style={[styles.chipText, filter === c && { color: '#fff' }]}>
                  {c || 'Todos'}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
      ) : error ? (
        <Text style={styles.empty}>Erro ao carregar: {error}</Text>
      ) : (
        <FlatList
          data={visible}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <Text style={styles.empty}>Nenhum gasto por aqui. Toque em + para adicionar.</Text>
          }
        />
      )}

      <Pressable
        style={[styles.fab, { bottom: insets.bottom + 24 }]}
        onPress={() => navigation.navigate('ExpenseForm')}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 26, fontWeight: '800', color: colors.text },
  email: { color: colors.muted, fontSize: 13 },
  logout: { color: colors.danger, fontWeight: '700', fontSize: 15 },
  summary: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
  },
  summaryLabel: { color: '#DCFCE7', fontSize: 13, fontWeight: '600' },
  summaryValue: { color: '#fff', fontSize: 30, fontWeight: '800', marginTop: 2 },
  chip: {
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    justifyContent: 'center',
    marginRight: 8,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.text, fontWeight: '600' },
  item: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  itemCategory: { fontSize: 16, fontWeight: '700', color: colors.text },
  itemMeta: { color: colors.muted, marginTop: 2, fontSize: 13 },
  itemAmount: { fontSize: 16, fontWeight: '800', color: colors.text },
  actions: { flexDirection: 'row', gap: 18, marginTop: 8 },
  edit: { color: colors.primaryDark, fontWeight: '700' },
  delete: { color: colors.danger, fontWeight: '700' },
  empty: { textAlign: 'center', color: colors.muted, marginTop: 40 },
  fab: {
    position: 'absolute',
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  fabText: { color: '#fff', fontSize: 32, marginTop: -2 },
});
