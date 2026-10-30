import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useApp } from '../context/AppContext';
import BackToHomeBar from '../components/BackToHomeBar';
import useAdminDocuments from '../hooks/useAdminDocuments';
import { 
  Shield, 
  Lock, 
  Terminal, 
  FileText, 
  Download, 
  ExternalLink, 
  AlertTriangle, 
  Key, 
  Server, 
  Cpu, 
  Sparkles, 
  Search,
  Eye,
  CheckCircle2,
  Bug,
  GlobeLock
} from 'lucide-react';

export default function CybersecuriteView() {
  const { theme, triggerToast, setActivePdfPreview } = useApp();
  const { documents: adminDocuments, error: adminDocumentsError } = useAdminDocuments('cybersecurity');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'Toutes les ressources' },
    { id: 'fondamentaux', label: 'Fondamentaux & Crypto' },
    { id: 'reseau', label: 'Sécurité Réseau & Linux' },
    { id: 'pentest', label: 'Hacking Éthique & OWASP' },
    { id: 'normes', label: 'Lois & Normes (CDP Sénégal)' },
  ];

  // Modules et supports pédagogiques de cybersécurité
  const cyberModules = [
    {
      id: 'cyber-fondamentaux',
      category: 'fondamentaux',
      title: 'Fondamentaux de la Cybersécurité & Cryptographie',
      subtitle: 'Trilogie CIA, Chiffrement Symétrique/Asymétrique & Hachage',
      desc: 'Maîtrisez les concepts essentiels : Confidentialité, Intégrité, Disponibilité (CIA), algorithmes RSA, AES, SHA-256, gestion des clés publiques/privées et signatures numériques.',
      tag: 'Socle Académique',
      color: theme.primary,
      docsCount: 3,
      items: [
        { name: 'Cours Complet : Cryptographie Appliquée & PKI.pdf', type: 'Cours', size: '3.8 MB' },
        { name: 'Mémento Algorithmes de Chiffrement & Hachage.pdf', type: 'Fiche', size: '920 KB' },
        { name: 'TD Corrigé : Protocoles TLS/SSL & Échange Diffie-Hellman.pdf', type: 'TD/TP', size: '1.4 MB' }
      ]
    },
    {
      id: 'cyber-reseau-hardening',
      category: 'reseau',
      title: 'Sécurité des Réseaux & Hardening Systèmes',
      subtitle: 'Pare-feu, IDS/IPS, Wireshark & Sécurisation Serveur Linux',
      desc: 'Analyse de trames réseau, configuration sécurisée iptables / nftables, durcissement SSH, segmentation VLAN, détection d\'intrusions (Suricata/Snort) et sécurisation DNS/DHCP.',
      tag: 'Infrastructure',
      color: theme.emerald,
      docsCount: 4,
      items: [
        { name: 'Guide Pratique Wireshark : Analyse de Trames Suspectes.pdf', type: 'Guide', size: '4.5 MB' },
        { name: 'Checklist Hardening Serveur Linux Debian/Ubuntu.pdf', type: 'Checklist', size: '780 KB' },
        { name: 'TP Réseau : Mise en place d\'un Pare-feu iptables.pdf', type: 'TP', size: '1.9 MB' }
      ]
    },
    {
      id: 'cyber-pentest-owasp',
      category: 'pentest',
      title: 'Hacking Éthique & Vulnérabilités Web (OWASP Top 10)',
      subtitle: 'Injections SQL, Failles XSS, CSRF, IDOR & Pentest Web',
      desc: 'Comprendre la démarche des tests d\'intrusion : reconnaissance (Nmap), exploitation éthique des vulnérabilités web, remédiation de code et bonnes pratiques DevSecOps.',
      tag: 'Offensive & Defensive',
      color: theme.secondary,
      docsCount: 4,
      items: [
        { name: 'OWASP Top 10 : Guide de Vulnérabilités & Remédiations.pdf', type: 'Standard', size: '5.2 MB' },
        { name: 'Cheatsheet Commandes Nmap & Reconnaissance Réseau.pdf', type: 'Cheatsheet', size: '610 KB' },
        { name: 'Laboratoire Pentest Web : Devoir d\'Injections SQL.pdf', type: 'Lab', size: '2.1 MB' }
      ]
    },
    {
      id: 'cyber-normes-cdp',
      category: 'normes',
      title: 'Réglementation, Données Personnelles (CDP) & ISO 27001',
      subtitle: 'Cadre légal au Sénégal, RGPD & Gouvernance de la Sécurité',
      desc: 'Conformité avec la Commission des Données Personnelles (CDP Sénégal), législation contre la cybercriminalité, normes ISO/IEC 27001, analyse de risques (EBIOS / MEHARI).',
      tag: 'Gouvernance & Droit',
      color: theme.accent,
      docsCount: 3,
      items: [
        { name: 'Loi Sénégalaise sur la Protection des Données Personnelles.pdf', type: 'Loi', size: '1.7 MB' },
        { name: 'Synthèse Norme ISO 27001 & Politiques de Sécurité (PSSI).pdf', type: 'Norme', size: '2.3 MB' },
        { name: 'Guide de Réponse aux Incidents de Sécurité Informatique.pdf', type: 'Procédure', size: '1.1 MB' }
      ]
    }
  ];

  const filteredModules = cyberModules.filter(m => {
    const matchCat = activeCategory === 'all' || m.category === activeCategory;
    const matchQuery = !searchQuery || 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });
  const filteredAdminDocuments = adminDocuments.filter((document) => {
    const matchesCategory = activeCategory === 'all' || document.category === activeCategory;
    const matchesSearch = !searchQuery
      || document.title.toLowerCase().includes(searchQuery.toLowerCase())
      || document.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <View style={styles.contentWrap}>
        {/* Navigation Breadcrumb & Back to Home */}
        <BackToHomeBar 
          currentPageTitle="Ressources en Cybersécurité" 
          breadcrumbCategory="Sécurité & Systèmes" 
        />

        {/* Hero Banner */}
        <View style={[styles.heroCard, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
          <View style={styles.heroBadgeRow}>
            <View style={[styles.heroPill, { backgroundColor: theme.primaryGlow, borderColor: theme.border }]}>
              <Shield size={14} color={theme.primary} />
              <Text style={[styles.heroPillText, { color: theme.primary }]}>CYBERSÉCURITÉ & DÉFENSE NUMÉRIQUE</Text>
            </View>
            <View style={[styles.heroPill, { backgroundColor: theme.primaryGlow, borderColor: theme.border }]}>
              <Sparkles size={14} color={theme.primary} />
              <Text style={[styles.heroPillText, { color: theme.primary }]}>NOUVEAU DÉPARTEMENT</Text>
            </View>
          </View>

          <Text style={[styles.heroTitle, { color: theme.text }]}>
            Ressources, Guides & Labs de Cybersécurité
          </Text>
          <Text style={[styles.heroDesc, { color: theme.textMuted }]}>
            Espace d'apprentissage dédié à la protection des systèmes d'information, au hacking éthique, à l'analyse de réseaux et au respect des normes juridiques (CDP Sénégal, ISO 27001). Conçu pour les futurs ingénieurs et administrateurs systèmes de l'UNCHK.
          </Text>

          {/* Quick Metrics */}
          <View style={styles.metricsRow}>
            <View style={[styles.metricCard, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
              <Terminal size={18} color={theme.primary} />
              <View style={styles.metricTextCol}>
                <Text style={[styles.metricVal, { color: theme.text }]}>Offensive & Defensive</Text>
                <Text style={[styles.metricSub, { color: theme.textDim }]}>OWASP, Wireshark, Nmap, Kali</Text>
              </View>
            </View>

            <View style={[styles.metricCard, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
              <GlobeLock size={18} color={theme.primary} />
              <View style={styles.metricTextCol}>
                <Text style={[styles.metricVal, { color: theme.text }]}>Conformité CDP</Text>
                <Text style={[styles.metricSub, { color: theme.textDim }]}>Législation sénégalaise & RGPD</Text>
              </View>
            </View>

            <View style={[styles.metricCard, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
              <Lock size={18} color={theme.secondary} />
              <View style={styles.metricTextCol}>
                <Text style={[styles.metricVal, { color: theme.text }]}>Cryptographie</Text>
                <Text style={[styles.metricSub, { color: theme.textDim }]}>PKI, SSL/TLS, SHA & AES</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Search & Filter Bar */}
        <View style={styles.filterSection}>
          <View style={[styles.searchBox, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
            <Search size={16} color={theme.textDim} />
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Rechercher une faille (SQLi, XSS), un protocole (TLS), une commande Wireshark..."
              placeholderTextColor={theme.textDim}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Category Chips */}
          <View style={styles.chipsScroll}>
            {categories.map(cat => {
              const isSelected = activeCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.chipBtn,
                    isSelected 
                      ? { backgroundColor: theme.primary, borderColor: theme.primary } 
                      : { backgroundColor: theme.bgElevated, borderColor: theme.border }
                  ]}
                  onPress={() => setActiveCategory(cat.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, { color: isSelected ? '#FFFFFF' : theme.textMuted }]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Modules Grid */}
        <View style={styles.modulesGrid}>
          {filteredModules.map((mod) => (
            <View 
              key={mod.id} 
              style={[styles.moduleCard, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.tagBadge, { backgroundColor: mod.color + '20', borderColor: mod.color + '40' }]}>
                  <Text style={[styles.tagText, { color: mod.color }]}>{mod.tag}</Text>
                </View>
                <View style={styles.docCountPill}>
                  <Shield size={12} color={mod.color} />
                  <Text style={[styles.docCountText, { color: theme.textDim }]}>{mod.docsCount} supports</Text>
                </View>
              </View>

              <Text style={[styles.cardTitle, { color: theme.text }]}>{mod.title}</Text>
              <Text style={[styles.cardSub, { color: mod.color }]}>{mod.subtitle}</Text>
              <Text style={[styles.cardDesc, { color: theme.textMuted }]}>{mod.desc}</Text>

              {/* Document List */}
              <View style={styles.docList}>
                <Text style={[styles.docListHeader, { color: theme.textDim }]}>SUPPORTS ET GUIDES CYBER :</Text>
                {mod.items.map((item, idx) => (
                  <View 
                    key={idx} 
                    style={[styles.docItemRow, { backgroundColor: theme.bgCard, borderColor: theme.border }]}
                  >
                    <View style={styles.docItemLeft}>
                      <FileText size={14} color={mod.color} />
                      <Text style={[styles.docItemName, { color: theme.text }]} numberOfLines={1}>
                        {item.name}
                      </Text>
                    </View>
                    <View style={styles.docItemRight}>
                      <Text style={[styles.docItemSize, { color: theme.textDim }]}>{item.size}</Text>
                      <TouchableOpacity
                        style={[styles.docActionBtn, { backgroundColor: theme.primaryGlow }]}
                        onPress={() => triggerToast(`Préparation du document : ${item.name}`, 'info')}
                        activeOpacity={0.7}
                        title="Consulter"
                      >
                        <Download size={13} color={theme.primary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}
          {filteredAdminDocuments.map((document) => (
            <View
              key={document.id}
              style={[styles.moduleCard, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.tagBadge, { backgroundColor: theme.primaryGlow, borderColor: theme.border }]}>
                  <Text style={[styles.tagText, { color: theme.primary }]}>{document.category}</Text>
                </View>
                <Text style={[styles.docCountText, { color: theme.textDim }]}>{document.size}</Text>
              </View>
              <Text style={[styles.cardTitle, { color: theme.text }]}>{document.title}</Text>
              {!!document.description && (
                <Text style={[styles.cardDesc, { color: theme.textMuted }]}>{document.description}</Text>
              )}
              <TouchableOpacity
                style={[styles.docItemRow, { backgroundColor: theme.bgCard, borderColor: theme.border }]}
                onPress={() => {
                  if (document.downloadUrl && (document.format === 'PDF' || document.downloadUrl.toLowerCase().endsWith('.pdf'))) {
                    setActivePdfPreview({
                      name: document.title,
                      url: document.downloadUrl,
                      ext: document.format || 'PDF',
                      size: document.size
                    });
                  } else {
                    window.open(document.downloadUrl, '_blank', 'noopener,noreferrer');
                  }
                }}
                accessibilityRole="button"
                accessibilityLabel={`Consulter ${document.title}`}
              >
                <FileText size={15} color={theme.primary} />
                <Text style={[styles.docItemName, { color: theme.text }]} numberOfLines={1}>
                  {document.file_name}
                </Text>
                <Download size={14} color={theme.primary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {adminDocumentsError && (
          <Text style={{ color: theme.textMuted, fontSize: 12 }} accessibilityRole="alert">
            {adminDocumentsError}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: 'center',
  },
  contentWrap: {
    width: '100%',
    maxWidth: 1200,
    gap: 24,
  },
  heroCard: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    gap: 16,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  heroPillText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  heroDesc: {
    fontSize: 14,
    lineHeight: 22,
    maxWidth: 900,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flexWrap: 'wrap',
    marginTop: 6,
  },
  metricCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    minWidth: 140,
    maxWidth: '100%',
  },
  metricTextCol: {
    flex: 1,
    minWidth: 0,
  },
  metricVal: {
    fontSize: 14,
    fontWeight: '700',
  },
  metricSub: {
    fontSize: 12,
    lineHeight: 16,
  },
  filterSection: {
    gap: 14,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    outlineStyle: 'none',
  },
  chipsScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  chipBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  modulesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
    gap: 18,
  },
  moduleCard: {
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  docCountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  docCountText: {
    fontSize: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
  },
  cardSub: {
    fontSize: 12,
    fontWeight: '700',
  },
  cardDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  docList: {
    marginTop: 8,
    gap: 8,
  },
  docListHeader: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  docItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    gap: 10,
  },
  docItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  docItemName: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
    minWidth: 0,
  },
  docItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  docItemSize: {
    fontSize: 11,
  },
  docActionBtn: {
    width: 26,
    height: 26,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadBox: {
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    padding: 24,
    marginTop: 10,
  },
  uploadBoxInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 18,
  },
  uploadIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadTextCol: {
    flex: 1,
    minWidth: 0,
    width: '100%',
    gap: 4,
  },
  uploadTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  uploadDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  addDocBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addDocBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  }
});
