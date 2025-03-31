import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface SettingsSectionProps {
  onLogout: () => void;
}

interface SettingsItem {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
  subtitle: string;
  action: () => void;
  danger?: boolean;
}

export default function SettingsSection({ onLogout }: SettingsSectionProps) {
  const settingsItems: SettingsItem[] = [
    {
      icon: 'account-edit',
      title: 'Edit Profile',
      subtitle: 'Change your personal information',
      action: () => console.log('Edit Profile'),
    },
    {
      icon: 'bell-outline',
      title: 'Notifications',
      subtitle: 'Manage your notifications',
      action: () => console.log('Notifications'),
    },
    {
      icon: 'shield-lock-outline',
      title: 'Privacy & Security',
      subtitle: 'Control your privacy settings',
      action: () => console.log('Privacy'),
    },
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      subtitle: 'Get help or contact us',
      action: () => console.log('Help'),
    },
    {
      icon: 'logout',
      title: 'Logout',
      subtitle: 'Sign out of your account',
      action: onLogout,
      danger: true,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Settings</Text>
      {settingsItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.settingItem}
          onPress={item.action}
        >
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={item.icon}
              size={24}
              color={item.danger ? '#FF4B55' : '#5D3F4F'}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.title, item.danger && styles.dangerText]}>
              {item.title}
            </Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="#999"
            style={styles.chevron}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  chevron: {
    marginLeft: 8,
  },
  dangerText: {
    color: '#FF4B55',
  },
}); 