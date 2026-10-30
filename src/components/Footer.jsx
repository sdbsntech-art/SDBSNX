import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { MapPin, Mail, ShieldCheck, Youtube, Github, Globe } from 'lucide-react';

export default function Footer() {
  const { theme, setCurrentTab, setSelectedCycle, setActiveLegal } = useApp();

  const handleNav = (tab, cycle = null) => {
    setCurrentTab(tab);
    if (cycle) setSelectedCycle(cycle);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
    <View className="site-footer" style={[styles.footerContainer, { backgroundColor: theme.bgSecondary, borderTopColor: theme.border }]}>
      <View className="footer-inner" style={styles.footerInner}>
        <View style={[styles.footerTopBand, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <View style={styles.footerTopBandText}>
            <Text style={[styles.footerBadge, { color: theme.primary, backgroundColor: theme.primaryGlow }]}>Accès gratuit</Text>
            <Text style={[styles.footerTopTitle, { color: theme.text }]}>Cours, TD, examens, vidéos et ressources de qualité.</Text>
          </View>
          <TouchableOpacity
            onPress={() => handleNav('licence', 'L1')}
            style={[styles.footerCta, { backgroundColor: theme.primary }]}
          >
            <Text style={styles.footerCtaText}>Explorer les cours</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.colBrand}>
          <View style={styles.dualLogosWrap}>
            <img 
              src="/sdbsnx-logo.png" 
              alt="SDBSNX" 
              style={{
                height: 38,
                width: 'auto',
                objectFit: 'contain',
                borderRadius: 8,
                background: '#FFFFFF',
                padding: '2px 6px',
                boxShadow: '0 1px 6px rgba(0,0,0,0.06)'
              }} 
            />
            <View style={[styles.logoDivider, { backgroundColor: theme.border }]} />
            <img 
              src="/unchk-uvs-logo.png" 
              alt="UNCHK - Université Numérique Cheikh Hamidou Kane" 
              style={{
                height: 38,
                width: 'auto',
                objectFit: 'contain',
                borderRadius: 8,
                background: '#FFFFFF',
                padding: '2px 6px',
                boxShadow: '0 1px 6px rgba(0,0,0,0.06)'
              }} 
            />
            <View style={[styles.logoDivider, { backgroundColor: theme.border }]} />
            <img 
              src="/force-n-logo.png" 
              alt="FORCE-N • Université Numérique Cheikh Hamidou Kane" 
              style={{
                height: 38,
                width: 'auto',
                objectFit: 'contain',
                borderRadius: 8,
                background: '#FFFFFF',
                padding: '2px 6px',
                boxShadow: '0 1px 6px rgba(0,0,0,0.06)'
              }} 
            />
          </View>

          <View style={styles.brandTitleCol}>
            <Text style={[styles.brandTitle, { color: theme.text }]}>SDBSNX</Text>
            <Text style={[styles.brandSub, { color: theme.textDim }]}>Licence Informatique & Développement d'Applications</Text>
          </View>

          <Text style={[styles.brandDesc, { color: theme.textMuted }]}>
            Ressources pédagogiques universitaires, supports PDF, vidéos HD et contenus de référence pour mieux apprendre et progresser.
          </Text>

          <View style={styles.socialsRow}>
            <TouchableOpacity 
              style={[styles.socialBtn, { borderColor: theme.border, backgroundColor: theme.bgCard }]}
              onPress={() => window.open('https://www.youtube.com/channel/UCCZJBOaAPdAoTiD-iJ2ftkg', '_blank')}
            >
              <Youtube size={15} color={theme.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.socialBtn, { borderColor: theme.border, backgroundColor: theme.bgCard }]}
              onPress={() => window.open('https://github.com/sdbsntech-art/sdbsn-ida.code', '_blank')}
            >
              <Github size={15} color={theme.text} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.socialBtn, { borderColor: theme.border, backgroundColor: theme.bgCard }]}
              onPress={() => window.open('https://grafikart.fr', '_blank')}
            >
              <Globe size={15} color={theme.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.colLinks}>
          <Text style={[styles.colHeading, { color: theme.text }]}>Cycles d'Études</Text>
          <TouchableOpacity onPress={() => handleNav('licence', 'L1')} style={styles.linkItem}>
            <Text style={[styles.linkText, { color: theme.textMuted }]}>Licence 1 (L1) • Fondations & Web</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNav('licence', 'L2')} style={styles.linkItem}>
            <Text style={[styles.linkText, { color: theme.textMuted }]}>Licence 2 (L2) • Backend & Mobile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNav('licence', 'L3')} style={styles.linkItem}>
            <Text style={[styles.linkText, { color: theme.textMuted }]}>Licence 3 (L3) • Architecture & Sécurité</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNav('videos')} style={styles.linkItem}>
            <Text style={[styles.linkText, { color: theme.textMuted }]}>120+ Tutoriels Vidéos HD</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.colLinks}>
          <Text style={[styles.colHeading, { color: theme.text }]}>Pôles & Ressources</Text>
          <TouchableOpacity onPress={() => handleNav('cybersecurite')} style={styles.linkItem}>
            <Text style={[styles.linkText, { color: theme.textMuted }]}>Cybersécurité & Normes CDP</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNav('entrepreneuriat')} style={styles.linkItem}>
            <Text style={[styles.linkText, { color: theme.textMuted }]}>Entrepreneuriat & Startups</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNav('bibliotheque')} style={styles.linkItem}>
            <Text style={[styles.linkText, { color: theme.textMuted }]}>Bibliothèque Numérique (PDFs)</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNav('formateurs')} style={styles.linkItem}>
            <Text style={[styles.linkText, { color: theme.textMuted }]}>Écosystème & Formateurs</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => window.open('https://force-n.sn', '_blank')} style={styles.linkItem}>
            <Text style={[styles.linkText, { color: theme.primary, fontWeight: '700' }]}>FORCE-N • Certifications & Emploi ↗</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNav('forum')} style={styles.linkItem}>
            <Text style={[styles.linkText, { color: theme.textMuted }]}>Discussion & Communauté</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNav('faq')} style={styles.linkItem}>
            <Text style={[styles.linkText, { color: theme.textMuted }]}>FAQ & Méthodologie UNCHK</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.colLinks}>
          <Text style={[styles.colHeading, { color: theme.text }]}>Campus & Contact</Text>
          <View style={styles.contactItem}>
            <MapPin size={15} color={theme.primary} />
            <Text style={[styles.contactText, { color: theme.textMuted }]}>Dakar, Pikine, Dalifort • Sénégal</Text>
          </View>
          <View style={styles.contactItem}>
            <Mail size={15} color={theme.secondary} />
            <TouchableOpacity onPress={() => window.location.assign('mailto:sdbsntech@gmail.com')}>
              <Text style={[styles.contactText, { color: theme.textMuted }]}>sdbsntech@gmail.com</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.contactItem}>
            <ShieldCheck size={15} color={theme.emerald} />
            <Text style={[styles.contactText, { color: theme.textMuted }]}>PWA Conforme W3C & UNCHK</Text>
          </View>
        </View>
      </View>

      <View style={[styles.bottomBar, { borderTopColor: theme.border }]}>
        <View style={styles.bottomBarInner}>
          <Text style={[styles.copyrightText, { color: theme.textDim }]}>
            © {new Date().getFullYear()} SDBSNX • IDA COURS. Remerciements aux créateurs et formateurs dont les ressources contribuent à l'apprentissage.
          </Text>

          <View style={styles.legalLinksRow}>
            <TouchableOpacity onPress={() => setActiveLegal('mentions')}>
              <Text style={[styles.legalLink, { color: theme.textMuted }]}>Mentions Légales</Text>
            </TouchableOpacity>
            <Text style={{ color: theme.border }}>•</Text>
            <TouchableOpacity onPress={() => setActiveLegal('politique')}>
              <Text style={[styles.legalLink, { color: theme.textMuted }]}>Confidentialité</Text>
            </TouchableOpacity>
            <Text style={{ color: theme.border }}>•</Text>
            <TouchableOpacity onPress={() => setActiveLegal('conditions')}>
              <Text style={[styles.legalLink, { color: theme.textMuted }]}>Conditions</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    borderTopWidth: 1,
    marginTop: 60,
    paddingTop: 28,
    paddingBottom: 30,
  },
  footerInner: {
    maxWidth: 1320,
    marginHorizontal: 'auto',
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 28,
    justifyContent: 'space-between',
  },
  footerTopBand: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  footerTopBandText: {
    flex: 1,
    minWidth: 200,
    gap: 8,
  },
  footerBadge: {
    alignSelf: 'flex-start',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  footerTopTitle: {
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 22,
  },
  footerCta: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  footerCtaText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  colBrand: {
    flex: 1,
    minWidth: 240,
    maxWidth: 380,
    gap: 12,
    width: '100%',
  },
  dualLogosWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  logoDivider: {
    width: 1,
    height: 30,
  },
  brandTitleCol: {
    gap: 2,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  brandSub: {
    fontSize: 12,
    fontWeight: '500',
  },
  brandDesc: {
    fontSize: 12,
    lineHeight: 19,
  },
  socialsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  socialBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colLinks: {
    flex: 1,
    minWidth: 140,
    gap: 10,
    width: '100%',
  },
  colHeading: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  linkItem: {
    paddingVertical: 2,
  },
  linkText: {
    fontSize: 13,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  contactText: {
    fontSize: 12,
  },
  bottomBar: {
    borderTopWidth: 1,
    marginTop: 24,
    paddingTop: 18,
  },
  bottomBarInner: {
    maxWidth: 1320,
    marginHorizontal: 'auto',
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },
  copyrightText: {
    fontSize: 12,
  },
  legalLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legalLink: {
    fontSize: 12,
  }
});

