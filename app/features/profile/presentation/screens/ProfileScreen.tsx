import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import { router } from 'expo-router';
import { ProfileUseCase } from '../../domain/usecases/profile.usecase';
import { Profile } from '../../domain/models/profile.model';
import ProfileHeader from '../components/ProfileHeader';
import { AuthUseCase } from '../../../auth/domain/usecases/auth.usecase';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const profileUseCase = new ProfileUseCase();
  const authUseCase = new AuthUseCase();

  const fetchProfile = async () => {
    try {
      const response = await profileUseCase.getProfile();
      if (response.success) {
        setProfile(response.data);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProfile();
    setRefreshing(false);
  };

  const handleEditProfile = () => {
    // Navigate to edit profile screen
    // router.push('/profile/edit');
    Alert.alert('Coming Soon', 'Edit profile feature will be available soon!');
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await authUseCase.logout();
            router.replace('/login');
          }
        }
      ]
    );
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5D3F4F" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={['#5D3F4F']}
        />
      }
    >
      {profile && (
        <ProfileHeader
          profile={profile}
          onEditPress={handleEditProfile}
        />
      )}
      
      {/* Add more sections here like:
          - Recent Reviews
          - Favorite Products
          - Settings
          - Logout Button
      */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
}); 