import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { X, Bookmark, BookmarkCheck, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';

export default function VideoPlayerModal() {
  const { activeVideo, setActiveVideo, theme, bookmarkedVideos, toggleBookmarkVideo, triggerToast } = useApp();
  const [note, setNote] = useState('');
  const [isWatched, setIsWatched] = useState(false);

  useEffect(() => {
    if (activeVideo) {
      const savedNote = localStorage.getItem(`ida_note_${activeVideo.id}`) || '';
      setNote(savedNote);
      const watched = localStorage.getItem(`ida_watched_${activeVideo.id}`) === 'true';
      setIsWatched(watched);
    }
  }, [activeVideo]);

  if (!activeVideo) return null;

  const isBookmarked = bookmarkedVideos.includes(activeVideo.id);

  const handleSaveNote = (text) => {
    setNote(text);
    localStorage.setItem(`ida_note_${activeVideo.id}`, text);
  };

  const handleToggleWatched = () => {
    const next = !isWatched;
    setIsWatched(next);
    localStorage.setItem(`ida_watched_${activeVideo.id}`, String(next));
    triggerToast(next ? 'Vidéo marquée comme terminée ! 🏆' : 'Statut réinitialisé', 'info');
  };

  return (
    <View style={styles.overlay}>
      <TouchableOpacity 
        style={styles.backdrop} 
        activeOpacity={1} 
        onPress={() => setActiveVideo(null)} 
      />

      <View style={[styles.modalCard, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
        {/* Modal Header */}
        <View style={[styles.headerRow, { borderBottomColor: theme.border }]}>
          <View style={styles.headerInfo}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <img 
                src="/sdbsnx-logo.png" 
                alt="SDBSNX" 
                style={{ height: 24, width: 'auto', borderRadius: 4, background: '#FFFFFF', padding: '1px 3px' }} 
              />
              <img 
                src="/unchk-uvs-logo.png" 
                alt="UNCHK" 
                style={{ height: 24, width: 'auto', borderRadius: 4, background: '#FFFFFF', padding: '1px 3px' }} 
              />
            </View>
            <View style={[styles.badgePill, { backgroundColor: activeVideo.color + '22', borderColor: activeVideo.color }]}>
              <Text style={[styles.badgeText, { color: activeVideo.color }]}>
                {activeVideo.matiereLabel}
              </Text>
            </View>
            <Text style={[styles.modalTitle, { color: theme.text }]} numberOfLines={1}>
              {activeVideo.title}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.closeBtn, { backgroundColor: theme.bgCard, borderColor: theme.border }]}
            onPress={() => setActiveVideo(null)}
            activeOpacity={0.7}
          >
            <X size={18} color={theme.text} />
          </TouchableOpacity>
        </View>

        {/* Video Player Container */}
        <View style={styles.playerWrapper}>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${activeVideo.id}?autoplay=1&rel=0`}
            title={activeVideo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: 0,
            }}
          />
        </View>

        {/* Action Controls & Notes */}
        <View style={styles.bodyContent}>
          <View style={styles.toolbarRow}>
            {/* Toggle Watched */}
            <TouchableOpacity
              style={[
                styles.toolBtn,
                { borderColor: theme.border, backgroundColor: isWatched ? theme.emerald + '22' : theme.bgCard }
              ]}
              onPress={handleToggleWatched}
              activeOpacity={0.7}
            >
              <CheckCircle2 size={16} color={isWatched ? theme.emerald : theme.textMuted} />
              <Text style={[styles.toolBtnText, { color: isWatched ? theme.emerald : theme.text }]}>
                {isWatched ? 'Terminé' : 'Marquer comme vu'}
              </Text>
            </TouchableOpacity>

            {/* Bookmark */}
            <TouchableOpacity
              style={[
                styles.toolBtn,
                { borderColor: theme.border, backgroundColor: isBookmarked ? theme.accent + '22' : theme.bgCard }
              ]}
              onPress={() => {
                toggleBookmarkVideo(activeVideo.id);
                triggerToast(isBookmarked ? 'Retiré des favoris' : 'Ajouté aux favoris ⭐', 'success');
              }}
              activeOpacity={0.7}
            >
              {isBookmarked ? (
                <BookmarkCheck size={16} color={theme.accent} />
              ) : (
                <Bookmark size={16} color={theme.textMuted} />
              )}
              <Text style={[styles.toolBtnText, { color: isBookmarked ? theme.accent : theme.text }]}>
                {isBookmarked ? 'Favori' : 'Sauvegarder'}
              </Text>
            </TouchableOpacity>

            {/* External YouTube link */}
            <TouchableOpacity
              style={[styles.toolBtn, { borderColor: theme.border, backgroundColor: theme.bgCard }]}
              onPress={() => window.open(activeVideo.url, '_blank')}
              activeOpacity={0.7}
            >
              <ExternalLink size={15} color={theme.textMuted} />
              <Text style={[styles.toolBtnText, { color: theme.text }]}>YouTube</Text>
            </TouchableOpacity>

            {/* Visit Grafikart */}
            <TouchableOpacity
              style={[styles.toolBtn, { borderColor: theme.primary, backgroundColor: theme.primaryGlow }]}
              onPress={() => window.open('https://grafikart.fr', '_blank')}
              activeOpacity={0.7}
            >
              <Text style={[styles.toolBtnText, { color: theme.primary, fontWeight: '700' }]}>Grafikart.fr</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Study Notes */}
          <View style={[styles.notesCard, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
            <View style={styles.notesHeader}>
              <Sparkles size={14} color={theme.primary} />
              <Text style={[styles.notesTitle, { color: theme.textMuted }]}>
                Vos notes d'étude personnelles (sauvegardées automatiquement) :
              </Text>
            </View>
            <TextInput
              style={[styles.notesInput, { color: theme.text }]}
              placeholder="Écrivez vos mémos, syntaxes et points clés ici..."
              placeholderTextColor={theme.textDim}
              value={note}
              onChangeText={handleSaveNote}
              multiline
              numberOfLines={3}
            />
          </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    backdropFilter: 'blur(10px)',
  },
  modalCard: {
    width: '100%',
    maxWidth: 880,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7)',
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 12,
  },
  badgePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerWrapper: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000000',
  },
  bodyContent: {
    padding: 16,
    gap: 12,
  },
  toolbarRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  toolBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  toolBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  notesCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  notesTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  notesInput: {
    fontSize: 14,
    minHeight: 50,
    outlineStyle: 'none',
  }
});
