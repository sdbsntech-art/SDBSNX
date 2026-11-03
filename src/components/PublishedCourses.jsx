import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ExternalLink, GraduationCap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getSupabaseClient } from '../lib/supabase';

export default function PublishedCourses() {
  const { theme, selectedCycle } = useApp();
  const [courses, setCourses] = useState([]);
  const [resources, setResources] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const client = await getSupabaseClient();
        const { data: courseRows, error: coursesError } = await client
          .from('courses')
          .select('id,title,description,level')
          .eq('published', true)
          .eq('level', selectedCycle)
          .order('created_at', { ascending: false })
          .limit(50);
        if (coursesError) throw coursesError;

        const courseIds = (courseRows || []).map((course) => course.id);
        let resourceRows = [];
        if (courseIds.length) {
          const { data, error: resourcesError } = await client
            .from('resources')
            .select('id,course_id,title,type,url,content,position')
            .eq('published', true)
            .in('course_id', courseIds)
            .order('position')
            .limit(200);
          if (resourcesError) throw resourcesError;
          resourceRows = data || [];
        }
        if (active) {
          setCourses(courseRows || []);
          setResources(resourceRows);
          setError('');
        }
      } catch (loadError) {
        if (import.meta.env.DEV) console.error('Unable to load published courses:', loadError);
        if (active) setError('Les nouveaux cours publiés ne peuvent pas être chargés pour le moment.');
      }
    };
    void load();
    return () => { active = false; };
  }, [selectedCycle]);

  if (!courses.length && !error) return null;

  return (
    <View style={styles.section}>
      <View style={[styles.heading, { borderColor: theme.border }]}>
        <GraduationCap size={19} color={theme.primary} />
        <Text style={[styles.headingText, { color: theme.text }]}>Cours publiés par l’équipe</Text>
      </View>
      {error ? <Text style={[styles.error, { color: theme.textMuted }]} accessibilityRole="alert">{error}</Text> : null}
      {courses.map((course) => (
        <View key={course.id} style={[styles.course, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
          <Text style={[styles.courseTitle, { color: theme.text }]}>{course.title}</Text>
          {course.description ? <Text style={[styles.body, { color: theme.textMuted }]}>{course.description}</Text> : null}
          {resources.filter((resource) => resource.course_id === course.id).map((resource) => (
            <View key={resource.id} style={[styles.resource, { borderTopColor: theme.border }]}>
              <View style={styles.resourceText}>
                <Text style={[styles.resourceTitle, { color: theme.text }]}>{resource.title}</Text>
                {resource.content ? <Text style={[styles.body, { color: theme.textMuted }]}>{resource.content}</Text> : null}
              </View>
              {resource.url && (
                <TouchableOpacity
                  accessibilityRole="link"
                  accessibilityLabel={`Ouvrir ${resource.title}`}
                  style={[styles.link, { backgroundColor: theme.primaryGlow }]}
                  onPress={() => window.open(resource.url, '_blank', 'noopener,noreferrer')}
                >
                  <ExternalLink size={16} color={theme.primary} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { width: '100%', gap: 12, marginBottom: 22 },
  heading: { minHeight: 40, flexDirection: 'row', alignItems: 'center', gap: 9, borderBottomWidth: 1, paddingBottom: 9 },
  headingText: { fontSize: 16, fontWeight: '800' },
  course: { width: '100%', gap: 8, borderWidth: 1, borderRadius: 14, padding: 16 },
  courseTitle: { fontSize: 15, fontWeight: '800' },
  body: { fontSize: 13, lineHeight: 20 },
  resource: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, borderTopWidth: 1, paddingTop: 10, marginTop: 3 },
  resourceText: { flex: 1, minWidth: 0, gap: 4 },
  resourceTitle: { fontSize: 13, fontWeight: '700' },
  link: { width: 38, height: 38, flex: '0 0 auto', alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
  error: { fontSize: 12, lineHeight: 18 },
});
