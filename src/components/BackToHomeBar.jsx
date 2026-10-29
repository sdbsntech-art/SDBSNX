import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Home, ChevronRight, Sparkles } from 'lucide-react';

export default function BackToHomeBar({ currentPageTitle, breadcrumbCategory }) {
  const { setCurrentTab, theme } = useApp();
  const { width: viewportWidth } = useWindowDimensions();
  const isMobile = viewportWidth < 640;
  const isVerySmall = viewportWidth < 400;

  const handleBackToHome = () => {
    setCurrentTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <View style={styles.barWrap}>
      <View style={[
        styles.innerContainer, 
        { backgroundColor: theme.bgElevated, borderColor: theme.border },
        isMobile && styles.innerContainerMobile
      ]}>
        {/* Top line on mobile / Left group on desktop */}
        <View style={[styles.topRow, isMobile && styles.topRowMobile]}>
          {/* Back to Home Main Button */}
          <TouchableOpacity
            style={[
              styles.backBtn, 
              { backgroundColor: theme.primaryGlow, borderColor: theme.borderHover },
              isMobile && styles.backBtnMobile
            ]}
            onPress={handleBackToHome}
            activeOpacity={0.8}
          >
            <ArrowLeft size={isMobile ? 14 : 16} color={theme.primary} />
            <Home size={isMobile ? 13 : 15} color={theme.primary} />
            <Text style={[styles.backBtnText, { color: theme.primary }, isMobile && styles.backBtnTextMobile]}>
              {isVerySmall ? 'Accueil' : "Retour à l'accueil"}
            </Text>
          </TouchableOpacity>

          {/* Academic tag (visible alongside back button on mobile) */}
          <View style={[styles.academicPill, { backgroundColor: theme.bgCard }]}>
            <Sparkles size={11} color={theme.accent} />
            <Text style={[styles.academicPillText, { color: theme.textMuted }]}>SDBSNX • IDA</Text>
          </View>
        </View>

        {/* Breadcrumb Trail */}
        <View style={[styles.breadcrumbsRow, isMobile && styles.breadcrumbsRowMobile]} className="breadcrumb-trail">
          <TouchableOpacity onPress={handleBackToHome} style={styles.crumbItem} className="breadcrumb-home">
            <Text style={[styles.crumbTextMuted, { color: theme.textDim }]}>Accueil</Text>
          </TouchableOpacity>

          <ChevronRight size={12} color={theme.textDim} style={styles.crumbSeparator} />

          {breadcrumbCategory && (
            <>
              <Text 
                style={[styles.crumbTextMuted, styles.crumbCategory, { color: theme.textDim }]} 
                numberOfLines={1} 
                className="breadcrumb-category"
              >
                {breadcrumbCategory}
              </Text>
              <ChevronRight size={12} color={theme.textDim} style={styles.crumbSeparator} />
            </>
          )}

          <Text 
            style={[styles.crumbTextActive, { color: theme.text }]} 
            numberOfLines={isMobile ? 1 : 2} 
            className="breadcrumb-active"
          >
            {currentPageTitle || 'Page'}
          </Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
  },
  innerContainerMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
    borderRadius: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  topRowMobile: {
    justifyContent: 'space-between',
    width: '100%',
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
  backBtnMobile: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
    borderRadius: 10,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
  backBtnTextMobile: {
    fontSize: 12,
  },
  breadcrumbsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 0,
  },
  breadcrumbsRowMobile: {
    width: '100%',
    paddingTop: 2,
    gap: 5,
  },
  crumbItem: {
    paddingVertical: 2,
    flexShrink: 0,
  },
  crumbSeparator: {
    flexShrink: 0,
  },
  crumbCategory: {
    flexShrink: 1,
    maxWidth: 120,
  },
  crumbTextMuted: {
    fontSize: 12,
    fontWeight: '500',
  },
  crumbTextActive: {
    fontSize: 12,
    fontWeight: '700',
    flexShrink: 1,
  },
  academicPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    flexShrink: 0,
  },
  academicPillText: {
    fontSize: 11,
    fontWeight: '600',
  }
});
