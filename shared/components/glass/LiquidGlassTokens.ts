// Liquid Glass Design System Tokens
export const LiquidGlassTokens = {
  colors: {
    // Base Canvas
    canvas: '#07090E',
    canvasElevated: '#0B0F19',

    // Glass Translucent Acrylic Surfaces
    glassLight: 'rgba(255, 255, 255, 0.05)',
    glassMedium: 'rgba(15, 23, 42, 0.68)',
    glassDark: 'rgba(8, 12, 22, 0.82)',
    glassModal: 'rgba(11, 15, 25, 0.94)',

    // Specular Highlight Gradients (Top border sheen)
    specularTop: 'rgba(255, 255, 255, 0.22)',
    specularMid: 'rgba(255, 255, 255, 0.06)',
    specularBottom: 'rgba(255, 255, 255, 0.01)',

    // Neon Accents
    accentCyan: '#38BDF8',
    accentSapphire: '#2563EB',
    accentViolet: '#8B5CF6',
    accentEmerald: '#10B981',
    accentAmber: '#F59E0B',
    accentRose: '#F43F5E',

    // Ambient Aurora Underglow
    auroraCyan: 'rgba(56, 189, 248, 0.16)',
    auroraViolet: 'rgba(139, 92, 246, 0.18)',
    auroraEmerald: 'rgba(16, 185, 129, 0.12)',
    auroraRose: 'rgba(244, 63, 94, 0.12)',
  },

  radius: {
    sm: 10,
    md: 16,
    lg: 22,
    xl: 30,
    pill: 9999,
  },

  shadows: {
    glassElevated: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: 0.45,
      shadowRadius: 24,
      elevation: 10,
    },
    neonGlow: (color: string) => ({
      shadowColor: color,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 6,
    }),
  },
};
