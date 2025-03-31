import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface SearchEmptyStateProps {
  onClear: () => void;
}

export default function SearchEmptyState({ onClear }: SearchEmptyStateProps) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="file-search-outline" size={64} color="#ccc" />
      <Text style={styles.title}>No Results Found</Text>
      <Text style={styles.subtitle}>
        We couldn't find any products matching your search. Try different keywords or browse our categories.
      </Text>
      <TouchableOpacity style={styles.button} onPress={onClear}>
        <Text style={styles.buttonText}>Clear Search</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#5D3F4F',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
}); 