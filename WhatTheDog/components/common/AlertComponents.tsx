import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { StyleSheet } from 'react-native';

interface ErrorAlertProps {
  message: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => {
  return (
    <ThemedView style={styles.errorAlert}>
      <ThemedText style={styles.errorText}>⚠️ {message}</ThemedText>
    </ThemedView>
  );
};

interface SuccessAlertProps {
  message: string;
}

export const SuccessAlert: React.FC<SuccessAlertProps> = ({ message }) => {
  return (
    <ThemedView style={styles.successAlert}>
      <ThemedText style={styles.successText}>✓ {message}</ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  errorAlert: {
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#ffe0e0',
    borderLeftWidth: 4,
    borderLeftColor: '#ff4444',
  },
  errorText: {
    color: '#cc0000',
    fontWeight: '500',
    fontSize: 14,
  },
  successAlert: {
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#e0ffe0',
    borderLeftWidth: 4,
    borderLeftColor: '#00cc00',
  },
  successText: {
    color: '#006600',
    fontWeight: '500',
    fontSize: 14,
  },
});
