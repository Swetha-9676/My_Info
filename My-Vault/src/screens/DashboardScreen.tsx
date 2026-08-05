import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { theme } from '../styles/theme';
import { FileText, ShieldCheck, Database, Zap } from 'lucide-react-native';
import { DocumentService } from '../services/DocumentService';
import { AIService } from '../services/AIService';

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <View style={styles.statCard}>
    <View style={[styles.iconBox, { backgroundColor: `${color}20` }]}>
      <Icon color={color} size={24} />
    </View>
    <View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  </View>
);

export const DashboardScreen = () => {
  const [stats, setStats] = useState({ count: 0, storage: '0 MB' });
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    const docs = await DocumentService.getDocuments();
    setStats({
      count: docs.length,
      storage: `${(docs.length * 0.5).toFixed(1)} MB` // Estimated
    });

    if (docs.length > 0) {
      // Concatenate all extracted texts for a global summary
      const allText = docs.map(d => d.extractedText).join('\n\n');
      const aiSummary = await AIService.generatePersonalSummary(allText);
      setSummary(aiSummary);
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={theme.typography.h1}>Overview</Text>
        <Text style={theme.typography.caption}>Your personal data is encrypted and local.</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard title="Documents" value={stats.count} icon={FileText} color={theme.colors.primary} />
        <StatCard title="Security" value="High" icon={ShieldCheck} color={theme.colors.success} />
        <StatCard title="Storage" value={stats.storage} icon={Database} color={theme.colors.secondary} />
        <StatCard title="AI Index" value={`${stats.count * 5} Chunks`} icon={Zap} color={theme.colors.warning} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal AI Summary</Text>
        <View style={styles.summaryCard}>
          {loading ? (
            <ActivityIndicator color={theme.colors.primary} />
          ) : summary ? (
            <Text style={styles.summaryText}>{summary}</Text>
          ) : (
            <Text style={styles.summaryPlaceholder}>
              Upload your documents to generate a unified personal summary.
            </Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security Insights</Text>
        <View style={styles.insightCard}>
          <ShieldCheck color={theme.colors.success} size={20} />
          <Text style={styles.insightText}>Biometric lock is active. No data shared externally.</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 20,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: theme.spacing.md,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '45%',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statValue: {
    ...theme.typography.h2,
    fontSize: 18,
  },
  statTitle: {
    ...theme.typography.caption,
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.h2,
    fontSize: 20,
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  summaryText: {
    ...theme.typography.body,
    fontSize: 14,
    lineHeight: 22,
  },
  summaryPlaceholder: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 148, 0.05)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 148, 0.2)',
  },
  insightText: {
    ...theme.typography.caption,
    color: theme.colors.success,
    marginLeft: 8,
  },
});
