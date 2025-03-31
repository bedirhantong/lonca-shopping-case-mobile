import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { Image, View, StyleSheet, Platform } from 'react-native';

const logoImage = require('../../assets/images/logo.png');

function HeaderLogo() {
  return (
    <View style={styles.headerContainer}>
      <Image
        source={logoImage}
        style={styles.headerLogo}
        resizeMode="contain"
      />
    </View>
  );
}

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#5D3F4F',
        tabBarInactiveTintColor: '#999',
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          left: 20,
          right: 20,
          elevation: 0,
          borderRadius: 25,
          height: 65,
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.9)' : 'white',
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 12,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarItemStyle: {
          paddingTop: 5,
        },
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#f0f0f0',
        },
        header: () => <HeaderLogo />,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabIconContainer, focused && styles.tabIconContainerActive]}>
              <MaterialCommunityIcons 
                name={focused ? "home" : "home-outline"} 
                size={24} 
                color={color} 
              />
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabIconContainer, focused && styles.tabIconContainerActive]}>
              <MaterialCommunityIcons 
                name={focused ? "heart" : "heart-outline"} 
                size={24} 
                color={color} 
              />
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabIconContainer, focused && styles.tabIconContainerActive]}>
              <Feather 
                name={focused ? "user" : "user"} 
                size={24} 
                color={color} 
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingHorizontal: 16,
  },
  headerLogo: {
    width: 120,
    height: 40,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 32,
    borderRadius: 16,
  },
  tabIconContainerActive: {
    backgroundColor: 'rgba(93, 63, 79, 0.1)',
  },
});
