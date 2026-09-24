import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import colors from '../../constants/colors';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
}

export const AppButton: React.FC<AppButtonProps> = ({ title, onPress, variant = 'primary', loading = false }) => {
  const getBgColor = () => {
    switch (variant) {
      case 'secondary': return colors.secondary;
      case 'danger': return colors.danger;
      default: return colors.primary;
    }
  };

  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: getBgColor() }]} onPress={onPress} disabled={loading}>
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>{title}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  text: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
