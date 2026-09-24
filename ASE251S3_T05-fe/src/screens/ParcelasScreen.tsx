import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../config/api';
import { Parcela } from '../types';

export const ParcelasScreen: React.FC = () => {
  const [parcelas, setParcelas] = useState<Parcela[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [area, setArea] = useState('');
  const [tipoSuelo, setTipoSuelo] = useState('');
  const [responsable, setResponsable] = useState('');

  const cargarParcelas = async () => {
    setLoading(true);
    try {
      const res = await api.get('/parcelas');
      setParcelas(res.data);
    } catch (e) {
      console.warn('Error cargando parcelas, usando fallback local', e);
      setParcelas([
        { id: '1', nombre: 'Lote A - Valle Norte', ubicacion: 'Sector Norte, Km 5', areaHectareas: 4.5, tipoSuelo: 'Arcilloso', responsable: 'Ana Felix', estadoRiego: 'Goteo', cultivoActual: 'Maíz Híbrido', estado: true },
        { id: '2', nombre: 'Lote B - La Ladera', ubicacion: 'Sector Sur, Zona Alta', areaHectareas: 2.0, tipoSuelo: 'Arenoso', responsable: 'Axel Huapaya', estadoRiego: 'Aspersión', cultivoActual: 'Papa Yungay', estado: true },
        { id: '3', nombre: 'Lote D - Invernadero', ubicacion: 'Sector Central', areaHectareas: 0.5, tipoSuelo: 'Franco', responsable: 'Hugo Fernandez', estadoRiego: 'Goteo', cultivoActual: 'Tomates Cherry', estado: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarParcelas();
  }, []);

  const handleCrearParcela = async () => {
    if (!nombre || !area) {
      Alert.alert('Atención', 'Nombre y área son requeridos');
      return;
    }
    try {
      await api.post('/parcelas', {
        nombre,
        ubicacion: ubicacion || 'Sector Central',
        areaHectareas: parseFloat(area),
        tipoSuelo: tipoSuelo || 'Franco',
        responsable: responsable || 'Ana Felix',
        estadoRiego: 'Goteo',
        enUso: true,
        estado: true,
      });
      setModalVisible(false);
      setNombre(''); setUbicacion(''); setArea(''); setTipoSuelo(''); setResponsable('');
      cargarParcelas();
    } catch (e) {
      Alert.alert('Error', 'No se pudo crear la parcela');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Parcelas & Terrenos (MongoDB)</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Nueva Parcela</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color="#10b981" size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={parcelas}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="map-outline" size={24} color="#10b981" />
                <Text style={styles.cardTitle}>{item.nombre}</Text>
                <View style={styles.areaBadge}>
                  <Text style={styles.areaText}>{item.areaHectareas} Ha</Text>
                </View>
              </View>

              <View style={styles.detailsRow}>
                <Text style={styles.detailText}><Ionicons name="navigate-outline" size={14} color="#94a3b8" /> {item.ubicacion || 'Sin ubicación'}</Text>
                <Text style={styles.detailText}><Ionicons name="person-outline" size={14} color="#94a3b8" /> {item.responsable || 'Sin responsable'}</Text>
              </View>

              <View style={styles.tagsContainer}>
                <Text style={styles.tag}>Suelo: {item.tipoSuelo || 'N/A'}</Text>
                <Text style={styles.tag}>Riego: {item.estadoRiego || 'N/A'}</Text>
                {item.cultivoActual && <Text style={[styles.tag, { backgroundColor: '#10b98120', color: '#34d399' }]}>Cultivo: {item.cultivoActual}</Text>}
              </View>
            </View>
          )}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Registrar Nueva Parcela</Text>
            <TextInput style={styles.input} placeholder="Nombre de la parcela (ej. Lote C)" placeholderTextColor="#64748b" value={nombre} onChangeText={setNombre} />
            <TextInput style={styles.input} placeholder="Ubicación (ej. Sector Norte)" placeholderTextColor="#64748b" value={ubicacion} onChangeText={setUbicacion} />
            <TextInput style={styles.input} placeholder="Área (Hectáreas, ej. 3.5)" placeholderTextColor="#64748b" value={area} onChangeText={setArea} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Tipo de Suelo (ej. Limoso)" placeholderTextColor="#64748b" value={tipoSuelo} onChangeText={setTipoSuelo} />
            <TextInput style={styles.input} placeholder="Responsable (ej. Axel Huapaya)" placeholderTextColor="#64748b" value={responsable} onChangeText={setResponsable} />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#334155' }]} onPress={() => setModalVisible(false)}>
                <Text style={{ color: '#fff' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#10b981' }]} onPress={handleCrearParcela}>
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
  card: { backgroundColor: '#1e293b', padding: 16, borderRadius: 14, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#f8fafc', flex: 1, marginLeft: 8 },
  areaBadge: { backgroundColor: '#0f172a', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  areaText: { color: '#10b981', fontWeight: 'bold', fontSize: 12 },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  detailText: { color: '#94a3b8', fontSize: 13 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { backgroundColor: '#0f172a', color: '#cbd5e1', fontSize: 11, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { width: '100%', maxWidth: 400, backgroundColor: '#1e293b', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#334155' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#f8fafc', marginBottom: 14 },
  input: { backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#334155', borderRadius: 10, paddingHorizontal: 12, height: 44, color: '#fff', marginBottom: 12 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 10 },
  modalButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
});
