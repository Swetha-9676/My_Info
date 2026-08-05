import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { VaultScreen } from './src/screens/VaultScreen';
import { ChatScreen } from './src/screens/ChatScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { theme } from './src/styles/theme';
import { FileText, MessageSquare, LayoutDashboard } from 'lucide-react-native';
import { RAGEngine } from './src/services/RAGEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState('Vault');

  React.useEffect(() => {
    const init = async () => {
      await RAGEngine.initialize();
    };
    init();
  }, []);

  const renderScreen = () => {
    switch (activeTab) {
      case 'Vault': return <VaultScreen />;
      case 'Chat': return <ChatScreen />;
      case 'Dashboard': return <DashboardScreen />;
      default: return <VaultScreen />;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {renderScreen()}
        </View>
        
        <View style={styles.tabBar}>
          <TouchableOpacity 
            style={styles.tabItem} 
            onPress={() => setActiveTab('Vault')}
          >
            <FileText color={activeTab === 'Vault' ? theme.colors.primary : theme.colors.textSecondary} size={24} />
            <Text style={[styles.tabText, { color: activeTab === 'Vault' ? theme.colors.primary : theme.colors.textSecondary }]}>Vault</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.tabItem} 
            onPress={() => setActiveTab('Chat')}
          >
            <MessageSquare color={activeTab === 'Chat' ? theme.colors.primary : theme.colors.textSecondary} size={24} />
            <Text style={[styles.tabText, { color: activeTab === 'Chat' ? theme.colors.primary : theme.colors.textSecondary }]}>Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.tabItem} 
            onPress={() => setActiveTab('Dashboard')}
          >
            <LayoutDashboard color={activeTab === 'Dashboard' ? theme.colors.primary : theme.colors.textSecondary} size={24} />
            <Text style={[styles.tabText, { color: activeTab === 'Dashboard' ? theme.colors.primary : theme.colors.textSecondary }]}>Dashboard</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    height: 80,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingBottom: 20,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '600',
  },
});
