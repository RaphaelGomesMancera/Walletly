import { useEffect, useState, useCallback } from 'react';
import {
  getFirestore,
  collection,
  doc,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { trackEvent } from '../services/analytics';

// Estrutura no Firestore: users/{uid}/expenses/{expenseId}
// Campos: amount (number), category, date ("AAAA-MM-DD"), description, createdAt
export function useExpenses() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const uid = user?.uid;

  useEffect(() => {
    if (!uid) {
      setExpenses([]);
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    const db = getFirestore();
    const q = query(collection(db, 'users', uid, 'expenses'), orderBy('date', 'desc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setExpenses(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setError(null);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return unsub;
  }, [uid]);

  const addExpense = useCallback(
    async ({ amount, category, date, description }) => {
      const db = getFirestore();
      await addDoc(collection(db, 'users', uid, 'expenses'), {
        amount,
        category,
        date,
        description: description || '',
        createdAt: serverTimestamp(),
      });
      trackEvent('expense_created', { category, value: amount, currency: 'BRL' });
    },
    [uid]
  );

  const updateExpense = useCallback(
    async (id, { amount, category, date, description }) => {
      const db = getFirestore();
      await updateDoc(doc(db, 'users', uid, 'expenses', id), {
        amount,
        category,
        date,
        description: description || '',
      });
      trackEvent('expense_updated', { category });
    },
    [uid]
  );

  const removeExpense = useCallback(
    async (id) => {
      const db = getFirestore();
      await deleteDoc(doc(db, 'users', uid, 'expenses', id));
      trackEvent('expense_deleted');
    },
    [uid]
  );

  return { expenses, loading, error, addExpense, updateExpense, removeExpense };
}
