import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import colors from '../../constants/colors';

interface AppInputProps extends TextInputProps {
  label?: string;
}

export const AppInput: React.FC<AppInputProps> = ({ label, ...props }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={styles.input}
        placeholderTextColor={colors.textMuted}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 10,
    height: 46,
    paddingHorizontal: 12,
    color: colors.text,
    fontSize: 14,
  },
});
