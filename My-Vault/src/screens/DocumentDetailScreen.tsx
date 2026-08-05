import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '../styles/theme';
import { ChevronLeft, Trash2, FileText, Download } from 'lucide-react-native';

export const DocumentDetailScreen = ({ route, navigation }: any) => {
  // const { document } = route.params;
  const document = {
    title: '10th Marksheet',
    category: 'Academics',
    date: '2024-04-26',
    path: '',
    extractedText: 'Roll No: 123456\nMath: 95\nScience: 98\nEnglish: 92\nTotal: 285/300',
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft color={theme.colors.text} size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{document.title}</Text>
        <TouchableOpacity>
          <Trash2 color={theme.colors.error} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.previewContainer}>
          {/* Placeholder for actual image/pdf renderer */}
          <View style={styles.placeholderPreview}>
            <FileText color={theme.colors.textSecondary} size={48} />
            <Text style={styles.placeholderText}>Document Preview</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.metaRow}>
            <View>
              <Text style={styles.metaLabel}>Category</Text>
              <Text style={styles.metaValue}>{document.category}</Text>
            </View>
            <View style={styles.dateBox}>
              <Text style={styles.metaLabel}>Added On</Text>
              <Text style={styles.metaValue}>{document.date}</Text>
            </View>
          </View>
        </View>

        <View style={styles.textSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Extracted Text</Text>
            <TouchableOpacity style={styles.copyButton}>
              <Text style={styles.copyButtonText}>Copy</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.textBubble}>
            <Text style={styles.extractedText}>{document.extractedText}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.downloadButton}>
          <Download color="#000" size={20} />
          <Text style={styles.downloadButtonText}>Export Original File</Text>
        </TouchableOpacity>
      </ScrollView>
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
    paddingBottom: theme.spacing.md,
  },
  headerTitle: {
    ...theme.typography.h2,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  content: {
    padding: theme.spacing.lg,
  },
  previewContainer: {
    width: '100%',
    height: 300,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  placeholderPreview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    ...theme.typography.caption,
    marginTop: 12,
  },
  infoSection: {
    marginBottom: theme.spacing.xl,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  dateBox: {
    alignItems: 'flex-end',
  },
  metaLabel: {
    ...theme.typography.caption,
    marginBottom: 4,
  },
  metaValue: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  textSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    ...theme.typography.h2,
    fontSize: 18,
  },
  copyButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: 8,
  },
  copyButtonText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  textBubble: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  extractedText: {
    ...theme.typography.body,
    fontSize: 14,
    lineHeight: 22,
  },
  downloadButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  downloadButtonText: {
    color: '#000',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
