import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/use-auth';
import { AppButton, AppInput } from '../components/common';
import colors from '../constants/colors';

export default function LoginScreen() {
  const [correo, setCorreo] = useState('hugo.fernandez@agropacayales.com');
  const [password, setPassword] = useState('ClaveHugo123');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    const ok = await login(correo, password);
    setLoading(false);
    if (ok) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Error', 'Credenciales incorrectas');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.logoBox}>
          <Ionicons name="leaf-outline" size={48} color={colors.primary} />
          <Text style={styles.title}>AgroPacayales</Text>
          <Text style={styles.subtitle}>Gestión Agrícola Políglota Mobile</Text>
        </View>

        <AppInput label="Correo electrónico" value={correo} onChangeText={setCorreo} placeholder="ejemplo@agropacayales.com" />
        <AppInput label="Contraseña" value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" />

        <AppButton title="Iniciar Sesión" onPress={handleLogin} loading={loading} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { width: '100%', maxWidth: 400, backgroundColor: colors.card, borderRadius: 16, padding: 24, borderWidth: 1, borderColor: colors.cardBorder },
  logoBox: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginTop: 8 },
  subtitle: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
});
