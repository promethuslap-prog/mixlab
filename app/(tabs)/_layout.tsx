import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { font } from '@/theme/tokens';

function TabIcon({
  name,
  color,
  size,
}: {
  name: keyof typeof Ionicons.glyphMap;
  color: ColorValue | null | undefined;
  size: number;
}) {
  const tint = typeof color === 'string' ? color : '#7C6CFF';
  return <Ionicons name={name} color={tint} size={size} />;
}

export default function TabLayout() {
  const { colors } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.faint,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
          height: 62,
          paddingTop: 4,
        },
        tabBarLabelStyle: { fontFamily: font.semibold, fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <TabIcon name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, size }) => <TabIcon name="book" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="mixer"
        options={{
          title: 'Mix',
          tabBarIcon: ({ color, size }) => <TabIcon name="options" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="eq"
        options={{
          title: 'EQ',
          tabBarIcon: ({ color, size }) => <TabIcon name="pulse" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="glossary"
        options={{
          title: 'Glossary',
          tabBarIcon: ({ color, size }) => <TabIcon name="library" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
