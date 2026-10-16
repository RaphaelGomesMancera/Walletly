import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function Button({ title, onPress, loading, variant = 'primary', style }) {
  const outline = variant === 'outline';
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [
        styles.btn,
        outline ? styles.outline : styles.primary,
        pressed && { opacity: 0.8 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={outline ? colors.primary : '#fff'} />
      ) : (
        <Text style={[styles.text, outline && { color: colors.primary }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  primary: { backgroundColor: colors.primary },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
  text: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
