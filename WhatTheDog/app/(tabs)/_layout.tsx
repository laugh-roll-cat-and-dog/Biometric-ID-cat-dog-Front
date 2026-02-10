import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      initialRouteName="search"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].icon,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarItemStyle: {
          paddingVertical: 6,
        },
        tabBarStyle: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 12,
          borderRadius: 18,
          borderTopWidth: 0,
          backgroundColor:
            Platform.OS === 'ios'
              ? 'transparent'
              : Colors[colorScheme ?? 'light'].overlay,
          overflow: 'hidden',
          elevation: 6,
          shadowColor: '#000000',
          shadowOpacity: 0.12,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
        },
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView intensity={40} tint={colorScheme === 'dark' ? 'dark' : 'light'} style={{ flex: 1 }} />
          ) : (
            <View style={{ flex: 1, backgroundColor: Colors[colorScheme ?? 'light'].overlay }} />
          ),
      }}>      
      
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="magnifyingglass" color={color} />,
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: 'Upload',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="arrow.up.doc" color={color} />,
        }}
      />      
    </Tabs>
  );
}
