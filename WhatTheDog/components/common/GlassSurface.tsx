import { BlurView } from 'expo-blur';
import React from 'react';
import { Platform, StyleSheet, View, type ViewProps } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type GlassSurfaceProps = ViewProps & {
  intensity?: number;
  radius?: number;
};

export function GlassSurface({ style, intensity = 30, radius = 16, children, ...rest }: GlassSurfaceProps) {
  const scheme = useColorScheme() ?? 'light';

  if (Platform.OS === 'ios') {
    return (
      <BlurView
        intensity={intensity}
        tint={scheme === 'dark' ? 'dark' : 'light'}
        style={[styles.container, { borderRadius: radius }, style]}
        {...rest}
      >
        {children}
      </BlurView>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius: radius,
          backgroundColor: Colors[scheme].overlay,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
