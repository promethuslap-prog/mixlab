import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Muted, Screen, Title } from '@/components/ui';
import { glossary, searchGlossary } from '@/content/glossary';
import { useTheme } from '@/theme/ThemeProvider';
import { font } from '@/theme/tokens';

export default function GlossaryScreen() {
  const { colors } = useTheme();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<string | null>(null);
  const results = useMemo(() => searchGlossary(query), [query]);

  return (
    <Screen scroll>
      <Title>Glossary</Title>
      <Muted style={styles.lede}>{glossary.length} mixing words, in plain language.</Muted>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search gain, feedback, DI…"
        placeholderTextColor={colors.faint}
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel="Search glossary"
        style={[
          styles.search,
          { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      />
      <Text style={[styles.count, { color: colors.faint }]}>
        {results.length} {results.length === 1 ? 'term' : 'terms'}
      </Text>
      {results.length === 0 ? (
        <View style={[styles.empty, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No terms match.</Text>
          <Muted>Try “compression”, “phase”, or “LUFS”.</Muted>
        </View>
      ) : (
        results.map((term) => {
          const expanded = open === term.id;
          return (
            <Pressable
              key={term.id}
              accessibilityRole="button"
              accessibilityState={{ expanded }}
              onPress={() => setOpen(expanded ? null : term.id)}
              style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View style={styles.rowHead}>
                <Text style={[styles.term, { color: colors.text }]}>{term.term}</Text>
                <Text style={[styles.chevron, { color: colors.faint }]}>{expanded ? '–' : '+'}</Text>
              </View>
              {term.aka ? <Text style={[styles.aka, { color: colors.accent }]}>{term.aka}</Text> : null}
              {expanded ? (
                <View style={styles.body}>
                  <Text style={[styles.definition, { color: colors.text }]}>{term.definition}</Text>
                  <Text style={[styles.why, { color: colors.muted }]}>{term.why}</Text>
                </View>
              ) : null}
            </Pressable>
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  lede: { marginTop: 8, marginBottom: 12 },
  search: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontFamily: font.medium,
    fontSize: 16,
  },
  count: { fontFamily: font.medium, fontSize: 12, marginTop: 10, marginBottom: 8 },
  empty: { borderRadius: 16, borderWidth: 1, padding: 16 },
  emptyTitle: { fontFamily: font.semibold, fontSize: 16, marginBottom: 4 },
  row: { borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 8 },
  rowHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  term: { fontFamily: font.semibold, fontSize: 16, flex: 1 },
  chevron: { fontFamily: font.semibold, fontSize: 20 },
  aka: { fontFamily: font.medium, fontSize: 12, marginTop: 3 },
  body: { marginTop: 8 },
  definition: { fontFamily: font.regular, fontSize: 15, lineHeight: 22 },
  why: { fontFamily: font.regular, fontSize: 14, lineHeight: 20, marginTop: 6 },
});
