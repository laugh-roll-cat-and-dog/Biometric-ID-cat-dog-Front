import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface SearchModeToggleProps {
  searchType: 'text' | 'image';
  colorScheme: 'light' | 'dark' | null;
  onTextPress: () => void;
  onImagePress: () => void;
}

export const SearchModeToggle: React.FC<SearchModeToggleProps> = ({
  searchType,
  colorScheme,
  onTextPress,
  onImagePress,
}) => {
  return (
    <ThemedView style={styles.toggleContainer}>
      <TouchableOpacity
        style={[
          styles.toggleButton,
          searchType === 'text' && styles.toggleButtonActive,
          {
            backgroundColor:
              searchType === 'text' ? Colors[colorScheme ?? 'light'].tint : 'rgba(0,0,0,0.05)',
          },
        ]}
        onPress={onTextPress}>
        <ThemedText style={[styles.toggleText, searchType === 'text' && styles.toggleTextActive]}>
          🔤 Text
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.toggleButton,
          searchType === 'image' && styles.toggleButtonActive,
          {
            backgroundColor:
              searchType === 'image' ? Colors[colorScheme ?? 'light'].tint : 'rgba(0,0,0,0.05)',
          },
        ]}
        onPress={onImagePress}>
        <ThemedText style={[styles.toggleText, searchType === 'image' && styles.toggleTextActive]}>
          🖼️ Image
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  toggleButtonActive: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  toggleText: {
    fontWeight: '600',
    fontSize: 14,
  },
  toggleTextActive: {
    color: 'white',
  },
});
