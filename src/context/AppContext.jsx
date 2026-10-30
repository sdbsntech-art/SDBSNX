import React, { createContext, useContext, useState, useEffect } from 'react';
import { theme } from '../styles/theme';

const AppContext = createContext();
const SITE_ORIGIN = 'https://ida-cours.netlify.app';

const PAGE_ROUTES = [
  { path: '/', tab: 'home', cycle: 'L1' },
  { path: '/cours/licence-1', tab: 'licence', cycle: 'L1' },
  { path: '/cours/licence-2', tab: 'licence', cycle: 'L2' },
  { path: '/cours/licence-3', tab: 'licence', cycle: 'L3' },
  { path: '/videos', tab: 'videos' },
  { path: '/bibliotheque', tab: 'bibliotheque' },
  { path: '/cybersecurite', tab: 'cybersecurite' },
  { path: '/entrepreneuriat', tab: 'entrepreneuriat' },
  { path: '/formateurs', tab: 'formateurs' },
  { path: '/communaute', tab: 'forum' },
  { path: '/faq', tab: 'faq' },
  { path: '/admin', tab: 'admin' },
];

const LEGACY_HASH_TABS = new Set(PAGE_ROUTES.map(({ tab }) => tab));

function getCurrentPageRoute() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  const pathRoute = PAGE_ROUTES.find((route) => route.path === pathname);
  if (pathRoute) return pathRoute;

  const legacyHash = window.location.hash.slice(1);
  const legacyRoute = PAGE_ROUTES.find((route) => route.tab === legacyHash);
  if (LEGACY_HASH_TABS.has(legacyHash) && legacyRoute) return legacyRoute;

  return PAGE_ROUTES[0];
}

function getRouteForTab(tab, cycle) {
  return PAGE_ROUTES.find((route) => route.tab === tab && (!route.cycle || route.cycle === cycle))
    || PAGE_ROUTES[0];
}

