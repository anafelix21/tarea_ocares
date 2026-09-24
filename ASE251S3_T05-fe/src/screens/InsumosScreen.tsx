import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../config/api';
import { Insumo } from '../types';

export const InsumosScreen: React.FC = () => {
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [tipoInsumo, setTipoInsumo] = useState('FERTILIZANTE');

  const cargarInsumos = async () => {
    setLoading(true);
    try {
      const res = await api.get('/insumos');
      setInsumos(res.data);
    } catch (e) {
      console.warn('Error cargando insumos, usando fallback local', e);
      setInsumos([
        { id: '1', nombre: 'Fertilizante NPK', descripcion: 'Rico en nutrientes', precio: 45.0, stock: 100, unidadMedida: 'kg', tipoInsumo: 'FERTILIZANTE', proveedor: 'AgroQuímica', estado: true },
        { id: '2', nombre: 'Urea Granulada', descripcion: 'Nitrógeno concentrado', precio: 35.0, stock: 120, unidadMedida: 'kg', tipoInsumo: 'FERTILIZANTE', proveedor: 'Abonos del Sur', estado: true },
        { id: '3', nombre: 'Herbicida Orgánico', descripcion: 'Control de maleza', precio: 60.0, stock: 30, unidadMedida: 'litro', tipoInsumo: 'HERBICIDA', proveedor: 'BioCrops', estado: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarInsumos();
  }, []);

  const handleCrearInsumo = async () => {
    if (!nombre || !precio || !stock) {
      Alert.alert('Atención', 'Nombre, precio y stock son obligatorios');
      return;
    }
    try {
      await api.post('/insumos', {
        nombre,
        precio: parseFloat(precio),
        stock: parseInt(stock, 10),
        tipoInsumo,
        unidadMedida: 'kg',
        estado: true,
      });
      setModalVisible(false);
      setNombre(''); setPrecio(''); setStock('');
      cargarInsumos();
    } catch (e) {
      Alert.alert('Error', 'No se pudo crear el insumo');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Insumos Agrícolas (MongoDB)</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Nuevo Insumo</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color="#10b981" size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={insumos}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.iconBox}>
                <Ionicons name="cube-outline" size={24} color="#f59e0b" />
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{item.nombre}</Text>
                <Text style={styles.typeText}>{item.tipoInsumo} • {item.proveedor || 'Sin proveedor'}</Text>
              </View>
              <View style={styles.rightStats}>
                <Text style={styles.priceText}>S/ {item.precio.toFixed(2)}</Text>
                <View style={[styles.stockBadge, { backgroundColor: item.stock < 40 ? '#ef444420' : '#10b98120' }]}>
                  <Text style={[styles.stockText, { color: item.stock < 40 ? '#f87171' : '#34d399' }]}>Stock: {item.stock} {item.unidadMedida}</Text>
                </View>
              </View>
            </View>
          )}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Registrar Insumo</Text>
            <TextInput style={styles.input} placeholder="Nombre del insumo" placeholderTextColor="#64748b" value={nombre} onChangeText={setNombre} />
            <TextInput style={styles.input} placeholder="Precio (S/)" placeholderTextColor="#64748b" value={precio} onChangeText={setPrecio} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Stock Inicial" placeholderTextColor="#64748b" value={stock} onChangeText={setStock} keyboardType="numeric" />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#334155' }]} onPress={() => setModalVisible(false)}>
                <Text style={{ color: '#fff' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#10b981' }]} onPress={handleCrearInsumo}>
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
  iconBox: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#f59e0b15', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#f8fafc' },
  typeText: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  rightStats: { alignItems: 'flex-end' },
  priceText: { fontSize: 16, fontWeight: 'bold', color: '#f8fafc' },
  stockBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 4 },
  stockText: { fontSize: 11, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { width: '100%', maxWidth: 400, backgroundColor: '#1e293b', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#334155' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#f8fafc', marginBottom: 14 },
  input: { backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#334155', borderRadius: 10, paddingHorizontal: 12, height: 44, color: '#fff', marginBottom: 12 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 10 },
  modalButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
});
