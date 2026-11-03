import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ExternalLink, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getSupabaseClient } from '../lib/supabase';

export default function PublishedLibraryItems() {
  const { theme } = useApp();
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getSupabaseClient()
      .then(async (client) => {
        const { data, error: queryError } = await client
          .from('library_items')
          .select('id,title,author,description,category,file_path,external_url,created_at')
          .eq('published', true)
          .order('created_at', { ascending: false })
          .limit(100);
        if (queryError) throw queryError;
        const publishedItems = (data || []).map((item) => ({
          ...item,
          downloadUrl: item.file_path
            ? client.storage.from('library').getPublicUrl(item.file_path).data.publicUrl
            : item.external_url,
        }));
        return publishedItems;
      })
      .then((publishedItems) => {
        if (active) setItems(publishedItems);
      })
      .catch((loadError) => {
        if (import.meta.env.DEV) console.error('Unable to load published library items:', loadError);
        if (active) setError('Les nouveaux ouvrages publiés ne peuvent pas être chargés pour le moment.');
      });

    return () => { active = false; };
  }, []);

  if (!items.length && !error) return null;

  return (
    <View style={styles.section}>
      <View style={[styles.heading, { borderColor: theme.border }]}>
        <FileText size={19} color={theme.primary} />
        <Text style={[styles.headingText, { color: theme.text }]}>Nouvelles ressources publiées</Text>
      </View>
      {error ? <Text style={[styles.body, { color: theme.textMuted }]} accessibilityRole="alert">{error}</Text> : null}
      {items.map((item) => (
        <View key={item.id} style={[styles.card, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
          <View style={styles.copy}>
            <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
            <Text style={[styles.body, { color: theme.textMuted }]}>{item.category}{item.author ? ` · ${item.author}` : ''}</Text>
            {item.description ? <Text style={[styles.body, { color: theme.textMuted }]}>{item.description}</Text> : null}
          </View>
          {item.downloadUrl && (
            <TouchableOpacity
              accessibilityRole="link"
              accessibilityLabel={`Consulter ${item.title}`}
              style={[styles.link, { backgroundColor: theme.primaryGlow }]}
              onPress={() => window.open(item.downloadUrl, '_blank', 'noopener,noreferrer')}
            >
              <ExternalLink size={16} color={theme.primary} />
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { width: '100%', gap: 12, marginTop: 24 },
  heading: { minHeight: 40, flexDirection: 'row', alignItems: 'center', gap: 9, borderBottomWidth: 1, paddingBottom: 9 },
  headingText: { fontSize: 16, fontWeight: '800' },
  card: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderRadius: 14, padding: 15 },
  copy: { flex: 1, minWidth: 0, gap: 5 },
  title: { fontSize: 14, fontWeight: '800', lineHeight: 20 },
  body: { fontSize: 12, lineHeight: 19 },
  link: { width: 38, height: 38, flex: '0 0 auto', alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
});
