import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../config/api';
import { MovimientoInsumo } from '../types';

export const MovimientosInsumosScreen: React.FC = () => {
  const [movimientos, setMovimientos] = useState<MovimientoInsumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [tipo, setTipo] = useState<'ENTRADA' | 'SALIDA'>('ENTRADA');
  const [motivo, setMotivo] = useState('');
  const [cantidad, setCantidad] = useState('');

  const cargarMovimientos = async () => {
    setLoading(true);
    try {
      const res = await api.get('/movimiento-insumos');
      setMovimientos(res.data);
    } catch (e) {
      console.warn('Error cargando movimientos, usando fallback local', e);
      setMovimientos([
        { id: '1', idInsumo: 'insumo-1', tipoMovimiento: 'ENTRADA', motivo: 'Compra inicial de fertilizantes', cantidad: 50, precioUnitario: 45.0, subtotal: 2250.0, stockAnterior: 50, stockNuevo: 100, referencia: 'FAC-1001' },
        { id: '2', idInsumo: 'insumo-3', tipoMovimiento: 'SALIDA', motivo: 'Fumigación de parcela Lote A', cantidad: 2, precioUnitario: 60.0, subtotal: 120.0, stockAnterior: 32, stockNuevo: 30, referencia: 'REQ-001' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMovimientos();
  }, []);

  const handleCrearMovimiento = async () => {
    if (!motivo || !cantidad) {
      Alert.alert('Atención', 'Motivo y cantidad son obligatorios');
      return;
    }
    try {
      await api.post('/movimiento-insumos', {
        idInsumo: '65f000000000000000000001',
        tipoMovimiento: tipo,
        motivo,
        cantidad: parseInt(cantidad, 10),
        precioUnitario: 45.0,
        referencia: 'REG-' + Math.floor(Math.random() * 1000),
      });
      setModalVisible(false);
      setMotivo(''); setCantidad('');
      cargarMovimientos();
    } catch (e) {
      Alert.alert('Error', 'No se pudo registrar el movimiento');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Kardex / Movimientos (MongoDB)</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Nuevo Movimiento</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color="#f59e0b" size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={movimientos}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={[styles.typeIcon, { backgroundColor: item.tipoMovimiento === 'ENTRADA' ? '#10b98120' : '#ef444420' }]}>
                <Ionicons
                  name={item.tipoMovimiento === 'ENTRADA' ? 'arrow-down-circle' : 'arrow-up-circle'}
                  size={24}
                  color={item.tipoMovimiento === 'ENTRADA' ? '#34d399' : '#f87171'}
                />
              </View>
              <View style={styles.info}>
                <Text style={styles.motivo}>{item.motivo}</Text>
                <Text style={styles.subText}>Ref: {item.referencia || 'N/A'} • Cantidad: {item.cantidad}</Text>
                <Text style={styles.subText}>Stock: {item.stockAnterior} → <Text style={{ color: '#10b981', fontWeight: 'bold' }}>{item.stockNuevo}</Text></Text>
              </View>
              <View style={styles.rightInfo}>
                <Text style={[styles.badgeText, { color: item.tipoMovimiento === 'ENTRADA' ? '#34d399' : '#f87171' }]}>
                  {item.tipoMovimiento}
                </Text>
                {item.subtotal && <Text style={styles.price}>S/ {item.subtotal.toFixed(2)}</Text>}
              </View>
            </View>
          )}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Registrar Movimiento de Almacén</Text>
            
            <View style={styles.tipoContainer}>
              <TouchableOpacity
                style={[styles.tipoBtn, tipo === 'ENTRADA' && { backgroundColor: '#10b981' }]}
                onPress={() => setTipo('ENTRADA')}
              >
                <Text style={styles.tipoBtnText}>ENTRADA (+)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tipoBtn, tipo === 'SALIDA' && { backgroundColor: '#ef4444' }]}
                onPress={() => setTipo('SALIDA')}
              >
                <Text style={styles.tipoBtnText}>SALIDA (-)</Text>
              </TouchableOpacity>
            </View>

            <TextInput style={styles.input} placeholder="Motivo (ej. Compra de fertilizantes)" placeholderTextColor="#64748b" value={motivo} onChangeText={setMotivo} />
            <TextInput style={styles.input} placeholder="Cantidad unidades" placeholderTextColor="#64748b" value={cantidad} onChangeText={setCantidad} keyboardType="numeric" />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#334155' }]} onPress={() => setModalVisible(false)}>
                <Text style={{ color: '#fff' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#f59e0b' }]} onPress={handleCrearMovimiento}>
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
  addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f59e0b', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  addButtonText: { color: '#fff', fontWeight: 'bold', marginLeft: 4 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', padding: 14, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  typeIcon: { width: 42, height: 42, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  info: { flex: 1 },
  motivo: { fontSize: 15, fontWeight: 'bold', color: '#f8fafc' },
  subText: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  rightInfo: { alignItems: 'flex-end' },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  price: { fontSize: 14, fontWeight: 'bold', color: '#f8fafc', marginTop: 4 },
  tipoContainer: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  tipoBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: '#0f172a', alignItems: 'center' },
  tipoBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { width: '100%', maxWidth: 400, backgroundColor: '#1e293b', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#334155' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#f8fafc', marginBottom: 14 },
  input: { backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#334155', borderRadius: 10, paddingHorizontal: 12, height: 44, color: '#fff', marginBottom: 12 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 10 },
  modalButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
});
