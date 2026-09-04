import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { LoginScreen } from './src/screens/LoginScreen';
import { SignupScreen } from './src/screens/SignupScreen';

type AuthScreen = 'login' | 'signup';

const RootNavigation: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');

  if (!isAuthenticated) {
    if (authScreen === 'signup') {
      return (
        <SignupScreen onNavigateToLogin={() => setAuthScreen('login')} />
      );
    }
    return (
      <LoginScreen onNavigateToSignup={() => setAuthScreen('signup')} />
    );
  }

  return <AppNavigator />;
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#FCF9F8" />
        <RootNavigation />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
