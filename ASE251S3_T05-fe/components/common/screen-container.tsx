import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import colors from '../../constants/colors';

export const ScreenContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
});
