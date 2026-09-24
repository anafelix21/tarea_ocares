import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../config/api';
import { Usuario } from '../types';

export const UsuariosScreen: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState<'ADMIN' | 'SUPERVISOR' | 'OPERADOR'>('OPERADOR');

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const res = await api.get('/usuarios');
      setUsuarios(res.data);
    } catch (e) {
      console.warn('Error cargando usuarios, usando fallback local', e);
      setUsuarios([
        { id: '1', nombre: 'Hugo', apellido: 'Fernandez', correo: 'hugo.fernandez@agropacayales.com', rol: 'ADMIN', estado: true },
        { id: '2', nombre: 'Ana', apellido: 'Felix', correo: 'ana.felix@agropacayales.com', rol: 'SUPERVISOR', estado: true },
        { id: '3', nombre: 'Axel', apellido: 'Huapaya', correo: 'axel.huapaya@agropacayales.com', rol: 'OPERADOR', estado: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleCrearUsuario = async () => {
    if (!nombre || !correo) {
      Alert.alert('Atención', 'Ingrese al menos nombre y correo');
      return;
    }
    try {
      await api.post('/usuarios', {
        nombre,
        apellido: apellido || 'General',
        correo,
        password: password || 'Clave123',
        rol,
      });
      setModalVisible(false);
      setNombre(''); setApellido(''); setCorreo(''); setPassword('');
      cargarUsuarios();
    } catch (e) {
      Alert.alert('Error', 'No se pudo registrar el usuario');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Usuarios (MongoDB)</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Nuevo Usuario</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color="#10b981" size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={usuarios}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={24} color="#10b981" />
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{item.nombre} {item.apellido}</Text>
                <Text style={styles.email}>{item.correo}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: item.rol === 'ADMIN' ? '#ef444420' : '#10b98120' }]}>
                <Text style={[styles.badgeText, { color: item.rol === 'ADMIN' ? '#f87171' : '#34d399' }]}>{item.rol}</Text>
              </View>
            </View>
          )}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Registrar Usuario</Text>
            <TextInput style={styles.input} placeholder="Nombre" placeholderTextColor="#64748b" value={nombre} onChangeText={setNombre} />
            <TextInput style={styles.input} placeholder="Apellido" placeholderTextColor="#64748b" value={apellido} onChangeText={setApellido} />
            <TextInput style={styles.input} placeholder="Correo electrónico" placeholderTextColor="#64748b" value={correo} onChangeText={setCorreo} keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Contraseña" placeholderTextColor="#64748b" value={password} onChangeText={setPassword} secureTextEntry />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#334155' }]} onPress={() => setModalVisible(false)}>
                <Text style={{ color: '#fff' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#10b981' }]} onPress={handleCrearUsuario}>
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
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#f8fafc' },
  email: { fontSize: 13, color: '#94a3b8', marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { width: '100%', maxWidth: 400, backgroundColor: '#1e293b', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#334155' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#f8fafc', marginBottom: 14 },
  input: { backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#334155', borderRadius: 10, paddingHorizontal: 12, height: 44, color: '#fff', marginBottom: 12 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 10 },
  modalButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
});
