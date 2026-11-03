import React, { Suspense, lazy } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useApp } from './context/AppContext';
import HeaderNav from './components/HeaderNav';
import Footer from './components/Footer';
import BottomTabBar from './components/BottomTabBar';
import VideoPlayerModal from './components/VideoPlayerModal';
import Toast from './components/Toast';
const LoginView = lazy(() => import('./views/LoginView'));
const AdminView = lazy(() => import('./views/AdminView'));
const RequireRole = lazy(() => import('./components/RequireRole'));
const RequireAuthentication = lazy(() => import('./components/RequireAuthentication'));
const PdfViewerModal = lazy(() => import('./components/PdfViewerModal'));
const QuickSearchModal = lazy(() => import('./components/QuickSearchModal'));
const HomeView = lazy(() => import('./views/HomeView'));
const LicenceView = lazy(() => import('./views/LicenceView'));
const VideosView = lazy(() => import('./views/VideosView'));
const LibraryView = lazy(() => import('./views/LibraryView'));
const CybersecuriteView = lazy(() => import('./views/CybersecuriteView'));
const EntrepreneuriatView = lazy(() => import('./views/EntrepreneuriatView'));
const FormateursView = lazy(() => import('./views/FormateursView'));
const ForumCommentsView = lazy(() => import('./views/ForumCommentsView'));
const FAQView = lazy(() => import('./views/FAQView'));
const LegalPagesView = lazy(() => import('./views/LegalPagesView'));

export default function App() {
  const { currentTab, activePdfPreview, isSearchOpen, theme } = useApp();

  if (window.location.pathname === '/connexion') {
    return (
      <Suspense fallback={<div className="admin-gate">Chargement…</div>}>
        <LoginView />
      </Suspense>
    );
  }

  if (window.location.pathname === '/admin') {
    return (
      <Suspense fallback={<div className="admin-gate">Chargement…</div>}>
        <RequireRole roles={['admin', 'editor']}>
          <AdminView />
        </RequireRole>
      </Suspense>
    );
  }

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
      case 'legal':
        return <LegalPagesView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <Suspense fallback={<div className="admin-gate">Vérification de la session…</div>}>
      <RequireAuthentication>
        <View style={[styles.appRoot, { backgroundColor: theme.bg, color: theme.text }]}>
      {/* Top Sticky Header */}
      <HeaderNav />

      {/* Main View Area */}
      <View style={styles.mainContent} className="app-main-content">
        <Suspense fallback={<div className="admin-gate">Chargement…</div>}>
          {renderActiveView()}
        </Suspense>
      </View>

      {/* Footer */}
      <Footer />

      {/* Mobile Native Bottom Tab Bar */}
      <BottomTabBar />

      {/* Modals & Overlays */}
      {isSearchOpen && (
        <Suspense fallback={null}>
          <QuickSearchModal />
        </Suspense>
      )}
      <VideoPlayerModal />
      {activePdfPreview && (
        <Suspense fallback={null}>
          <PdfViewerModal />
        </Suspense>
      )}
      <Toast />
        </View>
      </RequireAuthentication>
    </Suspense>
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
