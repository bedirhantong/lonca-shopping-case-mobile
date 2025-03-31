import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Profile } from '../../domain/models/profile.model';

interface ProfileHeaderProps {
  profile: Profile;
  onEditPress: () => void;
}

export default function ProfileHeader({ profile, onEditPress }: ProfileHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: profile.avatar_url || 'https://via.placeholder.com/150' }}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
          <MaterialCommunityIcons name="pencil" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={styles.name}>{profile.full_name}</Text>
      <Text style={styles.username}>@{profile.username}</Text>
      <Text style={styles.email}>{profile.email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#5D3F4F',
  },
  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#5D3F4F',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#999',
  },
}); 