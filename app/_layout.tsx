import '~/utils/firebase';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { router, Slot, usePathname } from 'expo-router';
import * as React from 'react';
import { StyleSheet, View, ActivityIndicator, Pressable, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { AuthProvider, useAuth } from '~/context/AuthContext';

function NavigationBar() {
  const pathname = usePathname();

  return (
    <View style={styles.navBar}>
      <Button title="Word List" onPress={() => router.push('/')} isActive={pathname === '/'} />
      <Button
        title="History"
        onPress={() => router.push('/history')}
        isActive={pathname === '/history'}
      />
      <Button
        title="Favorites"
        onPress={() => router.push('/favorites')}
        isActive={pathname === '/favorites'}
      />
    </View>
  );
}

function AuthenticatedLayout() {
  const { logout } = useAuth();

  return (
    <Container>
      <Pressable onPress={logout} style={styles.exitButton}>
        <Text style={styles.exitButtonText}>Sair</Text>
        <MaterialIcons name="exit-to-app" size={40} color="#f16363" />
      </Pressable>

      <NavigationBar />
      <View style={styles.containerContent}>
        <Slot />
      </View>
    </Container>
  );
}

function LayoutContent() {
  const { user, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace('/sign-in');
        return;
      }

      router.replace('/');
    }
  }, [isLoading, user]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (user) {
    return <AuthenticatedLayout />;
  }

  return <Slot />;
}

export default function Layout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <LayoutContent />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  navBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    gap: 8,
  },
  containerContent: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    margin: 16,
    gap: 8,
  },
  exitButtonText: {
    fontSize: 24,
    color: '#f16363',
  },
});
