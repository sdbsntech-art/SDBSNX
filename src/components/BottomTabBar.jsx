import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { Sparkles, GraduationCap, Video, Shield, Rocket, BookOpen, MessageSquare } from 'lucide-react';

export default function BottomTabBar() {
  const { currentTab, setCurrentTab, theme, setIsSearchOpen } = useApp();

  const tabs = [
    { id: 'home', label: 'Accueil', icon: Sparkles },
    { id: 'licence', label: 'Cours', icon: GraduationCap },
    { id: 'cybersecurite', label: 'Cyber', icon: Shield },
    { id: 'entrepreneuriat', label: 'Startups', icon: Rocket },
    { id: 'videos', label: 'Vidéos', icon: Video }
  ];

  return (
    <View style={[styles.bottomBarWrapper, { backgroundColor: theme.glassNav, borderTopColor: theme.border }]}>
      <View style={styles.tabsRow}>
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabBtn}
              onPress={() => {
                setCurrentTab(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrap, isActive && { backgroundColor: theme.primaryGlow }]}>
                <Icon size={20} color={isActive ? theme.primary : theme.textDim} />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  { color: isActive ? theme.primary : theme.textDim, fontWeight: isActive ? '700' : '500' }
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBarWrapper: {
    display: 'none',
    '@media (max-width: 960px)': {
      display: 'flex',
    },
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    zIndex: 990,
    paddingBottom: 'env(safe-area-inset-bottom, 8px)',
    paddingTop: 6,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 56,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  iconWrap: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
  },
  tabLabel: {
    fontSize: 10,
  }
});
