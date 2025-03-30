import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Alert,
  Platform,
  Image,
  ActivityIndicator
} from 'react-native';
import { 
  Feather, 
  MaterialCommunityIcons, 
  FontAwesome5 
} from '@expo/vector-icons';
import { router } from 'expo-router';
import { AuthUseCase } from '../../domain/usecases/auth.usecase';

// Logo import
const logoImage = require('../../../../../assets/images/logo.png');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const authUseCase = new AuthUseCase();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authUseCase.login({ email, password });
      if (response.success) {
        router.replace('/home');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const goToRegister = () => {
    router.push('/register');
  };

  const handleImageError = (error: any) => {
    console.error('Logo loading error:', error);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={logoImage}
          style={styles.logoImage}
          resizeMode="contain"
          onError={handleImageError}
        />
      </View>
      
      {/* Features Section */}
      <View style={styles.featuresContainer}>
        <View style={styles.featureItem}>
          <MaterialCommunityIcons name="arrow-u-left-top" size={20} color="#FF9AA2" />
          <Text style={styles.featureText}>Always Exchange</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.featureItem}>
          <MaterialCommunityIcons name="tag-outline" size={20} color="#FF9AA2" />
          <Text style={styles.featureText}>Shop At Store Prices</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.featureItem}>
          <FontAwesome5 name="truck" size={20} color="#FF9AA2" />
          <Text style={styles.featureText}>Consolidated Shipment</Text>
        </View>
      </View>
      
      {/* Login Form */}
      <View style={styles.formContainer}>
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Enter your email"
        />
        
        <Text style={[styles.inputLabel, {marginTop: 20}]}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            placeholder="Enter your password"
          />
          <TouchableOpacity 
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Feather name={showPassword ? "eye" : "eye-off"} size={24} color="#888" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>LOGIN</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.registerContainer}
          onPress={goToRegister}
        >
          <Text style={styles.registerText}>No account yet? Register here</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoImage: {
    width: 180,
    height: 60,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
    paddingHorizontal: 16,
  },
  featureItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  featureText: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 11,
    fontWeight: '500',
    color: '#666',
    lineHeight: 18,
  },
  divider: {
    width: 1,
    height: 10,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 8,
  },
  formContainer: {
    marginTop: 10,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fafafa',
    marginBottom: 16,
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fafafa',
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  loginButton: {
    backgroundColor: '#5D3F4F',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  registerContainer: {
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 8,
  },
  registerText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666',
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
}); 