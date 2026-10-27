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
    <View style={[styles.footerContainer, { backgroundColor: theme.bgSecondary, borderTopColor: theme.border }]}>
      <View style={styles.footerInner}>
        {/* Col 1: Dual Brand & Mission */}
        <View style={styles.colBrand}>
          <View style={styles.dualLogosWrap}>
            <img 
              src="/sdbsnx-logo.png" 
              alt="SDBSNX" 
              style={{
                height: 38,
                width: 'auto',
                objectFit: 'contain',
                borderRadius: 6,
                background: '#FFFFFF',
                padding: '2px 6px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
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
                borderRadius: 6,
                background: '#FFFFFF',
                padding: '2px 6px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
              }} 
            />
          </View>

          <View style={styles.brandTitleCol}>
            <Text style={[styles.brandTitle, { color: theme.text }]}>SDBSNX</Text>
            <Text style={[styles.brandSub, { color: theme.textDim }]}>Licence Informatique & Développement d'Applications</Text>
          </View>

          <Text style={[styles.brandDesc, { color: theme.textMuted }]}>
            Ressources en informatique et développement d’applications pour les étudiants.
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

        {/* Col 2: Cycles */}
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

        {/* Col 3: Pôles Spécialisés & Hub */}
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
          <TouchableOpacity onPress={() => handleNav('forum')} style={styles.linkItem}>
            <Text style={[styles.linkText, { color: theme.textMuted }]}>Discussion & Communauté</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNav('faq')} style={styles.linkItem}>
            <Text style={[styles.linkText, { color: theme.textMuted }]}>FAQ & Méthodologie UNCHK</Text>
          </TouchableOpacity>
        </View>

        {/* Col 4: Campus & Institution */}
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

      {/* Bottom Bar: Legal links */}
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
    paddingTop: 44,
    paddingBottom: 36,
  },
  footerInner: {
    maxWidth: 1320,
    marginHorizontal: 'auto',
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 36,
    justifyContent: 'space-between',
  },
  colBrand: {
    flex: 1,
    minWidth: 280,
    maxWidth: 380,
    gap: 12,
  },
  dualLogosWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoDivider: {
    width: 1,
    height: 24,
  },
  brandTitleCol: {
    gap: 2,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
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
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colLinks: {
    flex: 1,
    minWidth: 180,
    gap: 10,
  },
  colHeading: {
    fontSize: 14,
    fontWeight: '700',
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
    marginTop: 36,
    paddingTop: 20,
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
