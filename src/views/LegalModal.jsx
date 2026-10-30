import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { X, ShieldCheck, Scale, FileText } from 'lucide-react';

export default function LegalModal() {
  const { activeLegal, setActiveLegal, theme } = useApp();

  useEffect(() => {
    if (!activeLegal) return;

    const previousOverflow = document.body.style.overflow;
    const previousScrollBehavior = document.documentElement.style.scrollBehavior;
    window.scrollTo({ top: 0, behavior: 'auto' });
    document.body.style.overflow = 'hidden';
    document.documentElement.style.scrollBehavior = 'auto';

    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
    };
  }, [activeLegal]);

  if (!activeLegal) return null;

  const contentMap = {
    mentions: {
      title: 'Mentions Légales',
      icon: Scale,
      sections: [
        {
          h: '1. Éditeur de la Plateforme',
          p: 'La plateforme SDBSN-IDA (IDA COURS) est un projet éducatif libre et indépendant créé pour soutenir les étudiants en Informatique et Développement d\'Applications (Licence 1, 2 et 3) de l\'Université Virtuelle du Sénégal (UNCHK) et les passionnés de technologies en Afrique de l\'Ouest.'
        },
        {
          h: '2. Hébergement & Infrastructure',
          p: 'Le service est déployé via une infrastructure cloud distribuée mondialement assurant une haute disponibilité, une faible latence et une compatibilité PWA moderne.'
        },
        {
          h: '3. Propriété Intellectuelle & Crédits Pédagogiques',
          p: 'Les cours vidéo référencés sont hébergés sur YouTube par leurs auteurs respectifs (notamment Grafikart.fr et formateurs universitaires) conformément aux conditions d\'utilisation de YouTube. Tous les droits d\'auteur restent la propriété intégrale de leurs créateurs.'
        },
        {
          h: '4. Contact & Siège',
          p: 'Campus et coordination : Dakar, Pikine, Dalifort • République du Sénégal. E-mail : sdbsntech@gmail.com'
        }
      ]
    },
    politique: {
      title: 'Politique de Confidentialité',
      icon: ShieldCheck,
      sections: [
        {
          h: '1. Respect de la Vie Privée',
          p: 'La plateforme ne requiert aucune inscription obligatoire ni carte bancaire. Nous ne commercialisons aucune donnée personnelle.'
        },
        {
          h: '2. Données Locales (LocalStorage)',
          p: 'Vos préférences d\'affichage (thème sombre/clair), votre progression dans les modules (leçons cochées), vos favoris de vidéos et vos notes d\'études sont stockés exclusivement dans votre navigateur local.'
        },
        {
          h: '3. Progressive Web App (PWA)',
          p: 'Le Service Worker met en cache les fichiers statiques de l\'application pour permettre un chargement instantané et une consultation hors ligne sans tracer votre activité.'
        },
        {
          h: '4. Vos Droits',
          p: 'Conformément aux réglementations sur la protection des données personnelles, vous pouvez à tout moment effacer vos données locales en vidant le cache de votre navigateur.'
        }
      ]
    },
    conditions: {
      title: 'Conditions d\'Utilisation',
      icon: FileText,
      sections: [
        {
          h: '1. Acceptation des Conditions',
          p: 'En accédant à la plateforme IDA COURS, vous acceptez d\'utiliser les ressources à des fins d\'apprentissage personnel, académique ou de perfectionnement professionnel.'
        },
        {
          h: '2. Utilisation Éducative',
          p: 'Les documents, tutoriels et exercices sont mis à disposition gratuitement. La reproduction commerciale non autorisée des contenus de nos partenaires formateurs est interdite.'
        },
        {
          h: '3. Disponibilité du Service',
          p: 'Nous nous efforçons de maintenir un accès ininterrompu 24h/24 et 7j/7. Des opérations ponctuelles de maintenance peuvent être effectuées pour améliorer la plateforme.'
        }
      ]
    }
  };

  const activeData = contentMap[activeLegal] || contentMap.mentions;
  const Icon = activeData.icon;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity 
        style={styles.backdrop} 
        activeOpacity={1} 
        onPress={() => setActiveLegal(null)} 
      />

      <View style={[styles.modalBox, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
        <View style={[styles.headerRow, { borderBottomColor: theme.border }]}>
          <View style={styles.headerTitleWrap}>
            <img 
              src="/sdbsnx-logo.png" 
              alt="SDBSNX" 
              style={{ height: 24, width: 'auto', borderRadius: 4, background: '#FFFFFF', padding: '1px 3px' }} 
            />
            <View style={{ width: 1, height: 16, backgroundColor: theme.border }} />
            <img 
              src="/unchk-uvs-logo.png" 
              alt="UNCHK" 
              style={{ height: 24, width: 'auto', borderRadius: 4, background: '#FFFFFF', padding: '1px 3px' }} 
            />
            <Text style={[styles.title, { color: theme.text }]}>{activeData.title}</Text>
          </View>
          <TouchableOpacity 
            style={[styles.closeBtn, { backgroundColor: theme.bgCard, borderColor: theme.border }]}
            onPress={() => setActiveLegal(null)}
          >
            <X size={18} color={theme.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
          {activeData.sections.map((sec, idx) => (
            <View key={idx} style={styles.secItem}>
              <Text style={[styles.secHeading, { color: theme.primary }]}>{sec.h}</Text>
              <Text style={[styles.secText, { color: theme.textMuted }]}>{sec.p}</Text>
            </View>
          ))}
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    pointerEvents: 'auto',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
  },
  modalBox: {
    position: 'relative',
    width: 'min(92vw, 640px)',
    maxWidth: 640,
    maxHeight: '82vh',
    minWidth: 0,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    zIndex: 10,
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 10,
    flexWrap: 'wrap',
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
    flexWrap: 'wrap',
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    minWidth: 0,
    lineHeight: 22,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  scrollArea: {
    maxHeight: 460,
  },
  scrollContent: {
    padding: 20,
    gap: 18,
    paddingBottom: 28,
  },
  secItem: {
    gap: 6,
  },
  secHeading: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },
  secText: {
    fontSize: 13,
    lineHeight: 20,
    overflowWrap: 'anywhere',
  }
});
