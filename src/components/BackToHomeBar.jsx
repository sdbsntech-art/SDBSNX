import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Home, ChevronRight, Sparkles } from 'lucide-react';

export default function BackToHomeBar({ currentPageTitle, breadcrumbCategory }) {
  const { setCurrentTab, theme } = useApp();

  const handleBackToHome = () => {
    setCurrentTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <View style={styles.barWrap}>
      <View style={[styles.innerContainer, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
        {/* Back to Home Main Button */}
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: theme.primaryGlow, borderColor: theme.borderHover }]}
          onPress={handleBackToHome}
          activeOpacity={0.8}
        >
          <ArrowLeft size={16} color={theme.primary} />
          <Home size={15} color={theme.primary} />
          <Text style={[styles.backBtnText, { color: theme.primary }]}>Retour à l'accueil</Text>
        </TouchableOpacity>

        {/* Breadcrumb Trail */}
        <View style={styles.breadcrumbsRow} className="breadcrumb-trail">
          <TouchableOpacity onPress={handleBackToHome} style={styles.crumbItem} className="breadcrumb-home">
            <Text style={[styles.crumbTextMuted, { color: theme.textDim }]}>Accueil</Text>
          </TouchableOpacity>

          <ChevronRight size={13} color={theme.textDim} />

          {breadcrumbCategory && (
            <>
              <Text style={[styles.crumbTextMuted, { color: theme.textDim }]} numberOfLines={1} className="breadcrumb-category">{breadcrumbCategory}</Text>
              <ChevronRight size={13} color={theme.textDim} />
            </>
          )}

          <Text style={[styles.crumbTextActive, { color: theme.text }]} numberOfLines={2} className="breadcrumb-active">
            {currentPageTitle || 'Page'}
          </Text>
        </View>

        {/* Academic tag */}
        <View style={[styles.academicPill, { backgroundColor: theme.bgCard }]}>
          <Sparkles size={12} color={theme.accent} />
          <Text style={[styles.academicPillText, { color: theme.textMuted }]}>SDBSNX • IDA</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  barWrap: {
    width: '100%',
    marginBottom: 20,
  },
  innerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
  breadcrumbsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  crumbItem: {
    paddingVertical: 2,
  },
  crumbTextMuted: {
    fontSize: 12,
    fontWeight: '500',
  },
  crumbTextActive: {
    fontSize: 12,
    fontWeight: '700',
  },
  academicPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  academicPillText: {
    fontSize: 11,
    fontWeight: '600',
  }
});
