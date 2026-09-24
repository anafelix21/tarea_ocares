import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '../../components/common';
import colors from '../../constants/colors';

export default function ExploreTab() {
  const router = useRouter();

  const modules = [
    { id: 'usuarios', title: 'Usuarios', desc: 'Perfiles y roles', icon: 'people-outline', db: 'MongoDB' },
    { id: 'parcelas', title: 'Parcelas', desc: 'Terrenos y riego', icon: 'map-outline', db: 'MongoDB' },
    { id: 'insumos', title: 'Insumos Agrícolas', desc: 'Control de stock', icon: 'cube-outline', db: 'MongoDB' },
    { id: 'cultivos', title: 'Cultivos', desc: 'Ciclos de siembra', icon: 'flower-outline', db: 'SQL' },
    { id: 'fichas-campo', title: 'Fichas de Campo', desc: 'Monitoreo diario', icon: 'clipboard-outline', db: 'MongoDB' },
    { id: 'movimientos', title: 'Movimientos Insumos', desc: 'Kardex entradas/salidas', icon: 'swap-horizontal-outline', db: 'MongoDB' },
    { id: 'actividades', title: 'Labores Agrícolas', desc: 'Mantenimiento y costos', icon: 'hammer-outline', db: 'SQL' },
    { id: 'asignaciones', title: 'Mano de Obra', desc: 'Horas y jornadas', icon: 'people-circle-outline', db: 'SQL' },
    { id: 'cosechas', title: 'Cosechas', desc: 'Kilos óptimos y merma', icon: 'basket-outline', db: 'SQL' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <AppHeader title="Módulos del Sistema" subtitle="Navega por las funciones del proyecto ABP" />

      {modules.map((item) => (
        <TouchableOpacity key={item.id} style={styles.itemCard} onPress={() => router.push(`/(tabs)/${item.id}` as any)}>
          <View style={styles.iconBox}>
            <Ionicons name={item.icon as any} size={22} color={colors.primary} />
          </View>
          <View style={styles.info}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.desc}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: item.db === 'SQL' ? '#3b82f620' : '#10b98120' }]}>
            <Text style={[styles.badgeText, { color: item.db === 'SQL' ? '#60a5fa' : '#34d399' }]}>{item.db}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  itemCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: colors.cardBorder },
  iconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  desc: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontSize: 11, fontWeight: 'bold' },
});
