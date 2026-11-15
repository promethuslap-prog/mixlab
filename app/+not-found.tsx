import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { font } from '@/theme/tokens';

export default function NotFound() {
  const { colors } = useTheme();
  return (
    <>
      <Stack.Screen options={{ title: 'Not found', headerShown: false }} />
      <View style={[styles.box, { backgroundColor: colors.bg }]}>
        <Text style={[styles.title, { color: colors.text }]}>That screen is not in Mix Lab.</Text>
        <Link href="/" style={[styles.link, { color: colors.accent }]}>
          Back home
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontFamily: font.semibold, fontSize: 18, textAlign: 'center' },
  link: { marginTop: 12, fontFamily: font.semibold, fontSize: 16 },
});
