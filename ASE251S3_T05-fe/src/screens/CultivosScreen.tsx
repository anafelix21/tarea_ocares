import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../config/api';
import { Cultivo } from '../types';

export const CultivosScreen: React.FC = () => {
  const [cultivos, setCultivos] = useState<Cultivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState('');
  const [tipoCultivo, setTipoCultivo] = useState('');
  const [frecuenciaRiego, setFrecuenciaRiego] = useState('3');
  const [temperatura, setTemperatura] = useState('22.5');

  const cargarCultivos = async () => {
    setLoading(true);
    try {
      const res = await api.get('/cultivos');
      setCultivos(res.data);
    } catch (e) {
      console.warn('Error cargando cultivos, usando fallback local', e);
      setCultivos([
        { idCultivo: 1, idParcela: 'lote-a', nombre: 'Maíz Primavera', tipoCultivo: 'Maíz', frecuenciaRiegoDias: 4, temperaturaIdeal: 25.0, fechaSiembra: '2026-03-10', estado: true },
        { idCultivo: 2, idParcela: 'lote-b', nombre: 'Papa Invierno', tipoCultivo: 'Papa', frecuenciaRiegoDias: 6, temperaturaIdeal: 18.0, fechaSiembra: '2026-04-01', estado: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCultivos();
  }, []);

  const handleCrearCultivo = async () => {
    if (!nombre || !tipoCultivo) {
      Alert.alert('Atención', 'Nombre y tipo de cultivo son obligatorios');
      return;
    }
    try {
      await api.post('/cultivos', {
        idParcela: 'lote-a',
        nombre,
        tipoCultivo,
        frecuenciaRiegoDias: parseInt(frecuenciaRiego, 10),
        temperaturaIdeal: parseFloat(temperatura),
        fechaSiembra: new Date().toISOString().split('T')[0],
        estado: true,
      });
      setModalVisible(false);
      setNombre(''); setTipoCultivo('');
      cargarCultivos();
    } catch (e) {
      Alert.alert('Error', 'No se pudo crear el cultivo');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Ciclos de Cultivo (SQL R2DBC)</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Nuevo Cultivo</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color="#3b82f6" size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={cultivos}
          keyExtractor={(item, index) => item.idCultivo?.toString() || index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.iconBox}>
                <Ionicons name="flower-outline" size={24} color="#3b82f6" />
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{item.nombre}</Text>
                <Text style={styles.subText}>Tipo: {item.tipoCultivo} • Parcela: {item.idParcela}</Text>
                <Text style={styles.subText}>Siembra: {item.fechaSiembra || 'Reciente'}</Text>
              </View>
              <View style={styles.badgeContainer}>
                <View style={styles.tag}><Text style={styles.tagText}>Riego: c/{item.frecuenciaRiegoDias}d</Text></View>
                <View style={styles.tag}><Text style={styles.tagText}>{item.temperaturaIdeal}°C</Text></View>
              </View>
            </View>
          )}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Registrar Nuevo Cultivo</Text>
            <TextInput style={styles.input} placeholder="Nombre del cultivo (ej. Palta Hass)" placeholderTextColor="#64748b" value={nombre} onChangeText={setNombre} />
            <TextInput style={styles.input} placeholder="Tipo de cultivo (ej. Frutal)" placeholderTextColor="#64748b" value={tipoCultivo} onChangeText={setTipoCultivo} />
            <TextInput style={styles.input} placeholder="Frecuencia de riego (días)" placeholderTextColor="#64748b" value={frecuenciaRiego} onChangeText={setFrecuenciaRiego} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Temperatura ideal (°C)" placeholderTextColor="#64748b" value={temperatura} onChangeText={setTemperatura} keyboardType="numeric" />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#334155' }]} onPress={() => setModalVisible(false)}>
                <Text style={{ color: '#fff' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#3b82f6' }]} onPress={handleCrearCultivo}>
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
  addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#3b82f6', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  addButtonText: { color: '#fff', fontWeight: 'bold', marginLeft: 4 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', padding: 14, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  iconBox: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#3b82f615', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#f8fafc' },
  subText: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  badgeContainer: { alignItems: 'flex-end', gap: 4 },
  tag: { backgroundColor: '#0f172a', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tagText: { color: '#60a5fa', fontSize: 11, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { width: '100%', maxWidth: 400, backgroundColor: '#1e293b', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#334155' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#f8fafc', marginBottom: 14 },
  input: { backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#334155', borderRadius: 10, paddingHorizontal: 12, height: 44, color: '#fff', marginBottom: 12 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 10 },
  modalButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
});
