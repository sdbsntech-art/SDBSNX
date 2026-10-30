import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import BackToHomeBar from '../components/BackToHomeBar';
import { MessageSquare, Send, ThumbsUp, Heart, Sparkles, User, GraduationCap } from 'lucide-react';

export default function ForumCommentsView() {
  const { theme, triggerToast } = useApp();

  const [authorName, setAuthorName] = useState('');
  const [authorCycle, setAuthorCycle] = useState('Licence 1');
  const [commentText, setCommentText] = useState('');

  const [comments, setComments] = useState(() => {
    const saved = localStorage.getItem('ida_forum_comments');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: 1,
        author: 'Moussa Diop',
        cycle: 'Licence 2 (ENO Dakar)',
        date: 'Il y a 2 heures',
        content: 'Merci infiniment pour les cours de PHP et SQL avec Grafikart ! La séquence sur la modélisation Merise m\'a permis de valider mon TC sans difficulté.',
        likes: 14,
        liked: false
      },
      {
        id: 2,
        author: 'Fatou Ndiaye',
        cycle: 'Licence 1 (ENO Thiès)',
        date: 'Il y a 5 heures',
        content: 'La nouvelle interface PWA est juste magnifique et tellement fluide sur mon téléphone ! Les vidéos et les cours bien organisés motivent vraiment à réviser.',
        likes: 22,
        liked: true
      },
      {
        id: 3,
        author: 'Ibrahima Sarr',
        cycle: 'Licence 3 (ENO Saint-Louis)',
        date: 'Hier',
        content: 'Est-ce que quelqu\'un prépare le concours d\'ingénieur avec les annales de cryptographie ? On pourrait créer un groupe d\'étude sur Discord.',
        likes: 9,
        liked: false
      }
    ];
  });

  const handlePostComment = () => {
    if (!authorName.trim() || !commentText.trim()) {
      triggerToast('Veuillez renseigner votre nom et votre message.', 'error');
      return;
    }

    const newComment = {
      id: Date.now(),
      author: authorName.trim(),
      cycle: authorCycle,
      date: 'À l\'instant',
      content: commentText.trim(),
      likes: 1,
      liked: false
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    localStorage.setItem('ida_forum_comments', JSON.stringify(updated));
    setCommentText('');
    triggerToast('Votre commentaire a été publié avec succès ! 💬', 'success');
  };

  const handleToggleLike = (id) => {
    const updated = comments.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          likes: c.liked ? c.likes - 1 : c.likes + 1,
          liked: !c.liked
        };
      }
      return c;
    });
    setComments(updated);
    localStorage.setItem('ida_forum_comments', JSON.stringify(updated));
  };

  return (
    <View style={styles.container}>
      {/* Back to Home Navigation Bar */}
      <BackToHomeBar 
        currentPageTitle="Espace d'Échange & Discussion Étudiante" 
        breadcrumbCategory="Communauté" 
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
          <Text style={[styles.headerBadgeText, { color: theme.primary }]}>SDBSNX × UNCHK • COMMUNAUTÉ</Text>
        </View>
        <Text style={[styles.pageTitle, { color: theme.text }]} className="fluid-page-title">
          Communauté & Discussions Étudiantes
        </Text>
        <Text style={[styles.pageDesc, { color: theme.textMuted }]}>
          Posez vos questions sur les cours, partagez vos astuces de code et échangez avec vos camarades de toute la communauté IDA.
        </Text>
      </View>

      <View style={styles.layoutCols}>
        {/* Left Column: Form to Post */}
        <View style={[styles.formCard, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
          <Text style={[styles.formHeading, { color: theme.text }]}>Laisser un message / Question</Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.textMuted }]}>Votre Nom ou Pseudo :</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: theme.bgCard, borderColor: theme.border, color: theme.text }]}
              placeholder="Ex: Cheikh Sow"
              placeholderTextColor={theme.textDim}
              value={authorName}
              onChangeText={setAuthorName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.textMuted }]}>Niveau d'étude :</Text>
            <View style={styles.cyclePickerRow}>
              {['Licence 1', 'Licence 2', 'Licence 3', 'Alumni / Pro'].map((c) => {
                const isSel = authorCycle === c;
                return (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.cyclePickBtn,
                      { borderColor: theme.border, backgroundColor: isSel ? theme.primary : theme.bgCard }
                    ]}
                    onPress={() => setAuthorCycle(c)}
                  >
                    <Text style={[styles.cyclePickText, { color: isSel ? '#FFF' : theme.textMuted }]}>
                      {c}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.textMuted }]}>Votre message ou retour d'expérience :</Text>
            <TextInput
              style={[
                styles.textAreaInput, 
                { backgroundColor: theme.bgCard, borderColor: theme.border, color: theme.text }
              ]}
              placeholder="Posez votre question, partagez une ressource ou laissez vos encouragements..."
              placeholderTextColor={theme.textDim}
              value={commentText}
              onChangeText={setCommentText}
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: theme.primary }]}
            onPress={handlePostComment}
            activeOpacity={0.8}
          >
            <Send size={16} color="#FFFFFF" />
            <Text style={styles.submitBtnText}>Publier mon message</Text>
          </TouchableOpacity>
        </View>

        {/* Right Column: Feed of Comments */}
        <View style={styles.feedCol}>
          <Text style={[styles.feedHeading, { color: theme.text }]}>
            Derniers messages de la communauté ({comments.length})
          </Text>

          <View style={styles.commentsList}>
            {comments.map((item) => (
              <View 
                key={item.id} 
                style={[styles.commentCard, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}
              >
                <View style={styles.commentHeader}>
                  <View style={styles.avatarWrap}>
                    <View style={[styles.avatarCircle, { backgroundColor: theme.primaryGlow }]}>
                      <Text style={[styles.avatarInitial, { color: theme.primary }]}>
                        {item.author.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={[styles.commentAuthor, { color: theme.text }]} numberOfLines={1}>{item.author}</Text>
                      <Text style={[styles.commentCycle, { color: theme.secondary }]}>{item.cycle}</Text>
                    </View>
                  </View>
                  <Text style={[styles.commentDate, { color: theme.textDim, flexShrink: 0 }]}>{item.date}</Text>
                </View>

                <Text style={[styles.commentBody, { color: theme.textMuted }]}>{item.content}</Text>

                <View style={styles.commentFooter}>
                  <TouchableOpacity
                    style={[
                      styles.likeBtn,
                      { backgroundColor: item.liked ? theme.rose + '22' : theme.bgCard, borderColor: theme.border }
                    ]}
                    onPress={() => handleToggleLike(item.id)}
                  >
                    <Heart size={14} color={item.liked ? theme.rose : theme.textDim} fill={item.liked ? theme.rose : 'transparent'} />
                    <Text style={[styles.likeCount, { color: item.liked ? theme.rose : theme.textDim }]}>
                      {item.likes}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
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
    marginBottom: 40,
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
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  pageDesc: {
    fontSize: 15,
    maxWidth: 720,
    textAlign: 'center',
    lineHeight: 22,
  },
  layoutCols: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
    gap: 30,
    width: '100%',
  },
  formCard: {
    width: '100%',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    gap: 16,
    alignSelf: 'flex-start',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
  },
  formHeading: {
    fontSize: 18,
    fontWeight: '800',
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  textInput: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 14,
    outlineStyle: 'none',
  },
  cyclePickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  cyclePickBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  cyclePickText: {
    fontSize: 12,
    fontWeight: '600',
  },
  textAreaInput: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 14,
    minHeight: 100,
    outlineStyle: 'none',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
    marginTop: 4,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  feedCol: {
    flex: 2,
    width: '100%',
    minWidth: 0,
    gap: 16,
  },
  feedHeading: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  commentsList: {
    gap: 16,
  },
  commentCard: {
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 16,
    fontWeight: '800',
  },
  commentAuthor: {
    fontSize: 15,
    fontWeight: '800',
  },
  commentCycle: {
    fontSize: 12,
    fontWeight: '600',
  },
  commentDate: {
    fontSize: 11,
  },
  commentBody: {
    fontSize: 14,
    lineHeight: 22,
  },
  commentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 6,
  },
  likeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
  },
  likeCount: {
    fontSize: 12,
    fontWeight: '700',
  }
});
