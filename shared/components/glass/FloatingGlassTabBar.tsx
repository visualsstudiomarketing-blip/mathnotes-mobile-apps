import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LiquidGlassTokens } from './LiquidGlassTokens';

interface FloatingGlassTabBarProps extends BottomTabBarProps {
  activeAccentColor?: string;
}

export const FloatingGlassTabBar: React.FC<FloatingGlassTabBarProps> = ({
  state,
  descriptors,
  navigation,
  activeAccentColor = LiquidGlassTokens.colors.accentCyan,
}) => {
  return (
    <View style={styles.floatingContainer} pointerEvents="box-none">
      <LinearGradient
        colors={[
          LiquidGlassTokens.colors.specularTop,
          LiquidGlassTokens.colors.specularMid,
          LiquidGlassTokens.colors.specularBottom,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.specularBorder}
      >
        <View style={styles.glassDock}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const Icon = options.tabBarIcon;

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                activeOpacity={0.7}
                style={[
                  styles.tabButton,
                  isFocused && styles.tabButtonActive,
                ]}
              >
                {Icon && (
                  <Icon
                    color={isFocused ? activeAccentColor : '#64748B'}
                    size={20}
                    focused={isFocused}
                  />
                )}
                {isFocused && (
                  <View
                    style={[
                      styles.activePillIndicator,
                      { backgroundColor: activeAccentColor },
                      LiquidGlassTokens.shadows.neonGlow(activeAccentColor),
                    ]}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 18,
    right: 18,
    alignItems: 'center',
    zIndex: 999,
  },
  specularBorder: {
    padding: 1.2,
    borderRadius: 36,
    width: '100%',
    maxWidth: 420,
    ...LiquidGlassTokens.shadows.glassElevated,
  },
  glassDock: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(9, 13, 22, 0.88)',
    borderRadius: 35,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    position: 'relative',
    minWidth: 48,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  activePillIndicator: {
    position: 'absolute',
    bottom: -3,
    width: 14,
    height: 3,
    borderRadius: 1.5,
  },
});
