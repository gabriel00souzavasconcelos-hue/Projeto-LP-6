import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Clinic } from '../types';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';

type Props = { 
  clinic: Clinic; 
  onPress?: () => void 
};

export default function ClinicCard({ clinic, onPress }: Props) {
  const placeholderImage = require('../../assets/clinic-placeholder.jpg');
  const imageSource = clinic.imagem ? { uri: clinic.imagem } : placeholderImage;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={imageSource} style={styles.image} resizeMode="cover" />
      
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{clinic.nome}</Text>
        
        {clinic.endereco ? (
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.text} numberOfLines={1}>{clinic.endereco}</Text>
          </View>
        ) : null}
        
        {clinic.fone ? (
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.text}>{clinic.fone}</Text>
          </View>
        ) : null}

        {clinic.especializacoes && clinic.especializacoes.length > 0 && (
          <View style={styles.specializationsContainer}>
            {clinic.especializacoes.slice(0, 3).map((spec, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{spec}</Text>
              </View>
            ))}
            {clinic.especializacoes.length > 3 && (
              <View style={styles.tagMore}>
                <Text style={styles.tagMoreText}>+{clinic.especializacoes.length - 3}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 150,
  },
  infoContainer: {
    padding: spacing.md,
  },
  name: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  text: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flexShrink: 1,
  },
  specializationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  tag: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  tagText: {
    fontSize: fontSize.xs,
    color: colors.primaryDark,
    fontWeight: fontWeight.medium,
  },
  tagMore: {
    backgroundColor: colors.surfaceVariant,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  tagMoreText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
});