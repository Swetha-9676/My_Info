import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../styles/theme';
import { VaultCard } from '../components/VaultCard';
import { Search, Plus, Filter } from 'lucide-react-native';
import { DocumentPickerService } from '../services/DocumentPickerService';
import { DocumentService, Document } from '../services/DocumentService';
import { RAGEngine } from '../services/RAGEngine';

const CATEGORIES = ['All', 'Academics', 'Identity', 'Finance', 'Other'];

export const VaultScreen = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    const docs = await DocumentService.getDocuments();
    setDocuments(docs);
  };

  const handleAddDocument = async () => {
    const result = await DocumentPickerService.pickDocument();
    if (result) {
      try {
        Alert.alert('Processing', 'AI is reading your document carefully...');
        const newDoc = await DocumentService.addDocument({
          title: result.name,
          category: 'Other',
          path: result.uri,
          type: result.mimeType?.includes('pdf') ? 'pdf' : 'image',
        });
        setDocuments(prev => [newDoc, ...prev]);
        Alert.alert('Success', 'Document read and added to your vault.');
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to read document. Please check your internet connection.');
      }
    }
  };

  const handleDeleteDocument = (id: string) => {
    Alert.alert(
      'Delete Document',
      'Remove this document from your vault?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            await DocumentService.deleteDocument(id);
            loadDocs();
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={theme.typography.h1}>My Vault</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Filter color={theme.colors.primary} size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchIcon}>
          <Search color={theme.colors.textSecondary} size={20} />
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search documents..."
          placeholderTextColor={theme.colors.textSecondary}
        />
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          data={CATEGORIES}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                activeCategory === item ? styles.activeCategoryChip : null
              ]}
              onPress={() => setActiveCategory(item)}
            >
              <Text style={[
                styles.categoryText,
                activeCategory === item ? styles.activeCategoryText : null
              ]}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
        />
      </View>

      <FlatList
        data={documents.filter(d => activeCategory === 'All' || d.category === activeCategory)}
        renderItem={({ item }) => (
          <VaultCard
            title={item.title}
            category={item.category}
            date="2024-04-26"
            type={item.type}
            onPress={() => {}}
            onLongPress={() => handleDeleteDocument(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No documents yet.</Text>
            <Text style={styles.emptySubtext}>Tap the + button to add your first document.</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity style={styles.fab} onPress={handleAddDocument}>
        <Plus color="#000" size={32} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  iconButton: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    height: 50,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 16,
  },
  categoriesContainer: {
    marginBottom: theme.spacing.lg,
    paddingLeft: theme.spacing.lg,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  activeCategoryChip: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryText: {
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  activeCategoryText: {
    color: '#000',
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 100,
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    ...theme.typography.h2,
    marginBottom: 8,
  },
  emptySubtext: {
    ...theme.typography.caption,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
