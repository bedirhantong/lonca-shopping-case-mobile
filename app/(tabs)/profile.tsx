import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { ProfileUseCase } from '../features/profile/domain/usecases/profile.usecase';
import { Profile } from '../features/profile/domain/models/profile.model';
import ProfileHeader from '../features/profile/presentation/components/ProfileHeader';
import SettingsSection from '../features/profile/presentation/components/SettingsSection';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const profileUseCase = new ProfileUseCase();

  const loadProfile = async () => {
    try {
      const response = await profileUseCase.getProfile();
      if (response.success) {
        setProfile(response.data);
      } else {
        Alert.alert('Error', response?.message || 'Failed to load profile');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = () => {
    // Navigate to edit profile screen
    console.log('Navigate to edit profile');
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await profileUseCase.logout();
            router.replace('/login');
          },
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5D3F4F" />
      </View>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ProfileHeader profile={profile} onEditPress={handleEditProfile} />
      <SettingsSection onLogout={handleLogout} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
}); 