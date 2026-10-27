import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { FAQ_DATA } from '../data/faqData';
import BackToHomeBar from '../components/BackToHomeBar';
import { HelpCircle, ChevronDown, ChevronUp, Search, Sparkles, MessageCircleQuestion } from 'lucide-react';

export default function FAQView() {
  const { theme, setCurrentTab } = useApp();
  const [openItems, setOpenItems] = useState({ 'faq-1': true }); // First open by default
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  const categories = useMemo(() => {
    const cats = ['all'];
    FAQ_DATA.forEach((item) => {
      if (!cats.includes(item.category)) cats.push(item.category);
    });
    return cats;
  }, []);

  const filteredFaq = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      if (selectedCat !== 'all' && item.category !== selectedCat) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q);
      }
      return true;
    });
  }, [selectedCat, searchQuery]);

  const toggleAccordion = (id) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View style={styles.container}>
      {/* Back to Home Navigation Bar */}
      <BackToHomeBar 
        currentPageTitle="Foire Aux Questions & Méthodologie" 
        breadcrumbCategory="Aide & Guide UNCHK" 
      />

      {/* Header */}
      <View style={styles.headerArea}>
        <View style={[styles.headerBadge, { backgroundColor: theme.bgCard, borderColor: theme.border, borderWidth: 1 }]}>
          <img 
            src="/sdbsnx-logo.png" 
            alt="SDBSNX" 
            style={{ height: 18, width: 'auto', borderRadius: 4, background: '#FFFFFF', padding: '1px 3px' }} 
          />
          <View style={{ width: 1, height: 14, backgroundColor: theme.border }} />
          <img 
            src="/unchk-uvs-logo.png" 
            alt="UNCHK" 
            style={{ height: 18, width: 'auto', borderRadius: 4, background: '#FFFFFF', padding: '1px 3px' }} 
          />
          <Text style={[styles.headerBadgeText, { color: theme.primary }]}>SDBSNX × UNCHK • CONSEILS & FAQ</Text>
        </View>
        <Text style={[styles.pageTitle, { color: theme.text }]}>
          Foire Aux Questions & Méthodologie UVS
        </Text>
        <Text style={[styles.pageDesc, { color: theme.textMuted }]}>
          Toutes les réponses à vos questions pour réussir brillamment vos études en informatique et vos examens universitaires.
        </Text>

        {/* Search */}
        <View style={[styles.searchBox, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
          <Search size={18} color={theme.textDim} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Rechercher une question (ex: concours, examens, gratuit, hors-ligne)..."
            placeholderTextColor={theme.textDim}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Category Filters */}
        <View style={styles.catChipsWrap}>
          {categories.map((c) => {
            const isSel = selectedCat === c;
            return (
              <TouchableOpacity
                key={c}
                style={[
                  styles.catChip,
                  { borderColor: theme.border, backgroundColor: isSel ? theme.primary : theme.bgElevated }
                ]}
                onPress={() => setSelectedCat(c)}
                activeOpacity={0.8}
              >
                <Text style={[styles.catChipText, { color: isSel ? '#FFF' : theme.textMuted }]}>
                  {c === 'all' ? 'Toutes les questions' : c}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Accordion List */}
      <View style={styles.faqList}>
        {filteredFaq.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>Aucune réponse correspondante</Text>
            <Text style={[styles.emptyDesc, { color: theme.textMuted }]}>
              Vous pouvez poser directement votre question dans l'espace discussion de la communauté !
            </Text>
            <TouchableOpacity
              style={[styles.forumLinkBtn, { backgroundColor: theme.primary }]}
              onPress={() => setCurrentTab('forum')}
            >
              <Text style={styles.forumLinkText}>Poser ma question sur le forum</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredFaq.map((item) => {
            const isOpen = !!openItems[item.id];
            return (
              <View 
                key={item.id} 
                style={[
                  styles.accordionItem, 
                  { backgroundColor: theme.bgElevated, borderColor: isOpen ? theme.borderHover : theme.border }
                ]}
              >
                <TouchableOpacity
                  style={styles.accordionHeader}
                  onPress={() => toggleAccordion(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.questionCol}>
                    <View style={[styles.categoryTag, { backgroundColor: theme.primaryGlow }]}>
                      <Text style={[styles.categoryTagText, { color: theme.primary }]}>{item.category}</Text>
                    </View>
                    <Text style={[styles.questionText, { color: theme.text }]}>
                      {item.question}
                    </Text>
                  </View>

                  <View style={[styles.arrowCircle, { backgroundColor: theme.bgCard }]}>
                    {isOpen ? (
                      <ChevronUp size={18} color={theme.primary} />
                    ) : (
                      <ChevronDown size={18} color={theme.textDim} />
                    )}
                  </View>
                </TouchableOpacity>

                {isOpen && (
                  <View style={[styles.accordionBody, { borderTopColor: theme.border }]}>
                    <Text style={[styles.answerText, { color: theme.textMuted }]}>
                      {item.answer}
                    </Text>
                  </View>
                )}
              </View>
            );
          })
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 960,
    marginHorizontal: 'auto',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 60,
  },
  headerArea: {
    alignItems: 'center',
    textAlign: 'center',
    gap: 12,
    marginBottom: 40,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  headerBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center',
    '@media (max-width: 640px)': {
      fontSize: 24,
    }
  },
  pageDesc: {
    fontSize: 15,
    maxWidth: 680,
    textAlign: 'center',
    lineHeight: 22,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
    maxWidth: 680,
    width: '100%',
    marginVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    outlineStyle: 'none',
  },
  catChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  catChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  faqList: {
    gap: 16,
  },
  accordionItem: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    gap: 16,
  },
  questionCol: {
    flex: 1,
    gap: 6,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryTagText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accordionBody: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  answerText: {
    fontSize: 14,
    lineHeight: 22,
  },
  emptyCard: {
    padding: 40,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptyDesc: {
    fontSize: 14,
    textAlign: 'center',
  },
  forumLinkBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 6,
  },
  forumLinkText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  }
});
