import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../config/api';
import { ActividadCultivo } from '../types';

export const ActividadesScreen: React.FC = () => {
  const [actividades, setActividades] = useState<ActividadCultivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [tipoActividad, setTipoActividad] = useState('Abonado');
  const [descripcion, setDescripcion] = useState('');
  const [costoTotal, setCostoTotal] = useState('');

  const cargarActividades = async () => {
    setLoading(true);
    try {
      const res = await api.get('/actividades');
      setActividades(res.data);
    } catch (e) {
      console.warn('Error cargando actividades, usando fallback local', e);
      setActividades([
        { idActividad: 1, idCultivo: 1, tipoActividad: 'Abonado', descripcion: 'Primera aplicación de fertilizante NPK', costoTotal: 135.0, estado: true, completado: true },
        { idActividad: 2, idCultivo: 2, tipoActividad: 'Fumigación', descripcion: 'Control preventivo de plagas en papa', costoTotal: 60.0, estado: true, completado: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarActividades();
  }, []);

  const handleCrearActividad = async () => {
    if (!tipoActividad || !costoTotal) {
      Alert.alert('Atención', 'Tipo de actividad y costo total son obligatorios');
      return;
    }
    try {
      await api.post('/actividades', {
        idCultivo: 1,
        tipoActividad,
        descripcion: descripcion || 'Labor agrícola en campo',
        costoTotal: parseFloat(costoTotal),
        estado: true,
        completado: false,
      });
      setModalVisible(false);
      setDescripcion(''); setCostoTotal('');
      cargarActividades();
    } catch (e) {
      Alert.alert('Error', 'No se pudo registrar la actividad');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Labores Agrícolas (SQL R2DBC)</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Nueva Actividad</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color="#ec4899" size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={actividades}
          keyExtractor={(item, index) => item.idActividad?.toString() || index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.iconBox}>
                <Ionicons name="hammer-outline" size={24} color="#ec4899" />
              </View>
              <View style={styles.info}>
                <Text style={styles.titleText}>{item.tipoActividad}</Text>
                <Text style={styles.descText}>{item.descripcion}</Text>
                <Text style={styles.subText}>Cultivo ID: {item.idCultivo}</Text>
              </View>
              <View style={styles.rightSide}>
                <Text style={styles.costText}>S/ {item.costoTotal?.toFixed(2)}</Text>
                <View style={[styles.statusBadge, { backgroundColor: item.completado ? '#10b98120' : '#f59e0b20' }]}>
                  <Text style={[styles.statusText, { color: item.completado ? '#34d399' : '#fbbf24' }]}>
                    {item.completado ? 'Completado' : 'Pendiente'}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Registrar Labor Agrícola</Text>
            <TextInput style={styles.input} placeholder="Tipo (ej. Abonado, Deshierbe, Riego)" placeholderTextColor="#64748b" value={tipoActividad} onChangeText={setTipoActividad} />
            <TextInput style={styles.input} placeholder="Descripción de la labor" placeholderTextColor="#64748b" value={descripcion} onChangeText={setDescripcion} multiline />
            <TextInput style={styles.input} placeholder="Costo Total (S/)" placeholderTextColor="#64748b" value={costoTotal} onChangeText={setCostoTotal} keyboardType="numeric" />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#334155' }]} onPress={() => setModalVisible(false)}>
                <Text style={{ color: '#fff' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#ec4899' }]} onPress={handleCrearActividad}>
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
  addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ec4899', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  addButtonText: { color: '#fff', fontWeight: 'bold', marginLeft: 4 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', padding: 14, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  iconBox: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#ec489915', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  info: { flex: 1 },
  titleText: { fontSize: 16, fontWeight: 'bold', color: '#f8fafc' },
  descText: { fontSize: 13, color: '#cbd5e1', marginTop: 2 },
  subText: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  rightSide: { alignItems: 'flex-end' },
  costText: { fontSize: 15, fontWeight: 'bold', color: '#f8fafc' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginTop: 4 },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { width: '100%', maxWidth: 400, backgroundColor: '#1e293b', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#334155' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#f8fafc', marginBottom: 14 },
  input: { backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#334155', borderRadius: 10, paddingHorizontal: 12, height: 44, color: '#fff', marginBottom: 12 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 10 },
  modalButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
});
