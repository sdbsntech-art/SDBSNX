import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { FORMATEURS_DATA } from '../data/formateursData';
import BackToHomeBar from '../components/BackToHomeBar';
import { Users, ExternalLink, Award, Globe, BookOpen, Sparkles, Youtube, Heart, Star } from 'lucide-react';

export default function FormateursView() {
  const { theme } = useApp();

  return (
    <View style={styles.container}>
      {/* Back to Home Navigation Bar */}
      <BackToHomeBar 
        currentPageTitle="Formateurs d'Excellence & Partenaires" 
        breadcrumbCategory="Écosystème Pédagogique" 
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
          <Text style={[styles.headerBadgeText, { color: theme.primary }]}>SDBSNX × UNCHK • ÉCOSYSTÈME FORMATEURS</Text>
        </View>
        <Text style={[styles.pageTitle, { color: theme.text }]} className="fluid-page-title">
          Nos Formateurs & Partenaires d'Excellence
        </Text>
        <Text style={[styles.pageDesc, { color: theme.textMuted }]}>
          L'alliance prestigieuse du monde académique sénégalais (UNCHK, Force-N, ODC) et des plus grands formateurs web francophones et mondiaux.
        </Text>
      </View>

      {/* Featured Honor Banner: Grafikart */}
      <View style={[styles.grafikartHonorCard, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
        <View style={styles.honorHeaderRow}>
          <View style={[styles.honorTag, { backgroundColor: theme.primaryGlow, borderColor: theme.border }]}>
            <Star size={14} color={theme.accent} fill={theme.accent} />
            <Text style={styles.honorTagText}>MENTOR D'HONNEUR & RÉFÉRENCE WEBDESIGN / DEV</Text>
          </View>
          <View style={styles.heartChip}>
            <Heart size={14} color={theme.accent} fill={theme.accent} />
            <Text style={{ fontSize: 12, fontWeight: '700', color: theme.text }}>Remerciements Spéciaux</Text>
          </View>
        </View>

        <Text style={[styles.honorTitle, { color: theme.text }]}>
          Jonathan Boyer — <Text style={{ color: theme.primary }}>Grafikart.fr</Text>
        </Text>

        <Text style={[styles.honorMessage, { color: theme.textMuted }]}>
          Formateur d'exception dont la générosité, la rigueur et l'incroyable pédagogie ont permis au développeur et fondateur de SDBSNX d'acquérir les compétences clés du métier. 
          Nous tenons à lui exprimer une profonde reconnaissance pour son accord bienveillant qui autorise l'utilisation de ses vidéos gratuites au bénéfice de l'ensemble des étudiants de la filière IDA.
        </Text>

        <View style={styles.honorActionsRow}>
          <TouchableOpacity
            style={[styles.honorBtn, { backgroundColor: theme.primary }]}
            onPress={() => window.open('https://grafikart.fr', '_blank')}
            activeOpacity={0.8}
          >
            <Globe size={16} color="#FFFFFF" />
            <Text style={styles.honorBtnText}>Visiter le site officiel Grafikart.fr</Text>
            <ExternalLink size={14} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.honorBtnYt, { backgroundColor: theme.primaryGlow, borderColor: theme.primary }]}
            onPress={() => window.open('https://www.youtube.com/@grafikart', '_blank')}
            activeOpacity={0.8}
          >
            <Youtube size={16} color={theme.primary} />
            <Text style={[styles.honorBtnYtText, { color: theme.primary }]}>Chaîne YouTube @grafikart (350K+ abonnés)</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Grid of Partners */}
      <View style={styles.partnersGrid}>
        {FORMATEURS_DATA.map((formateur) => (
          <View 
            key={formateur.id} 
            style={[styles.partnerCard, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}
          >
            <View style={styles.topBadgeRow}>
              <View style={[styles.badgePill, { backgroundColor: theme.primaryGlow }]}>
                <Award size={13} color={theme.primary} />
                <Text style={[styles.badgeText, { color: theme.primary }]}>{formateur.badge}</Text>
              </View>
            </View>

            <Text style={[styles.partnerName, { color: theme.text }]}>{formateur.name}</Text>
            <Text style={[styles.partnerRole, { color: theme.secondary }]}>{formateur.role}</Text>
            <Text style={[styles.partnerOrg, { color: theme.textDim }]}>{formateur.organization}</Text>

            <Text style={[styles.partnerDesc, { color: theme.textMuted }]}>
              {formateur.description}
            </Text>

            {/* Topics Covered */}
            <View style={styles.topicsWrap}>
              {formateur.topics.map((t, idx) => (
                <View key={idx} style={[styles.topicChip, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
                  <Text style={[styles.topicText, { color: theme.text }]}>{t}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.visitSiteBtn, { borderColor: theme.border, backgroundColor: theme.bgCard }]}
              onPress={() => window.open(formateur.url, '_blank')}
              activeOpacity={0.8}
            >
              <Text style={[styles.visitSiteText, { color: theme.primary }]}>Consulter la plateforme officielle</Text>
              <ExternalLink size={14} color={theme.primary} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 1320,
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
    marginBottom: 36,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: '100%',
  },
  headerBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    flexShrink: 1,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  pageDesc: {
    fontSize: 15,
    maxWidth: 780,
    lineHeight: 22,
    textAlign: 'center',
  },
  grafikartHonorCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    gap: 14,
    marginBottom: 40,
    boxShadow: '0 8px 30px rgba(30, 91, 69, 0.12)',
  },
  honorHeaderRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  honorTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
  },
  honorTagText: {
    color: '#A8743F',
    fontSize: 11,
    fontWeight: '800',
  },
  heartChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  honorTitle: {
    fontSize: 20,
    fontWeight: '900',
  },
  honorMessage: {
    fontSize: 14,
    lineHeight: 23,
  },
  honorActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 6,
  },
  honorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  honorBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  honorBtnYt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  honorBtnYtText: {
    fontSize: 13,
    fontWeight: '700',
  },
  partnersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
    gap: 22,
    width: '100%',
  },
  partnerCard: {
    width: '100%',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    gap: 10,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  },
  topBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  partnerName: {
    fontSize: 18,
    fontWeight: '800',
  },
  partnerRole: {
    fontSize: 13,
    fontWeight: '700',
  },
  partnerOrg: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: -4,
  },
  partnerDesc: {
    fontSize: 13,
    lineHeight: 20,
    marginVertical: 4,
  },
  topicsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 4,
  },
  topicChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  topicText: {
    fontSize: 11,
    fontWeight: '600',
  },
  visitSiteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  visitSiteText: {
    fontSize: 12,
    fontWeight: '700',
  }
});
