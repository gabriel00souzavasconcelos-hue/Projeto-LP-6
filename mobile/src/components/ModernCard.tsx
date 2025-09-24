import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius } from '../styles/theme';

interface ModernCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: keyof typeof spacing;
}

export default function ModernCard({
  children,
  style,
  variant = 'default',
  padding = 'md',
}: ModernCardProps) {
  const cardStyle = [
    styles.base,
    styles[variant],
    { padding: spacing[padding] },
    style,
  ];

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
  },
  default: {
    // Clean iOS style - no shadows
  },
  elevated: {
    // Clean iOS style - no shadows
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.border,
  },
});