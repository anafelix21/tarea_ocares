import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export const DashboardScreen: React.FC<{ onNavigate: (screen: string) => void }> = ({ onNavigate }) => {
  const { user } = useAuth();

  const stats = [
    { id: 'parcelas', title: 'Parcelas Registradas', value: '15', icon: 'map-outline', color: '#10b981', db: 'MongoDB' },
    { id: 'cultivos', title: 'Cultivos Activos', value: '15', icon: 'flower-outline', color: '#3b82f6', db: 'SQL R2DBC' },
    { id: 'insumos', title: 'Insumos en Stock', value: '15', icon: 'cube-outline', color: '#f59e0b', db: 'MongoDB' },
    { id: 'fichas-campo', title: 'Fichas de Campo', value: '15', icon: 'clipboard-outline', color: '#8b5cf6', db: 'MongoDB' },
    { id: 'actividades', title: 'Labores Agrícolas', value: '15', icon: 'hammer-outline', color: '#ec4899', db: 'SQL R2DBC' },
    { id: 'cosechas', title: 'Cosechas Registradas', value: '15', icon: 'basket-outline', color: '#06b6d4', db: 'SQL R2DBC' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>¡Hola, {user?.nombre || 'Usuario'}!</Text>
          <Text style={styles.roleText}>Rol: <Text style={styles.roleBadge}>{user?.rol || 'OPERADOR'}</Text></Text>
        </View>
        <View style={styles.polyglotBadge}>
          <Ionicons name="server-outline" size={18} color="#10b981" style={{ marginRight: 6 }} />
          <Text style={styles.polyglotText}>Persistencia Políglota (SQL + MongoDB)</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Módulos del Sistema</Text>

      <View style={styles.grid}>
        {stats.map((item) => (
          <TouchableOpacity key={item.id} style={styles.card} onPress={() => onNavigate(item.id)}>
            <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
              <Ionicons name={item.icon as any} size={28} color={item.color} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardValue}>{item.value}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <View style={styles.dbTag}>
                <Text style={styles.dbTagText}>{item.db}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 12,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  roleText: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  roleBadge: {
    color: '#10b981',
    fontWeight: 'bold',
  },
  polyglotBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  polyglotText: {
    color: '#34d399',
    fontSize: 13,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#cbd5e1',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  card: {
    flex: 1,
    minWidth: 180,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardInfo: {
    flex: 1,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  cardTitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 2,
  },
  dbTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#0f172a',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 6,
  },
  dbTagText: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: 'bold',
  },
});
