import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { VIDEOS_DATA, VIDEO_CATEGORIES } from '../data/videosData';
import BackToHomeBar from '../components/BackToHomeBar';
import { 
  Video, 
  Search, 
  Play, 
  Bookmark, 
  BookmarkCheck, 
  CheckCircle2, 
  Sparkles,
  ExternalLink,
  Globe,
  Youtube,
  Star,
  Heart,
  ChevronDown,
  Layers
} from 'lucide-react';

export default function VideosView() {
  const { 
    theme, 
    setActiveVideo, 
    bookmarkedVideos, 
    toggleBookmarkVideo, 
    triggerToast,
    selectedVideoCategory,
    setSelectedVideoCategory
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(24);

  // Filtered videos
  const filteredVideos = useMemo(() => {
    return VIDEOS_DATA.filter((v) => {
      // Category filter
      if (selectedVideoCategory !== 'all' && v.matiere !== selectedVideoCategory) {
        return false;
      }
      // Bookmark filter
      if (showBookmarksOnly && !bookmarkedVideos.includes(v.id)) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = v.title.toLowerCase().includes(q);
        const matchesMatiere = v.matiereLabel.toLowerCase().includes(q);
        const matchesAuthor = (v.author || '').toLowerCase().includes(q);
        return matchesTitle || matchesMatiere || matchesAuthor;
      }
      return true;
    });
  }, [selectedVideoCategory, searchQuery, showBookmarksOnly, bookmarkedVideos]);

  const displayedVideos = useMemo(() => {
    return filteredVideos.slice(0, visibleCount);
  }, [filteredVideos, visibleCount]);

  const handleCategorySelect = (catId) => {
    setSelectedVideoCategory(catId);
    setVisibleCount(24);
  };

  return (
    <View style={styles.container}>
      {/* Back to Home Navigation Bar */}
      <BackToHomeBar 
        currentPageTitle="Vidéothèque HD • 123 Formations" 
        breadcrumbCategory="Grafikart & IDA" 
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
          <Text style={[styles.headerBadgeText, { color: theme.primary }]}>SDBSNX × UNCHK • VIDÉOTHÈQUE OFFICIELLE</Text>
        </View>

        <Text style={[styles.pageTitle, { color: theme.text }]} className="fluid-page-title">
          123 Tutoriels & Formations Vidéos HD
        </Text>
        <Text style={[styles.pageDesc, { color: theme.textMuted }]}>
          Des cours complets et pratiques dispensés par <Text style={{ fontWeight: '700', color: theme.primary }}>Grafikart (Jonathan Boyer)</Text> pour maîtriser pas à pas chaque technologie web et mobile.
        </Text>

        {/* Tribute & Thank You Banner for Grafikart */}
        <View style={[styles.tributeBanner, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
          <View style={styles.tributeBannerHeader}>
            <View style={[styles.tributeTag, { backgroundColor: theme.primaryGlow }]}>
              <Star size={13} color={theme.accent} fill={theme.accent} />
              <Text style={{ fontSize: 11, fontWeight: '800', color: theme.accent }}>AVEC L'AUTORISATION BIENVEILLANTE DE GRAFIKART</Text>
            </View>
            <View style={styles.tributeLinksRow}>
              <TouchableOpacity 
                style={[styles.smallLinkBtn, { borderColor: theme.border, backgroundColor: theme.bgCard }]}
                onPress={() => window.open('https://grafikart.fr', '_blank')}
              >
                <Globe size={13} color={theme.primary} />
                <Text style={[styles.smallLinkBtnText, { color: theme.primary }]}>grafikart.fr</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.smallLinkBtn, { borderColor: theme.border, backgroundColor: theme.bgCard }]}
                onPress={() => window.open('https://www.youtube.com/@grafikart', '_blank')}
              >
                <Youtube size={13} color={theme.primary} />
                <Text style={[styles.smallLinkBtnText, { color: theme.primary }]}>YouTube @grafikart</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={[styles.tributeText, { color: theme.textMuted }]}>
            Ces tutoriels d'exception sont l'œuvre de <Text style={{ fontWeight: '700', color: theme.text }}>Jonathan Boyer</Text>, l'un des formateurs qui a permis au fondateur de SDBSNX de devenir développeur professionnel. Merci infiniment pour son soutien indéfectible à l'apprentissage du code en Afrique et dans toute la francophonie.
          </Text>
        </View>

        {/* Search & Favorites Toggle */}
        <View style={styles.searchBarRow}>
          <View style={[styles.searchBox, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
            <Search size={18} color={theme.textDim} />
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Rechercher une vidéo par titre, sujet ou technologie..."
              placeholderTextColor={theme.textDim}
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                setVisibleCount(24);
              }}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.favToggleBtn,
              { borderColor: theme.border, backgroundColor: showBookmarksOnly ? theme.accent + '22' : theme.bgElevated }
            ]}
            onPress={() => setShowBookmarksOnly(!showBookmarksOnly)}
            activeOpacity={0.8}
          >
            {showBookmarksOnly ? (
              <BookmarkCheck size={18} color={theme.accent} />
            ) : (
              <Bookmark size={18} color={theme.textMuted} />
            )}
            <Text style={[styles.favToggleText, { color: showBookmarksOnly ? theme.accent : theme.text }]}>
              Favoris ({bookmarkedVideos.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Category Chips Bar */}
        <View style={styles.categoryChipsWrap}>
          {VIDEO_CATEGORIES.map((cat) => {
            const isSelected = selectedVideoCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  { borderColor: isSelected ? theme.primary : theme.border, backgroundColor: isSelected ? theme.primary : theme.bgElevated }
                ]}
                onPress={() => handleCategorySelect(cat.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.categoryChipText, { color: isSelected ? '#FFFFFF' : theme.textMuted, fontWeight: isSelected ? '800' : '600' }]}>
                  {cat.label} ({cat.count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Results Counter */}
        <View style={styles.resultsInfoRow}>
          <Text style={[styles.resultsCountText, { color: theme.textDim }]}>
            Affichage de <Text style={{ fontWeight: '700', color: theme.text }}>{Math.min(displayedVideos.length, filteredVideos.length)}</Text> sur <Text style={{ fontWeight: '700', color: theme.text }}>{filteredVideos.length}</Text> vidéos correspondantes
          </Text>
        </View>
      </View>

      {/* Videos Grid */}
      <View style={styles.videosGrid}>
        {filteredVideos.length === 0 ? (
          <View style={[styles.noVideosCard, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
            <Video size={36} color={theme.textDim} />
            <Text style={[styles.noVideosTitle, { color: theme.text }]}>Aucune vidéo trouvée</Text>
            <Text style={[styles.noVideosSub, { color: theme.textMuted }]}>
              Essayez de réinitialiser vos filtres ou effectuez une autre recherche.
            </Text>
            <TouchableOpacity
              style={[styles.resetBtn, { backgroundColor: theme.primary }]}
              onPress={() => {
                setSelectedVideoCategory('all');
                setSearchQuery('');
                setShowBookmarksOnly(false);
              }}
            >
              <Text style={styles.resetBtnText}>Afficher toutes les vidéos</Text>
            </TouchableOpacity>
          </View>
        ) : (
          displayedVideos.map((video, idx) => {
            const isBookmarked = bookmarkedVideos.includes(video.id);
            const isWatched = localStorage.getItem(`ida_watched_${video.id}`) === 'true';

            return (
              <View 
                key={video.id} 
                style={[styles.videoCard, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}
              >
                {/* Thumbnail container with play button */}
                <TouchableOpacity 
                  style={styles.thumbnailWrapper}
                  onPress={() => setActiveVideo(video)}
                  activeOpacity={0.85}
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                    loading="lazy"
                  />
                  <View style={styles.playOverlay}>
                    <View style={[styles.playCircle, { backgroundColor: theme.primary }]}>
                      <Play size={18} color="#FFFFFF" fill="#FFFFFF" />
                    </View>
                  </View>
                  <View style={styles.durationPill}>
                    <Text style={styles.durationText}>{video.duration}</Text>
                  </View>
                  {isWatched && (
                    <View style={[styles.watchedPill, { backgroundColor: theme.emerald }]}>
                      <CheckCircle2 size={12} color="#FFF" />
                      <Text style={styles.watchedText}>Vu</Text>
                    </View>
                  )}
                  <View style={styles.indexPill}>
                    <Text style={styles.indexText}>#{video.index}</Text>
                  </View>
                </TouchableOpacity>

                {/* Video Info */}
                <View style={styles.videoInfo}>
                  <View style={styles.metaRow}>
                    <View style={[styles.matiereTag, { backgroundColor: theme.primaryGlow }]}>
                      <Text style={[styles.matiereTagText, { color: theme.primary }]}>
                        {video.matiereLabel}
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        toggleBookmarkVideo(video.id);
                        triggerToast(isBookmarked ? 'Retiré des favoris' : 'Ajouté aux favoris ⭐', 'success');
                      }}
                      style={styles.bookmarkBtn}
                      title={isBookmarked ? "Retirer des favoris" : "Ajouter aux favoris"}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck size={17} color={theme.accent} />
                      ) : (
                        <Bookmark size={17} color={theme.textDim} />
                      )}
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity onPress={() => setActiveVideo(video)}>
                    <Text style={[styles.videoTitle, { color: theme.text }]} numberOfLines={2}>
                      {video.title}
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.authorRow}>
                    <Text style={[styles.authorLabel, { color: theme.textDim }]}>Par {video.author || 'Grafikart.fr'}</Text>
                  </View>

                  <View style={styles.cardBottomRow}>
                    <TouchableOpacity 
                      style={[styles.watchBtn, { backgroundColor: theme.primary }]}
                      onPress={() => setActiveVideo(video)}
                    >
                      <Play size={13} color="#FFFFFF" fill="#FFFFFF" />
                      <Text style={styles.watchBtnText}>Visionner</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.ytExtBtn, { borderColor: theme.border, backgroundColor: theme.bgCard }]}
                      onPress={() => window.open(video.url, '_blank')}
                      title="Ouvrir sur YouTube"
                    >
                      <Youtube size={14} color={theme.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* Load More Button */}
      {filteredVideos.length > displayedVideos.length && (
        <View style={styles.loadMoreWrap}>
          <TouchableOpacity
            style={[styles.loadMoreBtn, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}
            onPress={() => setVisibleCount((prev) => prev + 24)}
            activeOpacity={0.8}
          >
            <ChevronDown size={18} color={theme.primary} />
            <Text style={[styles.loadMoreBtnText, { color: theme.text }]}>
              Afficher 24 vidéos de plus ({filteredVideos.length - displayedVideos.length} restantes)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.showAllBtn, { borderColor: theme.border }]}
            onPress={() => setVisibleCount(filteredVideos.length)}
            activeOpacity={0.8}
          >
            <Text style={[styles.showAllBtnText, { color: theme.primary }]}>Tout afficher ({filteredVideos.length})</Text>
          </TouchableOpacity>
        </View>
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
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: '100%',
  },
  headerBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    flexShrink: 1,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  pageDesc: {
    fontSize: 15,
    maxWidth: 720,
    lineHeight: 22,
    textAlign: 'center',
  },
  tributeBanner: {
    width: '100%',
    maxWidth: 880,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
    marginTop: 8,
    boxShadow: '0 4px 20px rgba(30, 91, 69, 0.08)',
  },
  tributeBannerHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  tributeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  tributeLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  smallLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  smallLinkBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  tributeText: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'left',
  },
  searchBarRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
    maxWidth: 780,
    marginTop: 12,
  },
  searchBox: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    width: '100%',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    outlineStyle: 'none',
  },
  favToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
  },
  favToggleText: {
    fontSize: 13,
    fontWeight: '600',
  },
  categoryChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginTop: 10,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 12,
  },
  resultsInfoRow: {
    marginTop: 6,
  },
  resultsCountText: {
    fontSize: 12,
  },
  videosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
    gap: 22,
    width: '100%',
  },
  videoCard: {
    width: '100%',
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
  },
  thumbnailWrapper: {
    position: 'relative',
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#0F172A',
    overflow: 'hidden',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  playCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
  },
  durationPill: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  indexPill: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  indexText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  watchedPill: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  watchedText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  videoInfo: {
    padding: 16,
    gap: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  matiereTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  matiereTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  bookmarkBtn: {
    padding: 4,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
    minHeight: 40,
  },
  authorRow: {
    marginTop: -4,
  },
  authorLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 6,
  },
  watchBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  watchBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  ytExtBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadMoreWrap: {
    alignItems: 'center',
    marginTop: 36,
    gap: 12,
  },
  loadMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  loadMoreBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  showAllBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  showAllBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  noVideosCard: {
    width: '100%',
    maxWidth: 500,
    padding: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    textAlign: 'center',
    gap: 12,
    marginTop: 30,
  },
  noVideosTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  noVideosSub: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
  resetBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 8,
  },
  resetBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  }
});
