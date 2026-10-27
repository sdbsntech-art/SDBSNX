import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { VIDEOS_DATA } from '../data/videosData';
import { COURSES_DATA } from '../data/coursesData';
import { FAQ_DATA } from '../data/faqData';
import { LIBRARY_DATA } from '../data/libraryData';
import { Search, X, Video, BookOpen, GraduationCap, HelpCircle, ArrowRight, Shield, Rocket } from 'lucide-react';

export default function QuickSearchModal() {
  const { isSearchOpen, setIsSearchOpen, theme, setActiveVideo, setCurrentTab, setSelectedCycle } = useApp();
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];

    const q = query.toLowerCase();
    const results = [];

    // Check Cybersecurite
    if ('cybersécurité'.includes(q) || 'cybersecurite'.includes(q) || 'sécurité'.includes(q) || 'hacking'.includes(q) || 'pentest'.includes(q) || 'owasp'.includes(q) || 'wireshark'.includes(q) || 'crypto'.includes(q) || 'cdp'.includes(q)) {
      results.push({
        type: 'cyber',
        id: 'cyber-hub',
        title: 'Ressources en Cybersécurité & Normes CDP',
        subtitle: 'Pôle Cybersécurité • Hacking Éthique, Hardening & Réseaux',
        icon: Shield
      });
    }

    // Check Entrepreneuriat
    if ('entrepreneuriat'.includes(q) || 'entrepreunariat'.includes(q) || 'startup'.includes(q) || 'pitch'.includes(q) || 'business'.includes(q) || 'apix'.includes(q) || 'ninea'.includes(q) || 'financement'.includes(q)) {
      results.push({
        type: 'startup',
        id: 'startup-hub',
        title: 'Entrepreneuriat Tech & Création de Startups',
        subtitle: 'Pôle Innovation • BMC, Statuts Juridiques Sénégal & Financements',
        icon: Rocket
      });
    }

    // Search in Videos
    VIDEOS_DATA.forEach((v) => {
      if (v.title.toLowerCase().includes(q) || v.matiere.toLowerCase().includes(q)) {
        results.push({
          type: 'video',
          id: `vid-${v.id}`,
          title: v.title,
          subtitle: `Vidéo • ${v.matiereLabel}`,
          data: v,
          icon: Video
        });
      }
    });

    // Search in Courses (L1, L2, L3)
    ['L1', 'L2', 'L3'].forEach((lic) => {
      const cycle = COURSES_DATA[lic];
      cycle.semestres.forEach((sem) => {
        sem.modules.forEach((mod) => {
          if (mod.title.toLowerCase().includes(q)) {
            results.push({
              type: 'course',
              id: `course-${mod.id}`,
              title: mod.title,
              subtitle: `${cycle.cycle} • ${sem.name}`,
              cycleId: lic,
              icon: GraduationCap
            });
          }
          mod.lessons.forEach((les, idx) => {
            if (les.title.toLowerCase().includes(q)) {
              results.push({
                type: 'lesson',
                id: `les-${mod.id}-${idx}`,
                title: les.title,
                subtitle: `${cycle.cycle} • ${mod.title}`,
                cycleId: lic,
                icon: BookOpen
              });
            }
          });
        });
      });
    });

    // Search in FAQ
    FAQ_DATA.forEach((item) => {
      if (item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q)) {
        results.push({
          type: 'faq',
          id: item.id,
          title: item.question,
          subtitle: `FAQ • ${item.category}`,
          icon: HelpCircle
        });
      }
    });

    // Search in Library
    LIBRARY_DATA.forEach((doc) => {
      if (doc.title.toLowerCase().includes(q) || doc.description.toLowerCase().includes(q)) {
        results.push({
          type: 'library',
          id: doc.id,
          title: doc.title,
          subtitle: `Bibliothèque • ${doc.category}`,
          icon: BookOpen
        });
      }
    });

    return results.slice(0, 20); // Top 20 results
  }, [query]);

  if (!isSearchOpen) return null;

  const handleSelectResult = (res) => {
    setIsSearchOpen(false);
    setQuery('');
    if (res.type === 'video') {
      setActiveVideo(res.data);
    } else if (res.type === 'course' || res.type === 'lesson') {
      setSelectedCycle(res.cycleId);
      setCurrentTab('licence');
    } else if (res.type === 'cyber') {
      setCurrentTab('cybersecurite');
    } else if (res.type === 'startup') {
      setCurrentTab('entrepreneuriat');
    } else if (res.type === 'faq') {
      setCurrentTab('faq');
    } else if (res.type === 'library') {
      setCurrentTab('bibliotheque');
    }
  };

  return (
    <View style={styles.overlay}>
      <TouchableOpacity 
        style={styles.backdrop} 
        activeOpacity={1} 
        onPress={() => setIsSearchOpen(false)} 
      />
      
      <View style={[styles.modalBox, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
        {/* Search Header */}
        <View style={[styles.searchBar, { borderBottomColor: theme.border }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <img 
              src="/sdbsnx-logo.png" 
              alt="SDBSNX" 
              style={{ height: 26, width: 'auto', borderRadius: 4, background: '#FFFFFF', padding: '1px 4px' }} 
            />
            <View style={{ width: 1, height: 16, backgroundColor: theme.border }} />
            <img 
              src="/unchk-uvs-logo.png" 
              alt="UNCHK" 
              style={{ height: 26, width: 'auto', borderRadius: 4, background: '#FFFFFF', padding: '1px 4px' }} 
            />
          </View>
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Rechercher sur SDBSNX (ex: JavaScript, SQL, L2, PHP)..."
            placeholderTextColor={theme.textDim}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <X size={18} color={theme.textMuted} />
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={[styles.closeEscBadge, { borderColor: theme.border, backgroundColor: theme.bgCard }]}
            onPress={() => setIsSearchOpen(false)}
          >
            <Text style={[styles.closeEscText, { color: theme.textDim }]}>ESC</Text>
          </TouchableOpacity>
        </View>

        {/* Results List */}
        <ScrollView style={styles.resultsScroll} contentContainerStyle={styles.resultsContent}>
          {query.trim().length < 2 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateTitle, { color: theme.textMuted }]}>
                Tapez au moins 2 caractères pour rechercher
              </Text>
              <View style={styles.suggestionsRow}>
                {['JavaScript', 'HTML5', 'SQL', 'Python', 'Licence 2', 'UVS'].map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={[styles.tagPill, { backgroundColor: theme.bgCard, borderColor: theme.border }]}
                    onPress={() => setQuery(tag)}
                  >
                    <Text style={[styles.tagText, { color: theme.primary }]}>{tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : searchResults.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateTitle, { color: theme.textMuted }]}>
                Aucun résultat pour "{query}"
              </Text>
              <Text style={[styles.emptyStateSub, { color: theme.textDim }]}>
                Essayez d'autres mots-clés ou consultez la vidéothèque complète.
              </Text>
            </View>
          ) : (
            searchResults.map((res) => {
              const Icon = res.icon;
              return (
                <TouchableOpacity
                  key={res.id}
                  style={[styles.resultItem, { borderBottomColor: theme.border }]}
                  onPress={() => handleSelectResult(res)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconCircle, { backgroundColor: theme.primaryGlow }]}>
                    <Icon size={18} color={theme.primary} />
                  </View>
                  <View style={styles.resultTextCol}>
                    <Text style={[styles.resultTitle, { color: theme.text }]} numberOfLines={1}>
                      {res.title}
                    </Text>
                    <Text style={[styles.resultSubtitle, { color: theme.textMuted }]}>
                      {res.subtitle}
                    </Text>
                  </View>
                  <ArrowRight size={16} color={theme.textDim} />
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 16,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(8px)',
  },
  modalBox: {
    width: '100%',
    maxWidth: 680,
    maxHeight: '80vh',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    zIndex: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    outlineStyle: 'none',
  },
  closeEscBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  closeEscText: {
    fontSize: 11,
    fontWeight: '700',
  },
  resultsScroll: {
    maxHeight: 480,
  },
  resultsContent: {
    paddingVertical: 8,
  },
  emptyState: {
    padding: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
  },
  emptyStateSub: {
    fontSize: 13,
    textAlign: 'center',
  },
  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  tagPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    gap: 14,
    borderBottomWidth: 1,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultTextCol: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  resultSubtitle: {
    fontSize: 12,
  }
});
