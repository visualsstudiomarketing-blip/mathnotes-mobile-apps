import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface KaTeXMathProps {
  mathText: string;
  fontSize?: number;
  color?: string;
  isBlock?: boolean;
}

export const KaTeXMath: React.FC<KaTeXMathProps> = ({
  mathText,
  fontSize = 14,
  color = '#F8FAFC',
  isBlock = false,
}) => {
  // Format cleaned mathematical characters for mobile text view
  const formatted = mathText
    .replace(/\\lim_\{([^}]+)\}/g, 'lim ($1)')
    .replace(/\\to/g, '→')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 / $2)')
    .replace(/\\sin/g, 'sin')
    .replace(/\\cos/g, 'cos')
    .replace(/\\tan/g, 'tan')
    .replace(/\\theta/g, 'θ')
    .replace(/\\delta/g, 'δ')
    .replace(/\\epsilon/g, 'ε')
    .replace(/\\infty/g, '∞')
    .replace(/\\le/g, '≤')
    .replace(/\\ge/g, '≥')
    .replace(/\\pm/g, '±')
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/\\left|\\right/g, '')
    .replace(/\\implies/g, '⟹');

  return (
    <View style={[styles.container, isBlock && styles.blockContainer]}>
      <Text style={[styles.mathText, { fontSize, color }, isBlock && styles.blockText]}>
        {formatted}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  blockContainer: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginVertical: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#38BDF8',
    justifyContent: 'center',
  },
  mathText: {
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  blockText: {
    fontWeight: '700',
    color: '#38BDF8',
  },
});
