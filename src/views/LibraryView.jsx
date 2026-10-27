import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { LIBRARY_DATA } from '../data/libraryData';
import BackToHomeBar from '../components/BackToHomeBar';
import useAdminDocuments from '../hooks/useAdminDocuments';
import { 
  BookOpen, 
  Search, 
  Download, 
  FileText, 
  Layers, 
  Sparkles, 
  ExternalLink 
} from 'lucide-react';

export default function LibraryView() {
  const { theme, triggerToast } = useApp();
  const { documents: adminDocuments, error: adminDocumentsError } = useAdminDocuments('library');
  const [filterCat, setFilterCat] = useState('all');
  const [searchDoc, setSearchDoc] = useState('');
  const allDocuments = [...LIBRARY_DATA, ...adminDocuments];

  const categories = [
    { id: 'all', label: 'Tous les manuels' },
    { id: 'Web', label: 'Web & Sémantique' },
    { id: 'Algorithmique', label: 'Algorithmique & Big O' },
    { id: 'Bases de Données', label: 'Bases de Données (SQL/Merise)' },
    { id: 'Langage C', label: 'Langage C & Pointeurs' },
    { id: 'Sécurité', label: 'Sécurité & Cryptographie' },
    { id: 'Mobile', label: 'Mobile & React Native' }
  ];

  const filteredDocs = allDocuments.filter((doc) => {
    if (filterCat !== 'all' && doc.category !== filterCat) return false;
    if (searchDoc.trim()) {
      const q = searchDoc.toLowerCase();
      return doc.title.toLowerCase().includes(q) || doc.description.toLowerCase().includes(q);
    }
    return true;
  });

  const handleDownload = (doc) => {
    triggerToast(`Ouverture du document : ${doc.title}`, 'info');
    if (doc.downloadUrl && doc.downloadUrl !== '#') {
      window.open(doc.downloadUrl, '_blank', 'noopener,noreferrer');
    } else {
      triggerToast('Ce document n’a pas encore de fichier associé.', 'info');
    }
  };

  return (
    <View style={styles.container}>
      {/* Back to Home Navigation Bar */}
      <BackToHomeBar 
        currentPageTitle="Bibliothèque Numérique • E-books & Références" 
        breadcrumbCategory="Ressources d'Étude" 
      />

      {/* Header */}
      <View style={styles.headerArea}>
        <View style={[styles.headerBadge, { backgroundColor: theme.bgCard, borderColor: theme.border, borderWidth: 1 }]}>
          <img 
            src="/sdbsnx-logo.png" 
            alt="SDBSNX" 
            style={{ height: 18, width: 'auto', borderRadius: 4, background: '#FFFFFF', padding: '1px 3px' }} 
          />
          <View style={{ width: 1, height: 14, backgroundColor: theme.border }} />
          <img 
            src="/unchk-uvs-logo.png" 
            alt="UNCHK" 
            style={{ height: 18, width: 'auto', borderRadius: 4, background: '#FFFFFF', padding: '1px 3px' }} 
          />
          <Text style={[styles.headerBadgeText, { color: theme.primary }]}>SDBSNX × UNCHK • BIBLIOTHÈQUE</Text>
        </View>
        <Text style={[styles.pageTitle, { color: theme.text }]}>
          Manuels de Référence & Fiches Mémento
        </Text>
        <Text style={[styles.pageDesc, { color: theme.textMuted }]}>
          Retrouvez les guides essentiels, aides-mémoires de syntaxe, livres blancs et cours théoriques au format PDF téléchargeable.
        </Text>

        {/* Search */}
        <View style={[styles.searchBox, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
          <Search size={18} color={theme.textDim} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Rechercher un livre, mémento, cours de cryptographie ou SQL..."
            placeholderTextColor={theme.textDim}
            value={searchDoc}
            onChangeText={setSearchDoc}
          />
        </View>

        {/* Category Filters */}
        <View style={styles.catChipsWrap}>
          {categories.map((c) => {
            const isSel = filterCat === c.id;
            return (
              <TouchableOpacity
                key={c.id}
                style={[
                  styles.catChip,
                  { borderColor: theme.border, backgroundColor: isSel ? theme.primary : theme.bgElevated }
                ]}
                onPress={() => setFilterCat(c.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.catChipText, { color: isSel ? '#FFF' : theme.textMuted }]}>
                  {c.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Grid of Books & Guides */}
      <View style={styles.docsGrid}>
        {filteredDocs.map((doc) => (
          <View 
            key={doc.id} 
            style={[styles.docCard, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}
          >
            <View style={styles.docTopRow}>
              <View style={[styles.formatTag, { backgroundColor: theme.primaryGlow }]}>
                <Text style={[styles.formatTagText, { color: theme.primary }]}>{doc.format}</Text>
              </View>
              <Text style={[styles.sizeBadge, { color: theme.textDim }]}>{doc.size}</Text>
            </View>

            <View style={styles.docIconWrap}>
              <FileText size={32} color={theme.secondary} />
            </View>

            <Text style={[styles.docTitle, { color: theme.text }]}>{doc.title}</Text>
            <Text style={[styles.docDesc, { color: theme.textMuted }]} numberOfLines={3}>{doc.description}</Text>

            <View style={styles.docMetaRow}>
              <Text style={[styles.docPages, { color: theme.textDim }]}>
                {doc.pages ? `${doc.pages} pages` : 'Document ajouté'}
              </Text>
              <View style={[styles.catPill, { backgroundColor: theme.bgSecondary }]}>
                <Text style={[styles.catPillText, { color: theme.textMuted }]}>{doc.category}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.downloadBtn, { backgroundColor: theme.primary }]}
              onPress={() => handleDownload(doc)}
              activeOpacity={0.8}
            >
              <Download size={15} color="#FFFFFF" />
              <Text style={styles.downloadBtnText}>Consulter / Télécharger</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      {adminDocumentsError && (
        <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 16 }} accessibilityRole="alert">
          {adminDocumentsError}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 1320,
    marginHorizontal: 'auto',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 60,
  },
  headerArea: {
    alignItems: 'center',
    textAlign: 'center',
    gap: 12,
    marginBottom: 36,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  headerBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center',
    '@media (max-width: 640px)': {
      fontSize: 24,
    }
  },
  pageDesc: {
    fontSize: 15,
    maxWidth: 720,
    textAlign: 'center',
    lineHeight: 22,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
    maxWidth: 720,
    width: '100%',
    marginVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    outlineStyle: 'none',
  },
  catChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    maxWidth: 920,
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  catChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  docsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    justifyContent: 'center',
  },
  docCard: {
    flex: 1,
    minWidth: 280,
    maxWidth: 380,
    padding: 22,
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
  },
  docTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  formatTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  formatTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sizeBadge: {
    fontSize: 11,
    fontWeight: '600',
  },
  docIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
  },
  docTitle: {
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
    minHeight: 44,
  },
  docDesc: {
    fontSize: 13,
    lineHeight: 18,
    minHeight: 54,
  },
  docMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
  },
  docPages: {
    fontSize: 12,
    fontWeight: '500',
  },
  catPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  catPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 6,
  },
  downloadBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  }
});
