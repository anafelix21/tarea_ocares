import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../config/api';
import { Harvest } from '../types';

export const CosechasScreen: React.FC = () => {
  const [cosechas, setCosechas] = useState<Harvest[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [responsable, setResponsable] = useState('Ana Felix');
  const [kilosOptimos, setKilosOptimos] = useState('3500');
  const [kilosMerma, setKilosMerma] = useState('320');

  const cargarCosechas = async () => {
    setLoading(true);
    try {
      const res = await api.get('/harvest/listar');
      setCosechas(res.data);
    } catch (e) {
      console.warn('Error cargando cosechas, usando fallback local', e);
      setCosechas([
        { idHarvest: 1, responsable: 'Ana Felix', fechaCosecha: '2026-06-01', estado: true, detalles: [{ idHarvestDetail: 1, idHarvest: 1, idCultivo: 1, kilosOptimos: 3500, kilosMerma: 320 }] },
        { idHarvest: 2, responsable: 'Hugo Fernandez', fechaCosecha: '2026-06-03', estado: true, detalles: [{ idHarvestDetail: 2, idHarvest: 2, idCultivo: 2, kilosOptimos: 1800, kilosMerma: 210 }] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCosechas();
  }, []);

  const handleCrearCosecha = async () => {
    if (!responsable || !kilosOptimos) {
      Alert.alert('Atención', 'Responsable y kilos óptimos son obligatorios');
      return;
    }
    try {
      await api.post('/harvest/registrar', {
        responsable,
        fechaCosecha: new Date().toISOString().split('T')[0],
        estado: true,
        detalles: [
          {
            idCultivo: 1,
            kilosOptimos: parseFloat(kilosOptimos),
            kilosMerma: parseFloat(kilosMerma || '0'),
          },
        ],
      });
      setModalVisible(false);
      setResponsable('Ana Felix'); setKilosOptimos(''); setKilosMerma('');
      cargarCosechas();
    } catch (e) {
      Alert.alert('Error', 'No se pudo registrar la cosecha');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Cosechas & Rendimiento (SQL R2DBC)</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Nueva Cosecha</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color="#06b6d4" size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={cosechas}
          keyExtractor={(item, index) => item.idHarvest?.toString() || index.toString()}
          renderItem={({ item }) => {
            const primerDetalle = item.detalles && item.detalles.length > 0 ? item.detalles[0] : null;
            return (
              <View style={styles.card}>
                <View style={styles.iconBox}>
                  <Ionicons name="basket-outline" size={24} color="#06b6d4" />
                </View>
                <View style={styles.info}>
                  <Text style={styles.respText}>Responsable: {item.responsable}</Text>
                  <Text style={styles.subText}>Fecha: {item.fechaCosecha}</Text>
                  {primerDetalle && (
                    <Text style={styles.kilosText}>
                      Óptimos: <Text style={{ color: '#10b981', fontWeight: 'bold' }}>{primerDetalle.kilosOptimos} kg</Text> |
                      Merma: <Text style={{ color: '#ef4444', fontWeight: 'bold' }}>{primerDetalle.kilosMerma} kg</Text>
                    </Text>
                  )}
                </View>
              </View>
            );
          }}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Registrar Cosecha</Text>
            <TextInput style={styles.input} placeholder="Responsable (ej. Ana Felix)" placeholderTextColor="#64748b" value={responsable} onChangeText={setResponsable} />
            <TextInput style={styles.input} placeholder="Kilos óptimos cosechados" placeholderTextColor="#64748b" value={kilosOptimos} onChangeText={setKilosOptimos} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Kilos merma / descarte" placeholderTextColor="#64748b" value={kilosMerma} onChangeText={setKilosMerma} keyboardType="numeric" />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#334155' }]} onPress={() => setModalVisible(false)}>
                <Text style={{ color: '#fff' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#06b6d4' }]} onPress={handleCrearCosecha}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#f8fafc' },
  addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#06b6d4', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  addButtonText: { color: '#fff', fontWeight: 'bold', marginLeft: 4 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', padding: 14, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  iconBox: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#06b6d415', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  info: { flex: 1 },
  respText: { fontSize: 16, fontWeight: 'bold', color: '#f8fafc' },
  subText: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  kilosText: { fontSize: 13, color: '#cbd5e1', marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { width: '100%', maxWidth: 400, backgroundColor: '#1e293b', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#334155' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#f8fafc', marginBottom: 14 },
  input: { backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#334155', borderRadius: 10, paddingHorizontal: 12, height: 44, color: '#fff', marginBottom: 12 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 10 },
  modalButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
});
