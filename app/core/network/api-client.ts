import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Production URL (Render.com)
const PROD_URL = 'https://lonca-app-server.onrender.com/api';

// Development URL
const DEV_URL = Platform.select({
  ios: 'http://localhost:3000/api',
  android: 'http://10.0.2.2:3000/api', // Android emulator localhost
  default: 'http://localhost:3000/api',
});

// İstediğiniz URL'i seçin (development veya production)
const BASE_URL = DEV_URL;

console.log('\n🌍 API Environment:', {
  isDev: __DEV__,
  platform: Platform.OS,
  baseUrl: BASE_URL
});

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor with detailed logging
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor with detailed logging
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error.response?.data || error);
  }
);

export default apiClient; 