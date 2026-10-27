import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { X, ExternalLink, Download, FileText, Sparkles } from 'lucide-react';

export default function PdfViewerModal() {
  const { activePdfPreview, setActivePdfPreview, theme } = useApp();

  if (!activePdfPreview) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity 
        style={styles.backdrop} 
        activeOpacity={1} 
        onPress={() => setActivePdfPreview(null)} 
      />

      <View style={[styles.modalCard, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
        {/* Header */}
        <View style={[styles.headerRow, { borderBottomColor: theme.border }]}>
          <View style={styles.docInfoCol}>
            <View style={styles.badgeRow}>
              <View style={[styles.extBadge, { backgroundColor: theme.primaryGlow }]}>
                <FileText size={13} color={theme.primary} />
                <Text style={[styles.extBadgeText, { color: theme.primary }]}>{activePdfPreview.ext || 'DOC'}</Text>
              </View>
              {activePdfPreview.size && (
                <Text style={[styles.sizeText, { color: theme.textDim }]}>{activePdfPreview.size}</Text>
              )}
            </View>
            <Text style={[styles.docTitle, { color: theme.text }]} numberOfLines={1}>
              {activePdfPreview.name || activePdfPreview.filename || 'Support de Cours'}
            </Text>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: theme.bgCard, borderColor: theme.border }]}
              onPress={() => window.open(activePdfPreview.url, '_blank')}
              title="Ouvrir dans un nouvel onglet"
            >
              <ExternalLink size={16} color={theme.primary} />
              <Text style={[styles.actionBtnText, { color: theme.text }]}>Plein écran</Text>
            </TouchableOpacity>

            <a
              href={activePdfPreview.url}
              download
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 10,
                backgroundColor: theme.primary,
                color: '#FFFFFF',
                fontSize: 13,
                fontWeight: 600
              }}
            >
              <Download size={14} color="#FFF" />
              <span>Télécharger</span>
            </a>

            <TouchableOpacity
              style={[styles.closeBtn, { backgroundColor: theme.bgCard, borderColor: theme.border }]}
              onPress={() => setActivePdfPreview(null)}
            >
              <X size={18} color={theme.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Embedded Document Viewer */}
        <View style={styles.viewerWrapper}>
          {activePdfPreview.ext === 'PDF' || activePdfPreview.url.toLowerCase().endsWith('.pdf') ? (
            <iframe
              src={`${activePdfPreview.url}#toolbar=1&navpanes=0`}
              title={activePdfPreview.name}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                backgroundColor: '#1E293B',
              }}
            />
          ) : (
            <View style={styles.nonPdfPlaceholder}>
              <FileText size={48} color={theme.primary} />
              <Text style={[styles.nonPdfTitle, { color: theme.text }]}>Format {activePdfPreview.ext}</Text>
              <Text style={[styles.nonPdfSub, { color: theme.textMuted }]}>
                Ce type de support ({activePdfPreview.ext}) s'ouvre ou se télécharge directement.
              </Text>
              <a
                href={activePdfPreview.url}
                download
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 24px',
                  borderRadius: 12,
                  backgroundColor: theme.primary,
                  color: '#FFFFFF',
                  fontWeight: 700,
                  marginTop: 14
                }}
              >
                <Download size={16} color="#FFF" />
                <span>Télécharger le document</span>
              </a>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(8px)',
  },
  modalCard: {
    width: '100%',
    maxWidth: 1040,
    height: '90vh',
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
  },
  headerRow: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  docInfoCol: {
    flex: 1,
    gap: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  extBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  extBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  sizeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  docTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewerWrapper: {
    flex: 1,
    width: '100%',
    backgroundColor: '#0F172A',
  },
  nonPdfPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    textAlign: 'center',
  },
  nonPdfTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 16,
  },
  nonPdfSub: {
    fontSize: 14,
    maxWidth: 400,
    marginTop: 8,
    textAlign: 'center',
  }
});
