import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useApp } from './context/AppContext';
import HeaderNav from './components/HeaderNav';
import Footer from './components/Footer';
import BottomTabBar from './components/BottomTabBar';
import QuickSearchModal from './components/QuickSearchModal';
import VideoPlayerModal from './components/VideoPlayerModal';
import PdfViewerModal from './components/PdfViewerModal';
import Toast from './components/Toast';
import LegalModal from './views/LegalModal';

import HomeView from './views/HomeView';
import LicenceView from './views/LicenceView';
import VideosView from './views/VideosView';

import LibraryView from './views/LibraryView';
import CybersecuriteView from './views/CybersecuriteView';
import EntrepreneuriatView from './views/EntrepreneuriatView';
import FormateursView from './views/FormateursView';
import ForumCommentsView from './views/ForumCommentsView';
import FAQView from './views/FAQView';
import AdminAuthView from './views/AdminAuthView';

export default function App() {
  const { currentTab, theme } = useApp();

  const renderActiveView = () => {
    switch (currentTab) {
      case 'home':
        return <HomeView />;
      case 'licence':
        return <LicenceView />;
      case 'cybersecurite':
        return <CybersecuriteView />;
      case 'entrepreneuriat':
        return <EntrepreneuriatView />;
      case 'videos':
        return <VideosView />;
      case 'bibliotheque':
        return <LibraryView />;
      case 'formateurs':
        return <FormateursView />;
      case 'forum':
        return <ForumCommentsView />;
      case 'faq':
        return <FAQView />;
      case 'admin':
        return <AdminAuthView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <View style={[styles.appRoot, { backgroundColor: theme.bg, color: theme.text }]}>
      {/* Top Sticky Header */}
      <HeaderNav />

      {/* Main View Area */}
      <View style={styles.mainContent} className="app-main-content">
        {renderActiveView()}
      </View>

      {/* Footer */}
      <Footer />

      {/* Mobile Native Bottom Tab Bar */}
      <BottomTabBar />

      {/* Modals & Overlays */}
      <QuickSearchModal />
      <VideoPlayerModal />
      <PdfViewerModal />
      <LegalModal />
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  appRoot: {
    minHeight: '100vh',
    width: '100%',
    position: 'relative',
  },
  mainContent: {
    width: '100%',
    paddingBottom: 60,
  }
});
