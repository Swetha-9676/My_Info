import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../styles/theme';

interface VaultCardProps {
  title: string;
  category: string;
  date: string;
  type: 'pdf' | 'image';
  onPress: () => void;
  onLongPress?: () => void;
}

export const VaultCard: React.FC<VaultCardProps> = ({ title, category, date, type, onPress, onLongPress }) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={500}
    >
      <View style={styles.iconContainer}>
        <View style={[styles.typeBadge, { backgroundColor: type === 'pdf' ? '#FF4B4B' : '#00F5FF' }]}>
          <Text style={styles.typeText}>{type.toUpperCase()}</Text>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.category}>{category}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    ...theme.typography.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  category: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    marginBottom: 2,
  },
  date: {
    ...theme.typography.caption,
    opacity: 0.6,
  },
});
