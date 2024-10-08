import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { useFonts } from 'expo-font';
import { Link, Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import 'react-native-reanimated';
import * as SecureStore from 'expo-secure-store';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import { UserInactivityProvider } from '@/context/UserInactivity';

const queryClient = new QueryClient()

const tokenChace = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return
    }
  }
}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });


  const router = useRouter()
  const { isLoaded, isSignedIn } = useAuth()
  const segments = useSegments();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === 'auth';

    if (isSignedIn && !inAuthGroup) {
      // router.replace('/auth/(tabs)/crypto');
      router.replace("/auth/modals/lock");
    } else if (!isSignedIn) {
      router.replace('/login');
    }
  }, [isSignedIn]);

  if (!loaded || !isLoaded) {
    return <Text>Loading...</Text>
  }

  return <Stack>

    <Stack.Screen name="index" options={{ headerShown: false }} />
    <Stack.Screen
      name="signup"
      options={{
        title: '',
        headerBackTitle: '',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: Colors.background },
        headerLeft: () => (
          <TouchableOpacity onPress={router.back}>
            <Ionicons name="arrow-back" size={34} color={Colors.dark} />
          </TouchableOpacity>
        ),

      }}
    />
    <Stack.Screen
      name="login"
      options={{
        title: '',
        headerBackTitle: '',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: Colors.background },
        headerLeft: () => (
          <TouchableOpacity onPress={router.back}>
            <Ionicons name="arrow-back" size={34} color={Colors.dark} />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <Link href={'/help'} asChild >
            <TouchableOpacity >
              <Ionicons name="help-circle-outline" size={34} color={Colors.dark} />
            </TouchableOpacity>
          </Link>
        ),

      }}
    />

    <Stack.Screen name="help" options={{ title: 'Help', presentation: 'modal' }} />
    <Stack.Screen
      name="verify/[phone]"
      options={{
        title: '',
        headerBackTitle: '',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: Colors.background },
        headerLeft: () => (
          <TouchableOpacity onPress={router.back}>
            <Ionicons name="arrow-back" size={34} color={Colors.dark} />
          </TouchableOpacity>
        ),

      }}
    />
    <Stack.Screen name="auth/(tabs)" options={{ headerShown: false }} />
    <Stack.Screen
      name="auth/crypto/[id]"
      options={{
        title: '',
        headerLeft: () => (
          <TouchableOpacity onPress={router.back}>
            <Ionicons name="arrow-back" size={35} color={Colors.dark} />
          </TouchableOpacity>
        ),
        headerLargeTitle: true,
        headerTransparent: true,
        headerRight: () => (
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity>
              <Ionicons name="notifications-outline" color={Colors.dark} size={30} />
            </TouchableOpacity>
            <TouchableOpacity >
              <Ionicons name="star-outline" color={Colors.dark} size={30} />
            </TouchableOpacity>
          </View>
        )


      }}
    />
    <Stack.Screen name="auth/(modals)/lock" options={{ headerShown: false, animation: 'none' }} />
  </Stack>


}

const RootLayoutNav = () => {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY!} tokenCache={tokenChace}>
      <QueryClientProvider client={queryClient}>
        <UserInactivityProvider>
          <GestureHandlerRootView>
            <StatusBar style="light" />
            <InitialLayout />
          </GestureHandlerRootView>
        </UserInactivityProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default RootLayoutNav