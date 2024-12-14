import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaView edges={['right', 'left', 'top']} style={styles.container}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 8,
    backgroundColor: '#FFF',
  },
});
