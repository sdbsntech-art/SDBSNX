import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Mail, ShieldCheck, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LEGAL_PAGES } from '../data/legalPages';
import BackToHomeBar from '../components/BackToHomeBar';

const LOCAL_DATA_KEYS = new Set([
  'ida_theme',
  'ida_completed_lessons',
  'ida_bookmarks',
  'ida_forum_comments',
  'ida_xp',
]);
const LOCAL_DATA_PREFIXES = ['ida_note_', 'ida_watched_'];

/*
 * À faire vérifier par un juriste / à déclarer auprès de la CDP :
 * - identité, statut, adresse et responsabilité de l'éditeur ;
 * - bases légales, formalités et éventuelles déclarations/autorisation CDP ;
 * - droits concernés, procédure de demande et délais de réponse ;
 * - données de journaux, sous-traitants, lieux et durées de conservation ;
 * - conditions contractuelles applicables à l'hébergement Vercel ;
 * - mise à jour de la notice avant toute réactivation de Supabase ou traceur.
 */
export default function LegalPagesView() {
  const { theme, legalPage } = useApp();
  const page = LEGAL_PAGES[legalPage] || LEGAL_PAGES.about;

  const handleClearLocalData = () => {
    const confirmed = window.confirm(
      'Supprimer de ce navigateur les préférences, notes, favoris, progression, score et commentaires locaux de SDBSNX ? Cette action est définitive.'
    );
    if (!confirmed) return;

    const keysToRemove = Object.keys(localStorage).filter((key) => (
      LOCAL_DATA_KEYS.has(key) || LOCAL_DATA_PREFIXES.some((prefix) => key.startsWith(prefix))
    ));
    keysToRemove.forEach((key) => localStorage.removeItem(key));
    window.location.reload();
  };

  return (
    <View style={styles.container}>
      <BackToHomeBar currentPageTitle={page.title} breadcrumbCategory="Informations" />
      <View style={[styles.card, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
        <View style={[styles.notice, { backgroundColor: theme.primaryGlow, borderColor: theme.border }]}>
          <ShieldCheck size={18} color={theme.primary} />
          <Text style={[styles.noticeText, { color: theme.textMuted }]}>
            Informations de transparence à compléter et à valider avant toute conclusion juridique sur la conformité du service.
          </Text>
        </View>

        <Text style={[styles.title, { color: theme.text }]}>{page.title}</Text>
        <Text style={[styles.intro, { color: theme.textMuted }]}>{page.description}</Text>

        {page.sections.map((section) => (
          <View key={section.heading} style={[styles.section, { borderTopColor: theme.border }]}>
            <Text style={[styles.heading, { color: theme.primary }]}>{section.heading}</Text>
            {section.paragraphs.map((paragraph, index) => (
              <Text key={`${section.heading}-${index}`} style={[styles.paragraph, { color: theme.textMuted }]}>
                {paragraph}
              </Text>
            ))}
            {legalPage === 'contact' && section.heading === 'Écrire à SDBSNX' && (
              <TouchableOpacity
                accessibilityRole="link"
                onPress={() => window.location.assign('mailto:sdbsntech@gmail.com')}
                style={[styles.contactButton, { backgroundColor: theme.primary }]}
              >
                <Mail size={16} color="#FFFFFF" />
                <Text style={styles.contactButtonText}>Envoyer un e-mail</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {legalPage === 'privacy' && (
          <TouchableOpacity
            accessibilityRole="button"
            onPress={handleClearLocalData}
            style={[styles.deleteButton, { borderColor: theme.border, backgroundColor: theme.bgCard }]}
          >
            <Trash2 size={16} color={theme.text} />
            <Text style={[styles.deleteButtonText, { color: theme.text }]}>Effacer mes données locales</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  card: {
    width: '100%',
    maxWidth: 920,
    alignSelf: 'center',
    marginTop: 16,
    padding: 24,
    borderWidth: 1,
    borderRadius: 20,
    gap: 18,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderWidth: 1,
    borderRadius: 12,
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
  },
  title: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '800',
  },
  intro: {
    fontSize: 15,
    lineHeight: 23,
  },
  section: {
    borderTopWidth: 1,
    paddingTop: 18,
    gap: 10,
  },
  heading: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
  },
  contactButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 10,
    marginTop: 4,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  deleteButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    borderRadius: 10,
  },
  deleteButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
