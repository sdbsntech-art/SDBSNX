import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BellRing } from 'lucide-react';
import { getSupabaseClient } from '../lib/supabase';
import { useApp } from '../context/AppContext';

export default function PublicAnnouncements() {
  const { theme } = useApp();
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    getSupabaseClient()
      .then((client) => client
        .from('announcements')
        .select('id,title,content,created_at')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(5))
      .then(({ data, error: queryError }) => {
        if (!active) return;
        if (queryError) {
          if (import.meta.env.DEV) console.error('Unable to load public announcements:', queryError);
          setError(true);
          return;
        }
        setAnnouncements(data || []);
      })
      .catch((requestError) => {
        if (!active) return;
        if (import.meta.env.DEV) console.error('Unable to load public announcements:', requestError);
        setError(true);
      });

    return () => { active = false; };
  }, []);

  if (!announcements.length && !error) return null;

  return (
    <View style={styles.list} accessibilityLiveRegion="polite">
      {error && (
        <Text style={[styles.error, { color: theme.textMuted }]}>
          Les annonces ne peuvent pas être chargées pour le moment.
        </Text>
      )}
      {announcements.map((announcement) => (
        <View
          key={announcement.id}
          style={[styles.card, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}
        >
          <View style={[styles.icon, { backgroundColor: theme.primaryGlow }]}>
            <BellRing size={18} color={theme.primary} />
          </View>
          <View style={styles.content}>
            <Text style={[styles.title, { color: theme.text }]}>{announcement.title}</Text>
            <Text style={[styles.body, { color: theme.textMuted }]}>{announcement.content}</Text>
            <Text style={[styles.date, { color: theme.textDim }]}>
              {new Date(announcement.created_at).toLocaleDateString('fr-FR')}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { width: '100%', gap: 10, marginBottom: 22 },
  card: { width: '100%', flexDirection: 'row', alignItems: 'flex-start', gap: 12, borderWidth: 1, borderRadius: 14, padding: 15 },
  icon: { width: 36, height: 36, flex: '0 0 auto', alignItems: 'center', justifyContent: 'center', borderRadius: 11 },
  content: { flex: 1, minWidth: 0, gap: 5 },
  title: { fontSize: 14, fontWeight: '800', lineHeight: 20 },
  body: { fontSize: 13, lineHeight: 20 },
  date: { fontSize: 11, marginTop: 2 },
  error: { fontSize: 12, lineHeight: 18 },
});