export function AppProvider({ children }) {
  // Navigation & View
  const [currentTab, setCurrentTab] = useState(() => getCurrentPageRoute().tab);
  const [selectedCycle, setSelectedCycle] = useState(() => getCurrentPageRoute().cycle || 'L1');

  // Start in the light theme while preserving the user's saved preference.
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('ida_theme');
    return saved !== null ? saved === 'dark' : false;
  });

  const currentTheme = isDark ? theme.dark : theme.light;

  useEffect(() => {
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.setAttribute('content', currentTheme.primary);
  }, [currentTheme]);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem('ida_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  // Global Search Modal (Cmd+K / Ctrl+K)
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Video Category & Player Modal
  const [selectedVideoCategory, setSelectedVideoCategory] = useState('all');
  const [activeVideo, setActiveVideo] = useState(null);

  // PDF Preview Modal
  const [activePdfPreview, setActivePdfPreview] = useState(null);

  // Legal Modal
  const [activeLegal, setActiveLegal] = useState(null); // 'mentions' | 'politique' | 'conditions' | null

  // Fast Navigation Helpers
  const navigateToVideos = (category = 'all') => {
    setSelectedVideoCategory(category);
    setCurrentTab('videos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToLicence = (cycle = 'L1') => {
    setSelectedCycle(cycle);
    setCurrentTab('licence');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Bookmarks & Lesson Progress in LocalStorage
  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      const saved = localStorage.getItem('ida_completed_lessons');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleLessonComplete = (lessonId) => {
    setCompletedLessons((prev) => {
      const updated = { ...prev, [lessonId]: !prev[lessonId] };
      localStorage.setItem('ida_completed_lessons', JSON.stringify(updated));
      return updated;
    });
  };

  const [bookmarkedVideos, setBookmarkedVideos] = useState(() => {
    try {
      const saved = localStorage.getItem('ida_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleBookmarkVideo = (videoId) => {
    setBookmarkedVideos((prev) => {
      const updated = prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId];
      localStorage.setItem('ida_bookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  // PWA Install Prompt handling
  const [pwaPrompt, setPwaPrompt] = useState(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsPwaInstalled(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setPwaPrompt(e);
    };

    const handlePwaReady = () => {
      if (window.deferredPrompt) {
        setPwaPrompt(window.deferredPrompt);
      }
    };
    const handleAppInstalled = () => {
      setIsPwaInstalled(true);
      setPwaPrompt(null);
      window.deferredPrompt = null;
      triggerToast('Application IDA COURS installée avec succès ! 🎉', 'success');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('pwa-install-ready', handlePwaReady);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('pwa-install-ready', handlePwaReady);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const triggerInstallPwa = async () => {
    if (!pwaPrompt) {
      const isAppleMobile = /iPhone|iPad|iPod/i.test(navigator.userAgent)
        || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      triggerToast(
        isAppleMobile
          ? 'Dans Safari, touchez Partager puis « Sur l’écran d’accueil ».'
          : 'Ouvrez le menu de votre navigateur et choisissez « Installer l’application » ou « Ajouter à l’écran d’accueil ».',
        'info'
      );
      return;
    }
    try {
      await pwaPrompt.prompt();
      const { outcome } = await pwaPrompt.userChoice;
      if (outcome === 'accepted') setPwaPrompt(null);
    } catch (error) {
      triggerToast('L’installation n’a pas pu être lancée. Réessayez depuis le menu du navigateur.', 'error');
    } finally {
      window.deferredPrompt = null;
    }
  };

  // Toast System
  const [toast, setToast] = useState(null);
  const triggerToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  };

  // Keep each navigable section directly addressable and provide unique search metadata.
  useEffect(() => {
    const seoMeta = {
      home: {
        title: "SDBSNX | Cours d’informatique au Sénégal",
        desc: "SDBSNX propose des ressources gratuites en informatique et développement d’applications : cours, TD, examens et vidéos pour les niveaux L1, L2 et L3."
      },
      licence: {
        title: `Cours Licence ${selectedCycle} Informatique & Développement | SDBSNX`,
        desc: `Cours, modules, TD et supports de Licence ${selectedCycle} en informatique et développement d’applications. Ressources indépendantes pour étudiants au Sénégal.`
      },
      videos: {
        title: "Tutoriels vidéo de développement web et programmation | SDBSNX",
        desc: "Vidéos et tutoriels pour apprendre HTML, CSS, JavaScript, PHP, Python et les bases du développement web."
      },
      bibliotheque: {
        title: "Bibliothèque numérique : cours PDF d’informatique | SDBSNX",
        desc: "Consultez et téléchargez des supports PDF, fiches et ressources sur l’informatique, la programmation, les bases de données et le développement web."
      },
      cybersecurite: {
        title: "Ressources de cybersécurité et sécurité informatique | SDBSNX",
        desc: "Ressources d’apprentissage sur la cybersécurité, la protection des systèmes, la sécurité réseau et les bonnes pratiques numériques."
      },
      entrepreneuriat: {
        title: "Entrepreneuriat numérique et création de projets au Sénégal | SDBSNX",
        desc: "Guides et ressources pour créer un projet numérique : modèle économique, pitch, formalités et pistes de financement au Sénégal, dont Force-N."
      },
      formateurs: {
        title: "Ressources et formateurs en informatique au Sénégal | SDBSNX",
        desc: "Découvrez des ressources et références de formation en informatique, notamment autour de l’UNCHK (ex-UVS), de l’UCAD et de Force-N. SDBSNX reste indépendant."
      },
      forum: {
        title: "Communauté et entraide en informatique au Sénégal | SDBSNX",
        desc: "Espace de discussion et d’entraide pour partager des questions, des solutions et des conseils autour de l’informatique."
      },
      faq: {
        title: "FAQ et conseils pour apprendre l’informatique | SDBSNX",
        desc: "Réponses aux questions fréquentes sur les cours, les révisions et l’utilisation de SDBSNX."
      },
      admin: {
        title: "Espace administrateur SDBSNX | Gestion des cours et ressources",
        desc: "Authentification de l’administrateur SDBSNX pour gérer les cours, les révisions, les opportunités et les ressources FORCE-N."
      }
    };

    const currentSeo = seoMeta[currentTab] || seoMeta.home;
    const route = getRouteForTab(currentTab, selectedCycle);
    const canonicalUrl = new URL(route.path, SITE_ORIGIN).href;
    document.title = currentSeo.title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', currentSeo.desc);
    }
    const metadata = [
      ['property', 'og:title', currentSeo.title],
      ['property', 'og:description', currentSeo.desc],
      ['property', 'og:url', canonicalUrl],
      ['name', 'twitter:title', currentSeo.title],
      ['name', 'twitter:description', currentSeo.desc],
      ['name', 'twitter:url', canonicalUrl],
    ];
    for (const [attribute, name, content] of metadata) {
      document.querySelector(`meta[${attribute}="${name}"]`)?.setAttribute('content', content);
    }
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonicalUrl);

    if (window.location.pathname !== route.path || window.location.hash) {
      const locationRoute = getCurrentPageRoute();
      const isLegacyRoute = Boolean(window.location.hash) && locationRoute.tab === currentTab;
      const historyMethod = isLegacyRoute ? 'replaceState' : 'pushState';
      window.history[historyMethod]({}, '', route.path);
    }
  }, [currentTab, selectedCycle]);

  // Restore the active section when users navigate with the browser history.
  useEffect(() => {
    const syncRouteFromLocation = () => {
      const route = getCurrentPageRoute();
      setSelectedCycle(route.cycle || 'L1');
      setCurrentTab(route.tab);
    };

    window.addEventListener('popstate', syncRouteFromLocation);
    window.addEventListener('hashchange', syncRouteFromLocation);
    return () => {
      window.removeEventListener('popstate', syncRouteFromLocation);
      window.removeEventListener('hashchange', syncRouteFromLocation);
    };
  }, []);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setActiveVideo(null);
        setActiveLegal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        selectedCycle,
        setSelectedCycle,
        isDark,
        toggleTheme,
        theme: currentTheme,
        isSearchOpen,
        setIsSearchOpen,
        selectedVideoCategory,
        setSelectedVideoCategory,
        activeVideo,
        setActiveVideo,
        activePdfPreview,
        setActivePdfPreview,
        activeLegal,
        setActiveLegal,
        navigateToVideos,
        navigateToLicence,
        completedLessons,
        toggleLessonComplete,
        bookmarkedVideos,
        toggleBookmarkVideo,
        pwaPrompt,
        isPwaInstalled,
        triggerInstallPwa,
        toast,
        triggerToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
