import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { StyleSheet, ViewProps } from 'react-native';

export type CardProps = ViewProps & {
  padding?: number;
  radius?: number;
};

export function Card({ style, padding = 16, radius = 16, children, ...rest }: CardProps) {
  return (
    <ThemedView
      style={[
        styles.card,
        {
          paddingHorizontal: padding,
          paddingVertical: padding,
          borderRadius: radius,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
});
