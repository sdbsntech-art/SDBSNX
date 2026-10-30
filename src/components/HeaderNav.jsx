import React, { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  ChevronDown,
  Download,
  GraduationCap,
  HelpCircle,
  Home,
  MessageSquare,
  Menu,
  Moon,
  Rocket,
  Search,
  Shield,
  ShieldCheck,
  Sun,
  Users,
  Video,
  X,
  Sparkles,
  Layers,
  ChevronRight,
  Compass
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const menuGroups = [
  {
    id: 'cours',
    label: 'Cours',
    icon: GraduationCap,
    activeTabs: ['licence'],
    items: [
      { tab: 'licence', cycle: 'L1', label: 'Licence 1 (L1)', subLabel: '170 supports • Fondations' },
      { tab: 'licence', cycle: 'L2', label: 'Licence 2 (L2)', subLabel: '333 supports • Spécialisations' },
      { tab: 'licence', cycle: 'L3', label: 'Licence 3 (L3)', subLabel: '30 supports • Ingénierie' },
    ],
  },
  {
    id: 'explorer',
    label: 'Explorer',
    icon: BookOpen,
    activeTabs: ['cybersecurite', 'entrepreneuriat', 'videos', 'bibliotheque'],
    items: [
      { tab: 'videos', label: 'Vidéothèque HD', subLabel: '123 tutoriels Grafikart', icon: Video, badge: '123 HD' },
      { tab: 'cybersecurite', label: 'Cybersécurité', subLabel: 'Réseaux & Protocoles', icon: Shield },
      { tab: 'entrepreneuriat', label: 'Entrepreneuriat', subLabel: 'Startups & Business Tech', icon: Rocket },
      { tab: 'bibliotheque', label: 'Bibliothèque', subLabel: 'E-books & Livres de référence', icon: BookOpen },
    ],
  },
  {
    id: 'communaute',
    label: 'Communauté',
    icon: Users,
    activeTabs: ['formateurs', 'forum', 'faq'],
    items: [
      { tab: 'formateurs', label: 'Nos formateurs', subLabel: 'Mentors & Partenaires', icon: Users },
      { tab: 'forum', label: 'Discussion & Forum', subLabel: 'Entraide entre étudiants', icon: MessageSquare },
      { tab: 'faq', label: 'Aide & FAQ', subLabel: 'Questions fréquentes', icon: HelpCircle },
    ],
  },
];

export default function HeaderNav() {
  const {
    currentTab,
    setCurrentTab,
    selectedCycle,
    setSelectedCycle,
    isDark,
    toggleTheme,
    theme,
    setIsSearchOpen,
    triggerInstallPwa,
  } = useApp();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef(null);
  const burgerBtnRef = useRef(null);
  const drawerCloseBtnRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close drawer when currentTab changes (seamless page transitions)
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentTab]);

  // Close drawer if window is resized to desktop width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 960) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close menus on outside click or escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
        if (mobileMenuOpen) {
          setMobileMenuOpen(false);
          burgerBtnRef.current?.focus();
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  // Lock body scroll and manage focus when mobile menu drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        drawerCloseBtnRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNav = (tab, cycle = null) => {
    setCurrentTab(tab);
    if (cycle) setSelectedCycle(cycle);
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderDropdown = (group) => {
    const Icon = group.icon;
    const isActive = group.activeTabs.includes(currentTab);
    const isOpen = activeDropdown === group.id;

    return (
      <div className="nav-dropdown" key={group.id}>
        <button
          type="button"
          className={`nav-link${isActive ? ' is-active' : ''}`}
          style={{
            color: isActive ? theme.primary : theme.textMuted,
            backgroundColor: isOpen ? theme.primaryGlow : 'transparent',
          }}
          onClick={() => setActiveDropdown(isOpen ? null : group.id)}
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          <Icon size={16} aria-hidden="true" />
          <span>{group.label}</span>
          <ChevronDown
            size={14}
            className={`nav-chevron${isOpen ? ' is-open' : ''}`}
            aria-hidden="true"
          />
        </button>
        {isOpen && (
          <div
            className="nav-dropdown-menu"
            style={{
              backgroundColor: theme.bgElevated,
              borderColor: theme.border,
              boxShadow: `0 14px 36px ${isDark ? 'rgba(0,0,0,0.32)' : 'rgba(31,51,39,0.14)'}`,
            }}
            role="menu"
          >
            {group.items.map((item) => {
              const ItemIcon = item.icon || group.icon;
              const selected =
                currentTab === item.tab &&
                (!item.cycle || selectedCycle === item.cycle);
              return (
                <button
                  type="button"
                  className="nav-dropdown-item"
                  key={`${item.tab}-${item.cycle || item.label}`}
                  style={{
                    color: selected ? theme.primary : theme.text,
                    backgroundColor: selected ? theme.primaryGlow : 'transparent',
                  }}
                  onClick={() => handleNav(item.tab, item.cycle)}
                  role="menuitem"
                >
                  {ItemIcon && <ItemIcon size={16} aria-hidden="true" />}
                  <span>{item.label}</span>
                  {selected && <span className="nav-current-indicator" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <header
      className={`site-header${scrolled ? ' is-scrolled' : ''}`}
      style={{
        backgroundColor: theme.glassNav,
        borderBottomColor: theme.border,
        boxShadow: scrolled
          ? `0 4px 18px ${isDark ? 'rgba(0,0,0,0.25)' : 'rgba(31,51,39,0.08)'}`
          : 'none',
      }}
      ref={headerRef}
    >
      <div className="site-header-inner">
        {/* Brand Logo & Title */}
        <button
          type="button"
          className="site-brand"
          onClick={() => handleNav('home')}
          aria-label="SDBSNX IDA — Accueil"
        >
          <img src="/sdbsnx-logo.png" alt="SDBSNX" className="site-brand-logo" />
          <img src="/unchk-uvs-logo.png" alt="UNCHK" className="site-brand-partner-logo site-brand-partner-logo-small" />
          <span className="site-brand-copy">
            <span className="site-brand-name" style={{ color: theme.text }}>
              SDBSNX <span style={{ color: theme.primary }}>•</span> IDA
            </span>
            <span className="site-brand-subtitle" style={{ color: theme.textDim }}>
              FORCE-N • UNCHK
            </span>
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="desktop-horizontal-nav" aria-label="Navigation principale">
          <button
            type="button"
            className={`nav-link${currentTab === 'home' ? ' is-active' : ''}`}
            style={{
              color: currentTab === 'home' ? theme.primary : theme.textMuted,
              backgroundColor: currentTab === 'home' ? theme.primaryGlow : 'transparent',
            }}
            onClick={() => handleNav('home')}
            aria-current={currentTab === 'home' ? 'page' : undefined}
          >
            <Home size={16} aria-hidden="true" />
            <span>Accueil</span>
          </button>
          {menuGroups.map(renderDropdown)}
        </nav>

        {/* Header Action Buttons (Search, Theme, Install, Burger) */}
        <div className="header-actions">
          <button
            type="button"
            className="header-icon-button search-button"
            style={{
              color: theme.textMuted,
              borderColor: theme.border,
              backgroundColor: theme.bgCard,
            }}
            onClick={() => setIsSearchOpen(true)}
            title="Rechercher (Ctrl+K)"
            aria-label="Rechercher"
          >
            <Search size={16} aria-hidden="true" />
            <span className="search-text-label">Rechercher</span>
          </button>

          <button
            type="button"
            className="header-icon-button theme-button"
            style={{
              color: theme.textMuted,
              borderColor: theme.border,
              backgroundColor: theme.bgCard,
            }}
            onClick={toggleTheme}
            title={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
            aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
          >
            {isDark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
          </button>

          <button
            type="button"
            className="header-install-button header-admin-button"
            style={{
              backgroundColor: theme.primaryGlow,
              color: theme.primary,
              borderColor: theme.border,
            }}
            onClick={() => handleNav('admin')}
          >
            <ShieldCheck size={14} aria-hidden="true" />
            <span>Admin</span>
          </button>

          <button
            type="button"
            className="header-install-button"
            style={{ backgroundColor: theme.primary }}
            onClick={triggerInstallPwa}
          >
            <Download size={14} aria-hidden="true" />
            <span>Installer</span>
          </button>

          {/* Premium Burger Menu Toggle Button */}
          <button
            ref={burgerBtnRef}
            type="button"
            id="burger-menu-toggle"
            className={`header-icon-button mobile-menu-button${mobileMenuOpen ? ' is-active' : ''}`}
            style={{
              color: mobileMenuOpen ? '#FFFFFF' : theme.text,
              borderColor: mobileMenuOpen ? theme.primary : theme.border,
              backgroundColor: mobileMenuOpen ? theme.primary : theme.bgCard,
            }}
            onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-drawer"
          >
            <div className={`hamburger-animated${mobileMenuOpen ? ' open' : ''}`}>
              <span className="hamburger-line line-1" />
              <span className="hamburger-line line-2" />
              <span className="hamburger-line line-3" />
            </div>
          </button>
        </div>
      </div>

      {/* LUXURY MOBILE BURGER MENU DRAWER (OFF-CANVAS WITH BACKDROP) */}
      {mobileMenuOpen && (
        <div id="mobile-drawer" className="mobile-drawer-root" role="dialog" aria-modal="true" aria-label="Menu de navigation mobile">
          {/* Frosted Dark Backdrop Overlay */}
          <div 
            className="mobile-drawer-backdrop" 
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Sliding Drawer Container */}
          <aside 
            className="mobile-drawer-sheet"
            style={{
              backgroundColor: theme.bgElevated,
              borderColor: theme.border,
              boxShadow: `0 0 50px ${isDark ? 'rgba(0,0,0,0.65)' : 'rgba(20,40,30,0.2)'}`,
            }}
          >
            {/* Drawer Header */}
            <div 
              className="drawer-header"
              style={{
                borderBottomColor: theme.border,
                backgroundColor: theme.bgCard
              }}
            >
              <div className="drawer-brand-row">
                <img src="/sdbsnx-logo.png" alt="SDBSNX" className="drawer-logo" />
                <img src="/unchk-uvs-logo.png" alt="UNCHK" className="drawer-partner-logo" />
                <div className="drawer-brand-text">
                  <span className="drawer-title" style={{ color: theme.text }}>SDBSNX IDA</span>
                  <span className="drawer-sub" style={{ color: theme.textDim }}>UNCHK SÉNÉGAL</span>
                </div>
              </div>

              <button
                ref={drawerCloseBtnRef}
                type="button"
                className="drawer-close-btn"
                style={{
                  backgroundColor: theme.bgSecondary,
                  borderColor: theme.border,
                  color: theme.text
                }}
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Fermer le menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Actions Panel: Search + Theme */}
            <div className="drawer-quick-actions" style={{ borderBottomColor: theme.border }}>
              <button
                type="button"
                className="drawer-search-trigger"
                style={{
                  backgroundColor: theme.bgCard,
                  borderColor: theme.border,
                  color: theme.textMuted
                }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsSearchOpen(true);
                }}
              >
                <Search size={15} color={theme.primary} />
                <span>Rechercher un cours, TD, examen...</span>
                <span className="search-chip" style={{ backgroundColor: theme.primaryGlow, color: theme.primary }}>Ctrl+K</span>
              </button>

              <div className="drawer-theme-row">
                <button
                  type="button"
                  className="drawer-action-btn"
                  style={{
                    backgroundColor: theme.bgCard,
                    borderColor: theme.border,
                    color: theme.text
                  }}
                  onClick={toggleTheme}
                >
                  {isDark ? <Sun size={15} color="#F59E0B" /> : <Moon size={15} color={theme.primary} />}
                  <span>{isDark ? 'Mode Clair' : 'Mode Sombre'}</span>
                </button>

                <button
                  type="button"
                  className="drawer-action-btn"
                  style={{
                    backgroundColor: theme.primary,
                    borderColor: theme.primary,
                    color: '#FFFFFF'
                  }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    triggerInstallPwa();
                  }}
                >
                  <Download size={14} color="#FFF" />
                  <span>Installer PWA</span>
                </button>
              </div>

              <button
                type="button"
                className="drawer-action-btn drawer-admin-button"
                style={{
                  backgroundColor: theme.primaryGlow,
                  borderColor: theme.border,
                  color: theme.primary,
                }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleNav('admin');
                }}
              >
                <ShieldCheck size={15} color={theme.primary} />
                <span>Admin</span>
              </button>
            </div>

            {/* Scrollable Navigation List */}
            <div className="drawer-body">
              {/* Home Link */}
              <button
                type="button"
                className={`drawer-nav-item home-featured${currentTab === 'home' ? ' is-active' : ''}`}
                style={{
                  backgroundColor: currentTab === 'home' ? theme.primary : theme.bgCard,
                  color: currentTab === 'home' ? '#FFFFFF' : theme.text,
                  borderColor: currentTab === 'home' ? theme.primary : theme.border,
                }}
                onClick={() => handleNav('home')}
              >
                <Home size={18} color={currentTab === 'home' ? '#FFFFFF' : theme.primary} />
                <div className="drawer-item-content">
                  <span className="drawer-item-title">Page d'Accueil</span>
                  <span className="drawer-item-desc" style={{ color: currentTab === 'home' ? 'rgba(255,255,255,0.8)' : theme.textDim }}>
                    Vue générale, cycles et statistiques
                  </span>
                </div>
                <ChevronRight size={16} opacity={0.6} />
              </button>

              {/* Grouped Sections */}
              {menuGroups.map((group) => {
                const GroupIcon = group.icon;
                return (
                  <div className="drawer-section" key={group.id}>
                    <div className="drawer-section-heading">
                      <GroupIcon size={13} color={theme.primary} />
                      <span style={{ color: theme.textDim }}>{group.label.toUpperCase()}</span>
                    </div>

                    <div className="drawer-section-items">
                      {group.items.map((item) => {
                        const ItemIcon = item.icon || group.icon;
                        const isSelected =
                          currentTab === item.tab &&
                          (!item.cycle || selectedCycle === item.cycle);

                        return (
                          <button
                            type="button"
                            key={`drawer-${item.tab}-${item.cycle || item.label}`}
                            className={`drawer-item-btn${isSelected ? ' is-selected' : ''}`}
                            style={{
                              backgroundColor: isSelected ? theme.primaryGlow : theme.bgCard,
                              borderColor: isSelected ? theme.primary : theme.border,
                              color: isSelected ? theme.primary : theme.text,
                            }}
                            onClick={() => handleNav(item.tab, item.cycle)}
                          >
                            <div 
                              className="drawer-icon-box"
                              style={{
                                backgroundColor: isSelected ? theme.primary : theme.bgElevated,
                                color: isSelected ? '#FFFFFF' : theme.primary,
                              }}
                            >
                              <ItemIcon size={16} color={isSelected ? '#FFFFFF' : theme.primary} />
                            </div>

                            <div className="drawer-item-info">
                              <div className="drawer-item-title-row">
                                <span className="drawer-item-name">{item.label}</span>
                                {item.badge && (
                                  <span className="drawer-badge" style={{ backgroundColor: theme.primary, color: '#FFF' }}>
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              {item.subLabel && (
                                <span className="drawer-item-sub" style={{ color: theme.textDim }}>
                                  {item.subLabel}
                                </span>
                              )}
                            </div>

                            {isSelected ? (
                              <span className="drawer-active-dot" style={{ backgroundColor: theme.primary }} />
                            ) : (
                              <ChevronRight size={14} color={theme.textDim} opacity={0.5} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Drawer Footer */}
            <div 
              className="drawer-footer"
              style={{
                borderTopColor: theme.border,
                backgroundColor: theme.bgCard
              }}
            >
              <div className="drawer-footer-info">
                <span style={{ color: theme.text, fontWeight: 700, fontSize: 12 }}>
                  SDBSNX × UNCHK • SÉNÉGAL
                </span>
                <span style={{ color: theme.textDim, fontSize: 11 }}>
                  Plateforme Pédagogique Officielle IDA v2.0
                </span>
              </div>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
