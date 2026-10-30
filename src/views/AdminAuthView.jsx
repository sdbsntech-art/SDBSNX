import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { ShieldCheck, ArrowLeft, Sparkles, FileText, Briefcase, LockKeyhole, BadgeCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import DocumentAdmin from '../components/DocumentAdmin';

const quickActions = [
  { label: 'Cours Licence', icon: FileText, tone: 'primary' },
  { label: 'Cybersécurité', icon: ShieldCheck, tone: 'accent' },
  { label: 'Entrepreneuriat', icon: Briefcase, tone: 'secondary' },
  { label: 'Révisions', icon: BadgeCheck, tone: 'neutral' },
];

export default function AdminAuthView() {
  const { width } = useWindowDimensions();
  const { theme, setCurrentTab } = useApp();
  const isCompact = width < 620;

  return (
    <View style={styles.page}>
      <View style={[styles.shell, { backgroundColor: theme.bgElevated, borderColor: theme.border, padding: isCompact ? 16 : 22, borderRadius: isCompact ? 20 : 28 }]}> 
        <View style={styles.headerRow}>
          <View style={styles.brandWrap}>
            <img
              src="/sdbsnx-logo.png"
              alt="SDBSNX"
              style={{
                height: 38,
                width: 'auto',
                objectFit: 'contain',
                borderRadius: 10,
                background: '#fff',
                padding: '4px 8px',
              }}
            />
            <img
              src="/force-n-logo.png"
              alt="FORCE-N"
              style={{
                height: 38,
                width: 'auto',
                objectFit: 'contain',
                borderRadius: 10,
                background: '#fff',
                padding: '4px 8px',
              }}
            />
          </View>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: theme.bgCard, borderColor: theme.border }]}
            onPress={() => setCurrentTab('home')}
            activeOpacity={0.9}
          >
            <ArrowLeft size={15} color={theme.primary} />
            <Text style={[styles.backButtonText, { color: theme.primary }]}>Accueil</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headingGroup}>
          <View style={[styles.badge, { backgroundColor: theme.primaryGlow, borderColor: theme.border }]}>
            <LockKeyhole size={15} color={theme.primary} />
            <Text style={[styles.badgeText, { color: theme.primary }]}>ESPACE ADMIN</Text>
          </View>
          <Text style={[styles.title, { color: theme.text, fontSize: isCompact ? 24 : 30 }]}>
            Authentification administrateur
          </Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            Ajoutez les cours, les ressources FORCE-N, les révisions de semestre et les opportunités de formation ou de stage.
          </Text>
        </View>

        <View style={styles.actionGrid}>
          {quickActions.map(({ label, icon: Icon, tone }) => (
            <View
              key={label}
              style={[
                styles.actionCard,
                {
                  backgroundColor:
                    tone === 'primary'
                      ? theme.primaryGlow
                      : tone === 'accent'
                        ? `${theme.secondary}22`
                        : tone === 'secondary'
                          ? `${theme.accent}18`
                          : theme.bgCard,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.bgCard }]}> 
                <Icon size={16} color={tone === 'primary' ? theme.primary : tone === 'accent' ? theme.secondary : tone === 'secondary' ? theme.accent : theme.emerald} />
              </View>
              <Text style={[styles.actionLabel, { color: theme.text }]}>{label}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.notice, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <Sparkles size={17} color={theme.accent} />
          <Text style={[styles.noticeText, { color: theme.textMuted }]}>
            La plateforme prend en charge les sections : cours, cybersécurité, entrepreneuriat, bibliothèque, révisions et alertes de carrière.
          </Text>
        </View>

        <DocumentAdmin open={true} onClose={() => setCurrentTab('home')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    width: '100%',
    minHeight: '100vh',
    paddingTop: 32,
    paddingBottom: 80,
    paddingHorizontal: 20,
  },
  shell: {
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
    padding: 22,
    borderRadius: 28,
    borderWidth: 1,
    boxShadow: '0 20px 60px rgba(31, 51, 39, 0.10)',
  },
  headerRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  brandWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  badge: {
    alignSelf: 'flex-start',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 0.4,
  },
  headingGroup: {
    marginBottom: 18,
  },
  title: {
    fontSize: 30,
    lineHeight: 1.2,
    fontWeight: 800,
    letterSpacing: -0.75,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 760,
  },
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: 12,
    marginBottom: 18,
  },
  actionCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  actionIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: 700,
  },
  notice: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  noticeText: {
    fontSize: 13,
    lineHeight: 20,
  },
  backButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
  },
  backButtonText: {
    fontSize: 12,
    fontWeight: 700,
  },
});
