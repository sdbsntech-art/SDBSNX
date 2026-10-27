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
  Sun,
  Users,
  Video,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const menuGroups = [
  {
    id: 'cours',
    label: 'Cours',
    icon: GraduationCap,
    activeTabs: ['licence'],
    items: [
      { tab: 'licence', cycle: 'L1', label: 'Licence 1' },
      { tab: 'licence', cycle: 'L2', label: 'Licence 2' },
      { tab: 'licence', cycle: 'L3', label: 'Licence 3' },
    ],
  },
  {
    id: 'explorer',
    label: 'Explorer',
    icon: BookOpen,
    activeTabs: ['cybersecurite', 'entrepreneuriat', 'videos', 'bibliotheque'],
    items: [
      { tab: 'cybersecurite', label: 'Cybersécurité', icon: Shield },
      { tab: 'entrepreneuriat', label: 'Entrepreneuriat', icon: Rocket },
      { tab: 'videos', label: 'Vidéos', icon: Video },
      { tab: 'bibliotheque', label: 'Bibliothèque', icon: BookOpen },
    ],
  },
  {
    id: 'communaute',
    label: 'Communauté',
    icon: Users,
    activeTabs: ['formateurs', 'forum', 'faq'],
    items: [
      { tab: 'formateurs', label: 'Nos formateurs', icon: Users },
      { tab: 'forum', label: 'Discussion', icon: MessageSquare },
      { tab: 'faq', label: 'Aide et FAQ', icon: HelpCircle },
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
              boxShadow: `0 14px 36px ${isDark ? 'rgba(0,0,0,0.28)' : 'rgba(31,51,39,0.12)'}`,
            }}
            role="menu"
          >
            {group.items.map((item) => {
              const ItemIcon = item.icon;
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
          ? `0 4px 18px ${isDark ? 'rgba(0,0,0,0.2)' : 'rgba(31,51,39,0.07)'}`
          : 'none',
      }}
      ref={headerRef}
    >
      <div className="site-header-inner">
        <button
          type="button"
          className="site-brand"
          onClick={() => handleNav('home')}
          aria-label="SDBSNX IDA — Accueil"
        >
          <img src="/sdbsnx-logo.png" alt="" className="site-brand-logo" />
          <span className="site-brand-copy">
            <span className="site-brand-name" style={{ color: theme.text }}>
              SDBSNX <span style={{ color: theme.primary }}>•</span> IDA
            </span>
            <span className="site-brand-subtitle" style={{ color: theme.textDim }}>
              UNCHK SÉNÉGAL
            </span>
          </span>
        </button>

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
            <Search size={17} aria-hidden="true" />
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
            {isDark ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
          </button>
          <button
            type="button"
            className="header-install-button"
            style={{ backgroundColor: theme.primary }}
            onClick={triggerInstallPwa}
          >
            <Download size={15} aria-hidden="true" />
            <span>Installer</span>
          </button>
          <button
            type="button"
            className="header-icon-button mobile-menu-button"
            style={{
              color: theme.textMuted,
              borderColor: theme.border,
              backgroundColor: theme.bgCard,
            }}
            onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-primary-navigation"
          >
            {mobileMenuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <nav
          id="mobile-primary-navigation"
          className="mobile-nav-panel"
          style={{ backgroundColor: theme.bgElevated, borderTopColor: theme.border }}
          aria-label="Navigation principale"
        >
          <button
            type="button"
            className="mobile-nav-item"
            style={{
              color: currentTab === 'home' ? theme.primary : theme.text,
              backgroundColor: currentTab === 'home' ? theme.primaryGlow : 'transparent',
            }}
            onClick={() => handleNav('home')}
          >
            <Home size={17} aria-hidden="true" />
            <span>Accueil</span>
          </button>
          {menuGroups.map((group) => (
            <div className="mobile-nav-section" key={group.id}>
              <span className="mobile-nav-heading" style={{ color: theme.textDim }}>
                {group.label}
              </span>
              {group.items.map((item) => {
                const ItemIcon = item.icon || group.icon;
                const selected =
                  currentTab === item.tab &&
                  (!item.cycle || selectedCycle === item.cycle);
                return (
                  <button
                    type="button"
                    className="mobile-nav-item"
                    key={`mobile-${item.tab}-${item.cycle || item.label}`}
                    style={{
                      color: selected ? theme.primary : theme.text,
                      backgroundColor: selected ? theme.primaryGlow : 'transparent',
                    }}
                    onClick={() => handleNav(item.tab, item.cycle)}
                  >
                    <ItemIcon size={17} aria-hidden="true" />
                    <span>{item.label}</span>
                    {selected && <span className="nav-current-indicator" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      )}
    </header>
  );
}
