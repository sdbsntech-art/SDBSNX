import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { EXERCISES_DATA } from '../data/exercisesData';
import BackToHomeBar from '../components/BackToHomeBar';
import { 
  Layers, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Award, 
  Play, 
  RotateCcw, 
  Code2, 
  Flame, 
  Trophy 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ExercisesView() {
  const { theme, triggerToast } = useApp();
  const [activeCycleFilter, setActiveCycleFilter] = useState('all');
  const [userAnswers, setUserAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [totalXp, setTotalXp] = useState(() => {
    return parseInt(localStorage.getItem('ida_xp') || '0', 10);
  });

  // Code Playground State
  const [codeSnippet, setCodeSnippet] = useState(
`// Testez votre code JavaScript ou Algorithme ici :
function saluerEtudiant(nom) {
  return "Bienvenue sur IDA COURS, " + nom + " ! Prêt à coder ?";
}
console.log(saluerEtudiant("Développeur IDA"));`
  );
  const [consoleOutput, setConsoleOutput] = useState('');

  const filteredExercises = EXERCISES_DATA.filter((ex) => {
    if (activeCycleFilter !== 'all' && ex.cycle !== activeCycleFilter) return false;
    return true;
  });

  const handleSelectOption = (exId, optionIdx, correctIdx, xp) => {
    if (revealed[exId]) return; // Already answered

    setUserAnswers((prev) => ({ ...prev, [exId]: optionIdx }));
    setRevealed((prev) => ({ ...prev, [exId]: true }));

    if (optionIdx === correctIdx) {
      const newXp = totalXp + xp;
      setTotalXp(newXp);
      localStorage.setItem('ida_xp', String(newXp));
      triggerToast(`Excellente réponse ! +${xp} XP gagnés 🏆`, 'success');
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 }
        });
      } catch {}
    } else {
      triggerToast('Réponse incorrecte. Consultez l\'explication technique ci-dessous.', 'error');
    }
  };

  const handleRunCode = () => {
    try {
      let logs = [];
      const customConsole = {
        log: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' '))
      };
      // Evaluate snippet safely
      const runFn = new Function('console', codeSnippet);
      runFn(customConsole);
      setConsoleOutput(logs.join('\n') || 'Code exécuté sans sortie console.');
      triggerToast('Code exécuté avec succès !', 'success');
    } catch (err) {
      setConsoleOutput(`Erreur d'exécution : ${err.message}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back to Home Navigation Bar */}
      <BackToHomeBar 
        currentPageTitle="Exercices, QCM & Console de Code" 
        breadcrumbCategory="Entraînement Pratique" 
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
          <Text style={[styles.headerBadgeText, { color: theme.primary }]}>SDBSNX × UNCHK • QUIZ & CODE</Text>
        </View>
        <Text style={[styles.pageTitle, { color: theme.text }]} className="fluid-page-title">
          Exercices Corrigés & Quiz Interactifs
        </Text>
        <Text style={[styles.pageDesc, { color: theme.textMuted }]}>
          Testez vos connaissances en HTML, CSS, JavaScript, SQL, C et Sécurité. Gagnez de l'XP et perfectionnez vos réflexes de développeur.
        </Text>

        {/* XP Scoreboard */}
        <View style={[styles.scoreboard, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
          <View style={styles.scoreItem}>
            <Trophy size={20} color={theme.accent} />
            <Text style={[styles.scoreValue, { color: theme.text }]}>{totalXp} XP</Text>
            <Text style={[styles.scoreLabel, { color: theme.textDim }]}>Score Total</Text>
          </View>
          <View style={[styles.scoreDivider, { backgroundColor: theme.border }]} />
          <View style={styles.scoreItem}>
            <Flame size={20} color={theme.rose} />
            <Text style={[styles.scoreValue, { color: theme.text }]}>
              {Object.keys(revealed).length} / {EXERCISES_DATA.length}
            </Text>
            <Text style={[styles.scoreLabel, { color: theme.textDim }]}>Défis Relevés</Text>
          </View>
        </View>

        {/* Cycle Filter Chips */}
        <View style={styles.filterChipsRow}>
          {[
            { id: 'all', label: 'Tous les cycles' },
            { id: 'L1', label: 'Licence 1 (L1)' },
            { id: 'L2', label: 'Licence 2 (L2)' },
            { id: 'L3', label: 'Licence 3 (L3)' }
          ].map((chip) => {
            const isSel = activeCycleFilter === chip.id;
            return (
              <TouchableOpacity
                key={chip.id}
                style={[
                  styles.filterChip,
                  { borderColor: theme.border, backgroundColor: isSel ? theme.primary : theme.bgElevated }
                ]}
                onPress={() => setActiveCycleFilter(chip.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterChipText, { color: isSel ? '#FFF' : theme.textMuted }]}>
                  {chip.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Exercises List */}
      <View style={styles.exercisesGrid}>
        {filteredExercises.map((ex) => {
          const isAnswered = revealed[ex.id];
          const chosenIdx = userAnswers[ex.id];
          const isCorrect = chosenIdx === ex.answerIndex;

          return (
            <View 
              key={ex.id} 
              style={[styles.exerciseCard, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}
            >
              {/* Card Header */}
              <View style={styles.cardHeaderRow}>
                <View style={styles.tagsGroup}>
                  <View style={[styles.cycleBadge, { backgroundColor: theme.primaryGlow }]}>
                    <Text style={[styles.cycleBadgeText, { color: theme.primary }]}>{ex.cycle}</Text>
                  </View>
                  <View style={[styles.matiereBadge, { backgroundColor: theme.secondary + '22' }]}>
                    <Text style={[styles.matiereBadgeText, { color: theme.secondary }]}>{ex.matiere}</Text>
                  </View>
                </View>
                <View style={[styles.xpPill, { backgroundColor: theme.accent + '22' }]}>
                  <Award size={13} color={theme.accent} />
                  <Text style={[styles.xpText, { color: theme.accent }]}>+{ex.xp} XP</Text>
                </View>
              </View>

              <Text style={[styles.exTitle, { color: theme.text }]}>{ex.title}</Text>
              <Text style={[styles.exQuestion, { color: theme.textMuted }]}>{ex.question}</Text>

              {/* Options */}
              <View style={styles.optionsCol}>
                {ex.options.map((opt, optIdx) => {
                  let btnBg = theme.bgCard;
                  let borderCol = theme.border;
                  let textColor = theme.text;

                  if (isAnswered) {
                    if (optIdx === ex.answerIndex) {
                      btnBg = theme.emerald + '22';
                      borderCol = theme.emerald;
                      textColor = theme.emerald;
                    } else if (optIdx === chosenIdx) {
                      btnBg = theme.rose + '22';
                      borderCol = theme.rose;
                      textColor = theme.rose;
                    }
                  }

                  return (
                    <TouchableOpacity
                      key={optIdx}
                      style={[
                        styles.optionBtn,
                        { backgroundColor: btnBg, borderColor: borderCol },
                        !isAnswered && { cursor: 'pointer' }
                      ]}
                      onPress={() => handleSelectOption(ex.id, optIdx, ex.answerIndex, ex.xp)}
                      activeOpacity={isAnswered ? 1 : 0.7}
                    >
                      <View style={styles.optionInner}>
                        <Text style={[styles.optionIndex, { color: textColor }]}>
                          {String.fromCharCode(65 + optIdx)}.
                        </Text>
                        <Text style={[styles.optionText, { color: textColor }]}>{opt}</Text>
                      </View>
                      {isAnswered && optIdx === ex.answerIndex && (
                        <CheckCircle2 size={16} color={theme.emerald} />
                      )}
                      {isAnswered && optIdx === chosenIdx && optIdx !== ex.answerIndex && (
                        <XCircle size={16} color={theme.rose} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Explanation section if answered */}
              {isAnswered && (
                <View 
                  style={[
                    styles.explanationBox, 
                    { backgroundColor: isCorrect ? theme.emerald + '15' : theme.rose + '15', borderColor: isCorrect ? theme.emerald : theme.rose }
                  ]}
                >
                  <Text style={[styles.explanationHeading, { color: isCorrect ? theme.emerald : theme.rose }]}>
                    {isCorrect ? '✅ Bonne réponse !' : '❌ Explication pédagogique :'}
                  </Text>
                  <Text style={[styles.explanationText, { color: theme.text }]}>
                    {ex.explanation}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* Interactive Code Playground / Runner */}
      <View style={[styles.playgroundCard, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
        <View style={styles.playgroundHeader}>
          <View style={styles.playgroundTitleRow}>
            <View style={[styles.codeIconBox, { backgroundColor: theme.primaryGlow }]}>
              <Code2 size={20} color={theme.primary} />
            </View>
            <View>
              <Text style={[styles.playgroundTitle, { color: theme.text }]}>Bac à Sable & Console JavaScript Live</Text>
              <Text style={[styles.playgroundSubtitle, { color: theme.textMuted }]}>
                Tapez votre code algorithmique ou JavaScript et exécutez-le instantanément.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.runCodeBtn, { backgroundColor: theme.emerald }]}
            onPress={handleRunCode}
            activeOpacity={0.8}
          >
            <Play size={16} color="#FFF" fill="#FFF" />
            <Text style={styles.runCodeBtnText}>Exécuter le Code</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={[styles.codeEditor, { backgroundColor: '#0B0F19', color: '#10B981', borderColor: theme.border }]}
          value={codeSnippet}
          onChangeText={setCodeSnippet}
          multiline
          numberOfLines={8}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {consoleOutput ? (
          <View style={[styles.consoleOutputBox, { backgroundColor: '#000000', borderColor: theme.border }]}>
            <Text style={styles.consoleHeading}>CONSOLE OUTPUT :</Text>
            <Text style={styles.consoleText}>{consoleOutput}</Text>
          </View>
        ) : null}
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
  scoreboard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    gap: 24,
    marginTop: 8,
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  scoreLabel: {
    fontSize: 12,
  },
  scoreDivider: {
    width: 1,
    height: 24,
  },
  filterChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginTop: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  exercisesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
    gap: 22,
    width: '100%',
    marginBottom: 50,
  },
  exerciseCard: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    gap: 14,
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tagsGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  cycleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  cycleBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  matiereBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  matiereBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  xpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  xpText: {
    fontSize: 11,
    fontWeight: '800',
  },
  exTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  exQuestion: {
    fontSize: 14,
    lineHeight: 20,
  },
  optionsCol: {
    gap: 10,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  optionInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  optionIndex: {
    fontSize: 13,
    fontWeight: '800',
    flexShrink: 0,
  },
  optionText: {
    fontSize: 13,
    flex: 1,
    minWidth: 0,
  },
  explanationBox: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  explanationHeading: {
    fontSize: 13,
    fontWeight: '800',
  },
  explanationText: {
    fontSize: 13,
    lineHeight: 18,
  },
  playgroundCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    gap: 18,
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
  },
  playgroundHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 14,
  },
  playgroundTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  codeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playgroundTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  playgroundSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  runCodeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  runCodeBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  codeEditor: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 13,
    lineHeight: 20,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    minHeight: 140,
    outlineStyle: 'none',
  },
  consoleOutputBox: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  consoleHeading: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'JetBrains Mono, monospace',
  },
  consoleText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontFamily: 'JetBrains Mono, monospace',
    whiteSpace: 'pre-wrap',
  }
});
