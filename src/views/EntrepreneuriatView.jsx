import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useApp } from '../context/AppContext';
import BackToHomeBar from '../components/BackToHomeBar';
import useAdminDocuments from '../hooks/useAdminDocuments';
import { 
  Rocket, 
  Briefcase, 
  TrendingUp, 
  FileText, 
  Download, 
  ExternalLink, 
  Lightbulb, 
  ShieldCheck, 
  Users, 
  Target, 
  Building2, 
  DollarSign, 
  Sparkles, 
  Search,
  BookOpen,
  Award,
  ChevronRight
} from 'lucide-react';

export default function EntrepreneuriatView() {
  const { theme, triggerToast, setActivePdfPreview } = useApp();
  const { documents: adminDocuments, error: adminDocumentsError } = useAdminDocuments('entrepreneurship');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'Tous les modules' },
    { id: 'creation', label: 'Création & Statuts (Sénégal)' },
    { id: 'business', label: 'Business Model & Pitch' },
    { id: 'financement', label: 'Financement & Incubation' },
    { id: 'documents', label: 'Espace Documents & Modèles' },
  ];

  // Modules et ressources pour l'entrepreneuriat tech
  const startupModules = [
    {
      id: 'statuts-sn',
      category: 'creation',
      title: 'Création d’Entreprise au Sénégal : Formalisation & NINEA',
      subtitle: 'Guide des formes juridiques : SAS, SARL, SUARL et GIE',
      desc: 'Comprendre les démarches auprès de l\'APIX, l\'obtention du RCCM, du NINEA et le choix du statut juridique optimal pour une startup tech ou une agence web.',
      tag: 'Guide Juridique',
      color: theme.primary,
      docsCount: 3,
      items: [
        { name: 'Guide APIX Formalisation d\'entreprise.pdf', type: 'PDF', size: '2.4 MB' },
        { name: 'Comparatif Statuts Juridiques Sénégal (SARL vs SAS).pdf', type: 'PDF', size: '1.1 MB' },
        { name: 'Checklist Pièces à fournir pour le NINEA.pdf', type: 'PDF', size: '420 KB' }
      ]
    },
    {
      id: 'bmc-pitch',
      category: 'business',
      title: 'Business Model Canvas & Stratégie Go-To-Market',
      subtitle: 'Structurer sa proposition de valeur et son modèle économique',
      desc: 'Méthodologie Lean Startup adaptée au marché africain : identification des segments clients, canaux de distribution, flux de revenus et métriques clés (CAC, LTV).',
      tag: 'Méthodologie',
      color: theme.primary,
      docsCount: 4,
      items: [
        { name: 'Modèle Business Model Canvas Vierge (Français).pdf', type: 'Modèle', size: '850 KB' },
        { name: 'Template Pitch Deck Professionnel 10 Slides.pptx', type: 'Template', size: '4.2 MB' },
        { name: 'Exemple Réel : Startup EdTech Sénégal BMC.pdf', type: 'Étude de cas', size: '1.8 MB' }
      ]
    },
    {
      id: 'financement-incubateurs',
      category: 'financement',
      title: 'Écosystème de Financement & Incubateurs au Sénégal',
      subtitle: 'Où trouver des fonds, des bourses et de l\'accompagnement',
      desc: 'Panorama complet des acteurs d\'amorçage : DER/FJ (Délégation à l\'Entreprenariat Rapide), CTIC Dakar, Orange Fab, Force-N, fonds d\'amorçage et concours universitaires.',
      tag: 'Écosystème',
      color: theme.secondary,
      docsCount: 3,
      items: [
        { name: 'Cartographie de l\'Écosystème Startup Sénégal.pdf', type: 'Guide', size: '3.1 MB' },
        { name: 'Dossier de candidature DER/FJ - Pôle Numérique.pdf', type: 'Formulaire', size: '1.5 MB' },
        { name: 'Annuaire des Incubateurs & Accélérateurs Tech Dakar.pdf', type: 'Répertoire', size: '890 KB' }
      ]
    },
    {
      id: 'mvp-produit',
      category: 'business',
      title: 'De l’Idée au MVP (Minimum Viable Product)',
      subtitle: 'Concevoir et tester une solution web/mobile sans gaspillage',
      desc: 'Stratégie de prototypage rapide avec les technologies web (React, Node, Firebase, No-Code) pour valider la demande auprès des utilisateurs sénégalais avant d\'investir.',
      tag: 'Tech Product',
      color: theme.secondary,
      docsCount: 2,
      items: [
        { name: 'Guide de Spécification Fonctionnelle MVP.pdf', type: 'Méthode', size: '1.2 MB' },
        { name: 'Grille d\'Entretiens Utilisateurs & Validation.xlsx', type: 'Outil', size: '650 KB' }
      ]
    }
  ];

  const filteredModules = startupModules.filter(m => {
    const matchCat = activeCategory === 'all' || m.category === activeCategory || (activeCategory === 'documents');
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
          currentPageTitle="Entrepreneuriat & Startups Tech" 
          breadcrumbCategory="Innovation" 
        />

        {/* Hero Banner */}
        <View style={[styles.heroCard, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
          <View style={styles.heroBadgeRow}>
            <View style={[styles.heroPill, { backgroundColor: theme.primaryGlow, borderColor: theme.border }]}>
              <Rocket size={14} color={theme.primary} />
              <Text style={styles.heroPillText}>PÔLE INNOVATION & ENTREPRENEURIAT</Text>
            </View>
            <View style={[styles.heroPill, { backgroundColor: theme.primaryGlow, borderColor: theme.border }]}>
              <Sparkles size={14} color={theme.primary} />
              <Text style={[styles.heroPillText, { color: theme.primary }]}>NOUVELLE SECTION</Text>
            </View>
          </View>

          <Text style={[styles.heroTitle, { color: theme.text }]}>
            Entrepreneuriat Tech & Création de Startups
          </Text>
          <Text style={[styles.heroDesc, { color: theme.textMuted }]}>
            Transformez vos compétences informatiques en projets concrets et viables. Retrouvez ici les guides légaux (création au Sénégal), méthodologies Lean Startup, modèles de pitch deck et opportunités de financement pour les étudiants et diplômés de l'UNCHK.
          </Text>

          {/* Quick Metrics */}
          <View style={styles.metricsRow}>
            <View style={[styles.metricCard, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
              <Briefcase size={18} color={theme.primary} />
              <View style={styles.metricTextCol}>
                <Text style={[styles.metricVal, { color: theme.text }]}>4 Pôles Clés</Text>
                <Text style={[styles.metricSub, { color: theme.textDim }]}>Juridique, BMC, Pitch & Fonds</Text>
              </View>
            </View>

            <View style={[styles.metricCard, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
              <Building2 size={18} color={theme.primary} />
              <View style={styles.metricTextCol}>
                <Text style={[styles.metricVal, { color: theme.text }]}>Sénégal & UEMOA</Text>
                <Text style={[styles.metricSub, { color: theme.textDim }]}>Conforme APIX, NINEA & RCCM</Text>
              </View>
            </View>

            <View style={[styles.metricCard, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
              <DollarSign size={18} color={theme.secondary} />
              <View style={styles.metricTextCol}>
                <Text style={[styles.metricVal, { color: theme.text }]}>Financement</Text>
                <Text style={[styles.metricSub, { color: theme.textDim }]}>DER/FJ, Force-N & Incubateurs</Text>
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
              placeholder="Rechercher un guide, un modèle de pitch, une démarche APIX..."
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
                  <FileText size={12} color={theme.textDim} />
                  <Text style={[styles.docCountText, { color: theme.textDim }]}>{mod.docsCount} supports</Text>
                </View>
              </View>

              <Text style={[styles.cardTitle, { color: theme.text }]}>{mod.title}</Text>
              <Text style={[styles.cardSub, { color: mod.color }]}>{mod.subtitle}</Text>
              <Text style={[styles.cardDesc, { color: theme.textMuted }]}>{mod.desc}</Text>

              {/* Document List */}
              <View style={styles.docList}>
                <Text style={[styles.docListHeader, { color: theme.textDim }]}>DOCUMENTS DISPONIBLES :</Text>
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
                        onPress={() => triggerToast(`Préparation du téléchargement : ${item.name}`, 'info')}
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
    color: '#1E5B45',
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
