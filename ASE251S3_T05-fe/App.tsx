import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { LoginScreen } from './src/screens/LoginScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { UsuariosScreen } from './src/screens/UsuariosScreen';
import { ParcelasScreen } from './src/screens/ParcelasScreen';
import { InsumosScreen } from './src/screens/InsumosScreen';
import { CultivosScreen } from './src/screens/CultivosScreen';
import { FichasCampoScreen } from './src/screens/FichasCampoScreen';
import { MovimientosInsumosScreen } from './src/screens/MovimientosInsumosScreen';
import { ActividadesScreen } from './src/screens/ActividadesScreen';
import { AsignacionesScreen } from './src/screens/AsignacionesScreen';
import { CosechasScreen } from './src/screens/CosechasScreen';

const MainContent: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [activeScreen, setActiveScreen] = useState('inicio');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={() => setActiveScreen('inicio')} />;
  }

  const menuItems = [
    { id: 'inicio', title: 'Inicio / Dashboard', icon: 'home-outline', db: 'Info' },
    { id: 'usuarios', title: 'Usuarios', icon: 'people-outline', db: 'MongoDB' },
    { id: 'parcelas', title: 'Parcelas', icon: 'map-outline', db: 'MongoDB' },
    { id: 'insumos', title: 'Insumos Agrícolas', icon: 'cube-outline', db: 'MongoDB' },
    { id: 'cultivos', title: 'Cultivos', icon: 'flower-outline', db: 'SQL' },
    { id: 'fichas-campo', title: 'Fichas de Campo', icon: 'clipboard-outline', db: 'MongoDB' },
    { id: 'movimiento-insumos', title: 'Movimientos Insumos', icon: 'swap-horizontal-outline', db: 'MongoDB' },
    { id: 'actividades', title: 'Labores Agrícolas', icon: 'hammer-outline', db: 'SQL' },
    { id: 'asignaciones', title: 'Mano de Obra', icon: 'people-circle-outline', db: 'SQL' },
    { id: 'cosechas', title: 'Cosechas', icon: 'basket-outline', db: 'SQL' },
  ];

  const renderScreen = () => {
    switch (activeScreen) {
      case 'usuarios': return <UsuariosScreen />;
      case 'parcelas': return <ParcelasScreen />;
      case 'insumos': return <InsumosScreen />;
      case 'cultivos': return <CultivosScreen />;
      case 'fichas-campo': return <FichasCampoScreen />;
      case 'movimiento-insumos': return <MovimientosInsumosScreen />;
      case 'actividades': return <ActividadesScreen />;
      case 'asignaciones': return <AsignacionesScreen />;
      case 'cosechas': return <CosechasScreen />;
      default: return <DashboardScreen onNavigate={(screen) => setActiveScreen(screen)} />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      {/* Top Navbar */}
      <View style={styles.topNav}>
        <TouchableOpacity style={styles.menuBtn} onPress={() => setSidebarOpen(!sidebarOpen)}>
          <Ionicons name={sidebarOpen ? "close" : "menu"} size={26} color="#f8fafc" />
        </TouchableOpacity>
        <View style={styles.brandRow}>
          <Ionicons name="leaf" size={24} color="#10b981" />
          <Text style={styles.brandTitle}>AgroPacayales RN</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color="#f87171" />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        {/* Navigation Sidebar / Menu */}
        {sidebarOpen && (
          <View style={styles.sidebar}>
            <ScrollView style={{ flex: 1 }}>
              <Text style={styles.menuHeader}>MÓDULOS DE NEGOCIO</Text>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.menuItem, activeScreen === item.id && styles.menuItemActive]}
                  onPress={() => {
                    setActiveScreen(item.id);
                    setSidebarOpen(false);
                  }}
                >
                  <Ionicons name={item.icon as any} size={20} color={activeScreen === item.id ? '#10b981' : '#94a3b8'} />
                  <Text style={[styles.menuItemText, activeScreen === item.id && styles.menuItemTextActive]}>
                    {item.title}
                  </Text>
                  <View style={[styles.dbBadge, { backgroundColor: item.db === 'SQL' ? '#3b82f620' : '#10b98120' }]}>
                    <Text style={[styles.dbBadgeText, { color: item.db === 'SQL' ? '#60a5fa' : '#34d399' }]}>{item.db}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Screen Container */}
        <View style={styles.mainView}>
          {renderScreen()}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  topNav: {
    height: 60,
    backgroundColor: '#1e293b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  menuBtn: {
    padding: 6,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutBtn: {
    padding: 6,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 250,
    backgroundColor: '#1e293b',
    borderRightWidth: 1,
    borderRightColor: '#334155',
    paddingVertical: 12,
    zIndex: 10,
  },
  menuHeader: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 8,
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuItemActive: {
    backgroundColor: '#0f172a',
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  menuItemText: {
    color: '#94a3b8',
    fontSize: 14,
    flex: 1,
  },
  menuItemTextActive: {
    color: '#f8fafc',
    fontWeight: 'bold',
  },
  dbBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  dbBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  mainView: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
});
