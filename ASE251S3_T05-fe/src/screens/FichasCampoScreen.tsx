import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../config/api';
import { FichaCampo } from '../types';

export const FichasCampoScreen: React.FC = () => {
  const [fichas, setFichas] = useState<FichaCampo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [etapa, setEtapa] = useState('Crecimiento');
  const [estadoCultivo, setEstadoCultivo] = useState('Bueno');
  const [diagnostico, setDiagnostico] = useState('');
  const [accion, setAccion] = useState('');

  const cargarFichas = async () => {
    setLoading(true);
    try {
      const res = await api.get('/fichas-campo');
      setFichas(res.data);
    } catch (e) {
      console.warn('Error cargando fichas, usando fallback local', e);
      setFichas([
        { id: '1', etapaFenologica: 'Crecimiento', temperaturaAmb: 26.0, humedadRelativa: 60.0, condicionClima: 'Despejado', estadoCultivo: 'Excelente', necesitaRiego: false, necesitaFumigacion: false, diagnostico: 'Plantas creciendo sanas', accionTomada: 'Monitoreo visual', estado: true },
        { id: '2', etapaFenologica: 'Floración', temperaturaAmb: 18.0, humedadRelativa: 70.0, condicionClima: 'Nublado', estadoCultivo: 'Regular', necesitaRiego: true, necesitaFumigacion: false, diagnostico: 'Suelo seco en superficie', accionTomada: 'Programar riego matutino', estado: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarFichas();
  }, []);

  const handleCrearFicha = async () => {
    if (!diagnostico) {
      Alert.alert('Atención', 'Ingrese el diagnóstico clínico del cultivo');
      return;
    }
    try {
      await api.post('/fichas-campo', {
        etapaFenologica: etapa,
        estadoCultivo,
        temperaturaAmb: 24.5,
        humedadRelativa: 65.0,
        condicionClima: 'Soleado',
        necesitaRiego: false,
        necesitaFumigacion: false,
        diagnostico,
        accionTomada: accion || 'Monitoreo preventivo',
        estado: true,
      });
      setModalVisible(false);
      setDiagnostico(''); setAccion('');
      cargarFichas();
    } catch (e) {
      Alert.alert('Error', 'No se pudo registrar la ficha');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Fichas de Campo (MongoDB)</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Nueva Ficha</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color="#8b5cf6" size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={fichas}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="clipboard-outline" size={24} color="#8b5cf6" />
                <Text style={styles.cardTitle}>Etapa: {item.etapaFenologica}</Text>
                <View style={[styles.statusBadge, { backgroundColor: item.estadoCultivo === 'Excelente' ? '#10b98120' : '#f59e0b20' }]}>
                  <Text style={[styles.statusText, { color: item.estadoCultivo === 'Excelente' ? '#34d399' : '#fbbf24' }]}>{item.estadoCultivo}</Text>
                </View>
              </View>

              <Text style={styles.diagText}>Diagnóstico: {item.diagnostico}</Text>
              <Text style={styles.actionText}>Acción: {item.accionTomada}</Text>

              <View style={styles.flagsRow}>
                {item.necesitaRiego && <Text style={styles.flag}>Riego Requerido</Text>}
                {item.necesitaFumigacion && <Text style={[styles.flag, { backgroundColor: '#ef444420', color: '#f87171' }]}>Fumigación Necesaria</Text>}
              </View>
            </View>
          )}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Registrar Monitoreo de Campo</Text>
            <TextInput style={styles.input} placeholder="Etapa fenológica (ej. Brote, Floración)" placeholderTextColor="#64748b" value={etapa} onChangeText={setEtapa} />
            <TextInput style={styles.input} placeholder="Estado del cultivo (ej. Excelente, Bueno)" placeholderTextColor="#64748b" value={estadoCultivo} onChangeText={setEstadoCultivo} />
            <TextInput style={styles.input} placeholder="Diagnóstico técnico" placeholderTextColor="#64748b" value={diagnostico} onChangeText={setDiagnostico} multiline />
            <TextInput style={styles.input} placeholder="Acción tomada / Recomendación" placeholderTextColor="#64748b" value={accion} onChangeText={setAccion} multiline />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#334155' }]} onPress={() => setModalVisible(false)}>
                <Text style={{ color: '#fff' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#8b5cf6' }]} onPress={handleCrearFicha}>
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
  addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#8b5cf6', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  addButtonText: { color: '#fff', fontWeight: 'bold', marginLeft: 4 },
  card: { backgroundColor: '#1e293b', padding: 16, borderRadius: 14, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#f8fafc', flex: 1, marginLeft: 8 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  diagText: { color: '#cbd5e1', fontSize: 14, marginBottom: 4 },
  actionText: { color: '#94a3b8', fontSize: 13, marginBottom: 8 },
  flagsRow: { flexDirection: 'row', gap: 8 },
  flag: { backgroundColor: '#3b82f620', color: '#60a5fa', fontSize: 11, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { width: '100%', maxWidth: 400, backgroundColor: '#1e293b', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#334155' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#f8fafc', marginBottom: 14 },
  input: { backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#334155', borderRadius: 10, paddingHorizontal: 12, height: 44, color: '#fff', marginBottom: 12 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 10 },
  modalButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
});
