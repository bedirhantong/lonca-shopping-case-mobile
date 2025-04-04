import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { AuthUseCase } from './features/auth/domain/usecases/auth.usecase';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'login',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const colorScheme = useColorScheme();
  const authUseCase = new AuthUseCase();

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        await authUseCase.getCurrentUser();
      } catch (error) {
        authUseCase.logout();
      }
    };
    checkAuth();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right'
        }}>
          <Stack.Screen 
            name="index"
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="login"
            options={{ 
              headerShown: false,
              animation: 'none'
            }}
          />
          <Stack.Screen 
            name="register"
            options={{ 
              headerShown: false,
              animation: 'slide_from_right'
            }}
          />
          <Stack.Screen 
            name="(tabs)"
            options={{ 
              headerShown: false,
              animation: 'fade',
              gestureEnabled: false,
              headerBackVisible: false
            }}
          />
        </Stack>
      </ThemeProvider>
    </Provider>
  );
}
