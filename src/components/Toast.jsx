import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function Toast() {
  const { toast, theme } = useApp();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';
  const iconColor = isSuccess ? theme.emerald : isError ? theme.rose : theme.primary;

  return (
    <View style={styles.toastContainer}>
      <View style={[styles.toastCard, { backgroundColor: theme.bgElevated, borderColor: iconColor }]}>
        {isSuccess ? (
          <CheckCircle2 size={18} color={iconColor} />
        ) : isError ? (
          <AlertCircle size={18} color={iconColor} />
        ) : (
          <Info size={18} color={iconColor} />
        )}
        <Text style={[styles.toastText, { color: theme.text }]}>{toast.message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'fixed',
    top: 24,
    right: 24,
    zIndex: 10000,
    maxWidth: 420,
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
  },
  toastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    backdropFilter: 'blur(12px)',
  },
  toastText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  }
});
