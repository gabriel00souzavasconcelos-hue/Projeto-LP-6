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
    elevation: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    width: '100%',
    height: 160,
  },
  infoContainer: {
    padding: spacing.lg,
  },
  name: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingVertical: spacing.xs,
  },
  text: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flexShrink: 1,
    lineHeight: 18,
  },
  specializationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  tag: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    elevation: 1,
  },
  tagText: {
    fontSize: fontSize.xs,
    color: colors.onPrimary,
    fontWeight: fontWeight.semibold,
  },
  tagMore: {
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    elevation: 1,
  },
  tagMoreText: {
    fontSize: fontSize.xs,
    color: colors.onSecondary,
    fontWeight: fontWeight.semibold,
  },
});