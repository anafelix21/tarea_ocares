import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../config/api';
import { AsignacionCabecera } from '../types';

export const AsignacionesScreen: React.FC = () => {
  const [asignaciones, setAsignaciones] = useState<AsignacionCabecera[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [horas, setHoras] = useState('8');
  const [costoManoObra, setCostoManoObra] = useState('120');
  const [observacion, setObservacion] = useState('');

  const cargarAsignaciones = async () => {
    setLoading(true);
    try {
      const res = await api.get('/asignaciones');
      setAsignaciones(res.data);
    } catch (e) {
      console.warn('Error cargando asignaciones, usando fallback local', e);
      setAsignaciones([
        { idAsignacionCabecera: 1, idActividad: 1, horasTrabajadas: 4.0, costoTotalManoObra: 120.0, observacion: 'Aplicación NPK, turno mañana', estado: true },
        { idAsignacionCabecera: 2, idActividad: 2, horasTrabajadas: 3.5, costoTotalManoObra: 85.0, observacion: 'Control de plagas en papa', estado: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAsignaciones();
  }, []);

  const handleCrearAsignacion = async () => {
    if (!horas || !costoManoObra) {
      Alert.alert('Atención', 'Horas trabajadas y costo mano de obra son requeridos');
      return;
    }
    try {
      await api.post('/asignaciones', {
        idActividad: 1,
        horasTrabajadas: parseFloat(horas),
        costoTotalManoObra: parseFloat(costoManoObra),
        observacion: observacion || 'Asignación de operadores en campo',
        estado: true,
      });
      setModalVisible(false);
      setHoras(''); setCostoManoObra(''); setObservacion('');
      cargarAsignaciones();
    } catch (e) {
      Alert.alert('Error', 'No se pudo crear la asignación');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Mano de Obra (SQL R2DBC)</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Nueva Asignación</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color="#10b981" size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={asignaciones}
          keyExtractor={(item, index) => item.idAsignacionCabecera?.toString() || index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.iconBox}>
                <Ionicons name="people-outline" size={24} color="#10b981" />
              </View>
              <View style={styles.info}>
                <Text style={styles.obsText}>{item.observacion || 'Sin observación'}</Text>
                <Text style={styles.subText}>Actividad ID: {item.idActividad} • Horas: {item.horasTrabajadas}h</Text>
              </View>
              <View style={styles.rightSide}>
                <Text style={styles.costText}>S/ {item.costoTotalManoObra?.toFixed(2)}</Text>
              </View>
            </View>
          )}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Asignar Jornada de Trabajo</Text>
            <TextInput style={styles.input} placeholder="Horas trabajadas (ej. 8)" placeholderTextColor="#64748b" value={horas} onChangeText={setHoras} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Costo total mano de obra (S/)" placeholderTextColor="#64748b" value={costoManoObra} onChangeText={setCostoManoObra} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Observación / Turno" placeholderTextColor="#64748b" value={observacion} onChangeText={setObservacion} multiline />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#334155' }]} onPress={() => setModalVisible(false)}>
                <Text style={{ color: '#fff' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#10b981' }]} onPress={handleCrearAsignacion}>
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
  addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#10b981', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  addButtonText: { color: '#fff', fontWeight: 'bold', marginLeft: 4 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', padding: 14, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  iconBox: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#10b98115', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  info: { flex: 1 },
  obsText: { fontSize: 15, fontWeight: 'bold', color: '#f8fafc' },
  subText: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  rightSide: { alignItems: 'flex-end' },
  costText: { fontSize: 16, fontWeight: 'bold', color: '#f8fafc' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { width: '100%', maxWidth: 400, backgroundColor: '#1e293b', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#334155' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#f8fafc', marginBottom: 14 },
  input: { backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#334155', borderRadius: 10, paddingHorizontal: 12, height: 44, color: '#fff', marginBottom: 12 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 10 },
  modalButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
});
