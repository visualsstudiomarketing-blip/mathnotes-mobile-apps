import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LiquidGlassTokens } from './LiquidGlassTokens';

export interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  glowColor?: string;
  glowPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'center';
  borderGradientColors?: [string, string, ...string[]];
  onPress?: () => void;
  activeOpacity?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  contentStyle,
  glowColor,
  glowPosition = 'top-right',
  borderGradientColors,
  onPress,
  activeOpacity = 0.85,
}) => {
  const borderColors: [string, string, ...string[]] = borderGradientColors || [
    glowColor
      ? `${glowColor}55`
      : LiquidGlassTokens.colors.specularTop,
    LiquidGlassTokens.colors.specularMid,
    LiquidGlassTokens.colors.specularBottom,
  ];

  const renderContent = () => (
    <LinearGradient
      colors={borderColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.specularBorder, style]}
    >
      <View style={[styles.glassCore, contentStyle]}>
        {glowColor && (
          <View
            style={[
              styles.ambientGlow,
              glowPosition === 'top-right' && styles.glowTopRight,
              glowPosition === 'top-left' && styles.glowTopLeft,
              glowPosition === 'bottom-right' && styles.glowBottomRight,
              glowPosition === 'center' && styles.glowCenter,
              { backgroundColor: glowColor },
            ]}
          />
        )}
        {children}
      </View>
    </LinearGradient>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={activeOpacity}
        style={styles.touchableWrapper}
      >
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return renderContent();
};

const styles = StyleSheet.create({
  touchableWrapper: {
    borderRadius: LiquidGlassTokens.radius.lg,
  },
  specularBorder: {
    padding: 1.2, // 1.2px border highlight
    borderRadius: LiquidGlassTokens.radius.lg,
    ...LiquidGlassTokens.shadows.glassElevated,
  },
  glassCore: {
    borderRadius: LiquidGlassTokens.radius.lg - 1,
    backgroundColor: LiquidGlassTokens.colors.glassMedium,
    padding: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  ambientGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    opacity: 0.16,
    transform: [{ scale: 1.4 }],
  },
  glowTopRight: {
    top: -50,
    right: -50,
  },
  glowTopLeft: {
    top: -50,
    left: -50,
  },
  glowBottomRight: {
    bottom: -50,
    right: -50,
  },
  glowCenter: {
    top: '25%',
    left: '25%',
  },
});
