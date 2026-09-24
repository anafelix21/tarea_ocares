import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/use-auth';
import { AppHeader } from '../../components/common';
import colors from '../../constants/colors';

export default function HomeTab() {
  const { user } = useAuth();
  const router = useRouter();

  const stats = [
    { id: 'parcelas', title: 'Parcelas', value: '15', icon: 'map-outline', color: colors.primary, db: 'MongoDB' },
    { id: 'cultivos', title: 'Cultivos', value: '15', icon: 'flower-outline', color: colors.secondary, db: 'SQL' },
    { id: 'insumos', title: 'Insumos Stock', value: '15', icon: 'cube-outline', color: colors.warning, db: 'MongoDB' },
    { id: 'fichas-campo', title: 'Fichas Campo', value: '15', icon: 'clipboard-outline', color: colors.purple, db: 'MongoDB' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <AppHeader title={`¡Hola, ${user?.nombre || 'Usuario'}!`} subtitle={`Rol: ${user?.rol || 'OPERADOR'} • Persistencia Políglota`} />

      <Text style={styles.sectionTitle}>Resumen General</Text>
      <View style={styles.grid}>
        {stats.map((item) => (
          <TouchableOpacity key={item.id} style={styles.card} onPress={() => router.push(`/(tabs)/${item.id}` as any)}>
            <View style={[styles.iconBox, { backgroundColor: item.color + '20' }]}>
              <Ionicons name={item.icon as any} size={24} color={item.color} />
            </View>
            <View>
              <Text style={styles.cardVal}>{item.value}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.dbText}>{item.db}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: colors.textMuted, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '48%', backgroundColor: colors.card, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: colors.cardBorder, flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBox: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  cardVal: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  cardTitle: { fontSize: 12, color: colors.textMuted },
  dbText: { fontSize: 10, color: colors.primary, fontWeight: 'bold', marginTop: 2 },
});
