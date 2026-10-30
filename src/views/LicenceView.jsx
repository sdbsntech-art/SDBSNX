import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, useWindowDimensions } from 'react-native';
import { useApp } from '../context/AppContext';
import { COURSES_DATA } from '../data/coursesData';
import { REAL_COURSES_INDEX } from '../data/realCoursesIndex';
import BackToHomeBar from '../components/BackToHomeBar';
import useAdminDocuments from '../hooks/useAdminDocuments';
import { 
  GraduationCap, 
  Search, 
  CheckCircle2, 
  Circle, 
  FileText, 
  BookOpen, 
  Layers, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Trophy,
  Download,
  Eye,
  Filter,
  FolderOpen,
  Award,
  PenTool,
  CheckSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LicenceView() {
  const { width: viewportWidth } = useWindowDimensions();
  const isMobile = viewportWidth < 640;
  const isVerySmall = viewportWidth < 380;
  const { 
    selectedCycle, 
    setSelectedCycle, 
    theme, 
    completedLessons, 
    toggleLessonComplete, 
    triggerToast,
    setActivePdfPreview 
  } = useApp();
  const { documents: adminDocuments, error: adminDocumentsError } = useAdminDocuments('courses');
  const cycleDocuments = adminDocuments.filter((document) => document.category === selectedCycle);

  const [viewMode, setViewMode] = useState('curriculum'); // 'curriculum' | 'explorer'
  const [docCategoryTab, setDocCategoryTab] = useState('all'); // 'all' | 'cours' | 'td' | 'examen'
  const [searchFilter, setSearchFilter] = useState('');
  const [activeSemestre, setActiveSemestre] = useState('all');

  const cycleData = COURSES_DATA[selectedCycle] || COURSES_DATA['L1'];
  const realCycleIndex = REAL_COURSES_INDEX[selectedCycle] || { semestres: {} };

  // Calculate completed progress in curriculum
  const { totalLessons, completedCount, progressPercent } = useMemo(() => {
    let total = 0;
    let completed = 0;
    cycleData.semestres.forEach((s) => {
      s.modules.forEach((m) => {
        m.lessons.forEach((l, idx) => {
          total++;
          const id = `${selectedCycle}-${m.id}-${idx}`;
          if (completedLessons[id]) {
            completed++;
          }
        });
      });
    });
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { totalLessons: total, completedCount: completed, progressPercent: percent };
  }, [cycleData, completedLessons, selectedCycle]);

  // Flatten all real documents for the current cycle
  const allRealDocsForCycle = useMemo(() => {
    const list = [];
    if (!realCycleIndex.semestres) return list;

    Object.entries(realCycleIndex.semestres).forEach(([semName, modules]) => {
      Object.entries(modules).forEach(([modName, docs]) => {
        docs.forEach((doc) => {
          list.push({
            ...doc,
            semestreName: semName,
            moduleName: modName
          });
        });
      });
    });
    return list;
  }, [realCycleIndex]);

  // Counts of real docs by category
  const docCounts = useMemo(() => {
    let cours = 0;
    let td = 0;
    let examen = 0;
    allRealDocsForCycle.forEach((d) => {
      if (d.type === 'Cours') cours++;
      else if (d.type === 'Travaux Dirigés (TD/TP)') td++;
      else examen++;
    });
    return { all: allRealDocsForCycle.length, cours, td, examen };
  }, [allRealDocsForCycle]);

  // Filter real documents for Explorer mode
  const filteredRealDocs = useMemo(() => {
    const q = searchFilter.trim().toLowerCase();
    return allRealDocsForCycle.filter((doc) => {
      if (activeSemestre !== 'all' && doc.semestreName !== activeSemestre) {
        return false;
      }
      if (docCategoryTab === 'cours' && doc.type !== 'Cours') return false;
      if (docCategoryTab === 'td' && doc.type !== 'Travaux Dirigés (TD/TP)') return false;
      if (docCategoryTab === 'examen' && !['Examen & Devoir', 'QCM & Évaluation', 'Mini-Projet'].includes(doc.type)) return false;

      if (q) {
        const matchTitle = doc.name.toLowerCase().includes(q);
        const matchMod = doc.moduleName.toLowerCase().includes(q);
        return matchTitle || matchMod;
      }
      return true;
    }).sort((a, b) => {
      const semOrder = (a.semestreName || '').localeCompare(b.semestreName || '');
      if (semOrder !== 0) return semOrder;
      return (a.moduleName || '').localeCompare(b.moduleName || '');
    });
  }, [allRealDocsForCycle, activeSemestre, docCategoryTab, searchFilter]);

  const groupedRealDocs = useMemo(() => {
    const groups = {};

    filteredRealDocs.forEach((doc) => {
      const semestreKey = doc.semestreName || 'Autre';
      const moduleKey = doc.moduleName || 'Autre';

      if (!groups[semestreKey]) {
        groups[semestreKey] = {};
      }

      if (!groups[semestreKey][moduleKey]) {
        groups[semestreKey][moduleKey] = [];
      }

      groups[semestreKey][moduleKey].push(doc);
    });

    return Object.entries(groups).map(([semestreName, modules]) => ({
      semestreName,
      modules: Object.entries(modules).map(([moduleName, docs]) => ({
        moduleName,
        docs: docs.sort((a, b) => a.name.localeCompare(b.name))
      }))
    }));
  }, [filteredRealDocs]);

  // Filter modules for Curriculum mode
  const filteredSemestres = useMemo(() => {
    const q = searchFilter.trim().toLowerCase();
    return cycleData.semestres.map((sem) => {
      if (activeSemestre !== 'all' && sem.id !== activeSemestre) {
        return { ...sem, modules: [] };
      }
      
      const filteredMods = sem.modules.map((m) => {
        const matchedLessons = m.lessons.filter((l) => {
          // Category filter (cours vs td vs examen)
          if (docCategoryTab === 'cours' && l.docType && l.docType !== 'cours') return false;
          if (docCategoryTab === 'td' && l.docType && l.docType !== 'td') return false;
          if (docCategoryTab === 'examen' && l.docType && l.docType !== 'examen') return false;

          if (!q) return true;
          return l.title.toLowerCase().includes(q) || m.title.toLowerCase().includes(q);
        });

        return { ...m, lessons: matchedLessons };
      }).filter((m) => m.lessons.length > 0);

      return { ...sem, modules: filteredMods };
    });
  }, [cycleData, searchFilter, activeSemestre, docCategoryTab]);

  const handleLessonCheck = (lessonId, lessonTitle) => {
    const isNowDone = !completedLessons[lessonId];
    toggleLessonComplete(lessonId);

    if (isNowDone) {
      triggerToast(`Félicitations ! Leçon validée : ${lessonTitle}`, 'success');
      try {
        confetti({
          particleCount: 45,
          spread: 65,
          origin: { y: 0.8 }
        });
      } catch {}
    }
  };

  const handleOpenPdfPreview = (title, url, ext = 'PDF', size = '') => {
    setActivePdfPreview({
      name: title,
      url: url,
      ext: ext,
      size: size
    });
  };

  return (
    <View style={styles.container}>
      {/* 1. Back to Home Navigation Bar */}
      <BackToHomeBar 
        currentPageTitle={`${cycleData.cycle} • ${cycleData.fullName}`} 
        breadcrumbCategory="Licence Informatique" 
      />

      {/* Header with Cycle Selector */}
      <View style={styles.headerArea}>
        <View style={styles.topInfo}>
          <View style={[styles.cycleTag, { backgroundColor: theme.bgCard, borderColor: theme.border, borderWidth: 1 }]}>
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
            <Text style={[styles.cycleTagText, { color: theme.primary }]}>SDBSNX × UNCHK • PROGRAMME ACADÉMIQUE</Text>
          </View>
          <Text style={[styles.pageTitle, { color: theme.text }]} className="fluid-page-title">
            {cycleData.fullName}
          </Text>
          <Text style={[styles.pageDesc, { color: theme.textMuted }]}>
            {cycleData.description}
          </Text>
        </View>

        {/* Cycle Switcher Tabs */}
        <View style={[
          styles.cycleTabsBar, 
          { backgroundColor: theme.bgElevated, borderColor: theme.border },
          isMobile && styles.cycleTabsBarMobile
        ]}>
          {['L1', 'L2', 'L3'].map((key) => {
            const isSelected = selectedCycle === key;
            const fullDocCount = key === 'L1' ? '170 supports' : key === 'L2' ? '333 supports' : '30 supports';
            const shortDocCount = key === 'L1' ? '170' : key === 'L2' ? '333' : '30';
            const docCount = isVerySmall ? shortDocCount : (isMobile ? `${shortDocCount} sup.` : fullDocCount);

            return (
              <TouchableOpacity
                key={key}
                style={[
                  styles.cycleTabBtn,
                  isMobile && styles.cycleTabBtnMobile,
                  isSelected && { backgroundColor: theme.primary, boxShadow: '0 4px 14px rgba(30, 91, 69, 0.24)' }
                ]}
                onPress={() => {
                  setSelectedCycle(key);
                  setSearchFilter('');
                  setActiveSemestre('all');
                }}
                activeOpacity={0.8}
              >
                <Text
                  numberOfLines={1}
                  style={[
                    styles.cycleTabLabel,
                    isMobile && styles.cycleTabLabelMobile,
                    { color: isSelected ? '#FFFFFF' : theme.textMuted }
                  ]}
                >
                  {isVerySmall ? key : (isMobile ? COURSES_DATA[key].cycle.replace('Licence', 'L.') : COURSES_DATA[key].cycle)}
                </Text>
                <View style={[
                  styles.tabCountPill,
                  isMobile && styles.tabCountPillMobile,
                  { backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : theme.bgCard }
                ]}>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.tabCountText,
                      isMobile && styles.tabCountTextMobile,
                      { color: isSelected ? '#FFFFFF' : theme.textDim }
                    ]}
                  >
                    {docCount}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ORGANISATION DES SUPPORTS: SÉPARATION COURS, TD & EXERCICES */}
        <View style={styles.categorySeparationBar}>
          <Text style={[styles.categorySepLabel, { color: theme.textDim }]}>ORGANISATION DU CONTENU :</Text>
          <View style={styles.categoryChipsGroup}>
            <TouchableOpacity
              style={[
                styles.categoryChipBtn,
                docCategoryTab === 'all' 
                  ? { backgroundColor: theme.primary, borderColor: theme.primary } 
                  : { backgroundColor: theme.bgElevated, borderColor: theme.border }
              ]}
              onPress={() => setDocCategoryTab('all')}
              activeOpacity={0.8}
            >
              <Layers size={14} color={docCategoryTab === 'all' ? '#FFFFFF' : theme.text} />
              <Text style={[styles.categoryChipText, { color: docCategoryTab === 'all' ? '#FFFFFF' : theme.text }]}>
                Tous les supports ({allRealDocsForCycle.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.categoryChipBtn,
                docCategoryTab === 'cours' 
                  ? { backgroundColor: theme.primary, borderColor: theme.primary } 
                  : { backgroundColor: theme.bgElevated, borderColor: theme.border }
              ]}
              onPress={() => setDocCategoryTab('cours')}
              activeOpacity={0.8}
            >
              <BookOpen size={14} color={docCategoryTab === 'cours' ? '#FFFFFF' : theme.primary} />
              <Text style={[styles.categoryChipText, { color: docCategoryTab === 'cours' ? '#FFFFFF' : theme.text }]}>
                📖 Cours Magistraux ({docCounts.cours})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.categoryChipBtn,
                docCategoryTab === 'td' 
                  ? { backgroundColor: theme.primary, borderColor: theme.primary } 
                  : { backgroundColor: theme.bgElevated, borderColor: theme.border }
              ]}
              onPress={() => setDocCategoryTab('td')}
              activeOpacity={0.8}
            >
              <PenTool size={14} color={docCategoryTab === 'td' ? '#FFFFFF' : theme.primary} />
              <Text style={[styles.categoryChipText, { color: docCategoryTab === 'td' ? '#FFFFFF' : theme.text }]}>
                📝 Travaux Dirigés (TD & TP) ({docCounts.td})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.categoryChipBtn,
                docCategoryTab === 'examen' 
                  ? { backgroundColor: theme.secondary, borderColor: theme.secondary } 
                  : { backgroundColor: theme.bgElevated, borderColor: theme.border }
              ]}
              onPress={() => setDocCategoryTab('examen')}
              activeOpacity={0.8}
            >
              <CheckSquare size={14} color={docCategoryTab === 'examen' ? '#FFFFFF' : theme.secondary} />
              <Text style={[styles.categoryChipText, { color: docCategoryTab === 'examen' ? '#FFFFFF' : theme.text }]}>
                🎯 Exercices & Examens ({docCounts.examen})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress Tracker Card */}
        <View style={[styles.progressCard, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
          <View style={styles.progressRowTop}>
            <View style={styles.progressLabelWrap}>
              <Trophy size={18} color={theme.accent} />
              <Text style={[styles.progressTitle, { color: theme.text }]}>Progression dans le cycle {selectedCycle}</Text>
            </View>
            <Text style={[styles.progressNumber, { color: theme.primary }]}>
              {completedCount} / {totalLessons} séquences validées ({progressPercent}%)
            </Text>
          </View>
          <View style={[styles.progressBarTrack, { backgroundColor: theme.border }]}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: `${progressPercent}%`, backgroundColor: theme.emerald }
              ]} 
            />
          </View>
        </View>

        {/* Mode Selector: Maquette Pédagogique vs Explorateur de Documents */}
        <View style={styles.modeSwitchRow}>
          <TouchableOpacity
            style={[
              styles.modeBtn,
              viewMode === 'curriculum' 
                ? { backgroundColor: theme.primary, borderColor: theme.primary } 
                : { backgroundColor: theme.bgElevated, borderColor: theme.border }
            ]}
            onPress={() => setViewMode('curriculum')}
            activeOpacity={0.8}
          >
            <BookOpen size={16} color={viewMode === 'curriculum' ? '#FFFFFF' : theme.textMuted} />
            <Text style={[styles.modeBtnText, { color: viewMode === 'curriculum' ? '#FFFFFF' : theme.text }]}>
              Programme Universitaire par Matière
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeBtn,
              viewMode === 'explorer' 
                ? { backgroundColor: theme.primary, borderColor: theme.primary } 
                : { backgroundColor: theme.bgElevated, borderColor: theme.border }
            ]}
            onPress={() => setViewMode('explorer')}
            activeOpacity={0.8}
          >
            <FolderOpen size={16} color={viewMode === 'explorer' ? '#FFFFFF' : theme.textMuted} />
            <Text style={[styles.modeBtnText, { color: viewMode === 'explorer' ? '#FFFFFF' : theme.text }]}>
              Explorateur de Documents Réels ({allRealDocsForCycle.length} fichiers)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search & Filter Toolbar */}
        <View style={styles.toolbarRow}>
          <View style={[styles.searchBox, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
            <Search size={18} color={theme.textDim} />
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Rechercher un cours, un TD ou un examen..."
              placeholderTextColor={theme.textDim}
              value={searchFilter}
              onChangeText={setSearchFilter}
            />
          </View>

          {/* Quick Semester Filter */}
          <View style={styles.semFilterRow}>
            <TouchableOpacity
              style={[
                styles.semChip,
                { borderColor: theme.border, backgroundColor: activeSemestre === 'all' ? theme.primary : theme.bgElevated }
              ]}
              onPress={() => setActiveSemestre('all')}
            >
              <Text style={[styles.semChipText, { color: activeSemestre === 'all' ? '#FFFFFF' : theme.textMuted }]}>
                Tous les semestres
              </Text>
            </TouchableOpacity>

            {viewMode === 'curriculum' ? (
              cycleData.semestres.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={[
                    styles.semChip,
                    { borderColor: theme.border, backgroundColor: activeSemestre === s.id ? theme.primary : theme.bgElevated }
                  ]}
                  onPress={() => setActiveSemestre(s.id)}
                >
                  <Text style={[styles.semChipText, { color: activeSemestre === s.id ? '#FFFFFF' : theme.textMuted }]}>
                    {s.name.split(' - ')[0]}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              Object.keys(realCycleIndex.semestres || {}).map((sName) => (
                <TouchableOpacity
                  key={sName}
                  style={[
                    styles.semChip,
                    { borderColor: theme.border, backgroundColor: activeSemestre === sName ? theme.primary : theme.bgElevated }
                  ]}
                  onPress={() => setActiveSemestre(sName)}
                >
                  <Text style={[styles.semChipText, { color: activeSemestre === sName ? '#FFFFFF' : theme.textMuted }]}>
                    {sName}
                  </Text>
                </TouchableOpacity>
              ))
            )}
            {cycleDocuments.length > 0 && (
              <View style={{ marginTop: 24, gap: 12 }}>
                <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800' }}>
                  Documents complémentaires — {selectedCycle}
                </Text>
                <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                  {cycleDocuments.map((document) => (
                    <View
                      key={document.id}
                      style={{
                        minWidth: 0,
                        maxWidth: 420,
                        flex: 1,
                        width: '100%',
                        padding: 14,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: theme.border,
                        backgroundColor: theme.bgElevated,
                        gap: 8,
                      }}
                    >
                      <Text style={{ color: theme.text, fontSize: 14, fontWeight: '700' }}>
                        {document.title}
                      </Text>
                      {!!document.description && (
                        <Text style={{ color: theme.textMuted, fontSize: 12, lineHeight: 18 }}>
                          {document.description}
                        </Text>
                      )}
                      <TouchableOpacity
                        onPress={() => window.open(document.downloadUrl, '_blank', 'noopener,noreferrer')}
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}
                        accessibilityRole="link"
                      >
                        <Download size={14} color={theme.primary} />
                        <Text style={{ color: theme.primary, fontSize: 12, fontWeight: '700' }}>
                          Ouvrir {document.file_name}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}
            {adminDocumentsError && (
              <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 12 }} accessibilityRole="alert">
                {adminDocumentsError}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Main Content Area: Curriculum or Explorer */}
      {viewMode === 'curriculum' ? (
        /* MODE 1: CURRICULUM */
        <View style={styles.semestresWrapper}>
          {filteredSemestres.map((semestre) => (
            <View key={semestre.id} style={styles.semestreBlock}>
              <View style={[styles.semestreHeader, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
                <Layers size={18} color={theme.primary} />
                <Text style={[styles.semestreTitle, { color: theme.text }]}>{semestre.name}</Text>
                <View style={[styles.moduleCountBadge, { backgroundColor: theme.primaryGlow }]}>
                  <Text style={[styles.moduleCountText, { color: theme.primary }]}>
                    {semestre.modules.length} Matières
                  </Text>
                </View>
              </View>

              {semestre.modules.length === 0 ? (
                <Text style={[styles.emptyModText, { color: theme.textDim }]}>
                  Aucun cours ou TD ne correspond à ce filtre pour ce semestre.
                </Text>
              ) : (
                <View style={styles.modulesGrid}>
                  {semestre.modules.map((mod) => (
                    <View 
                      key={mod.id} 
                      style={[styles.moduleCard, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}
                    >
                      <View style={[styles.moduleCardHeader, { borderBottomColor: theme.border }]}>
                        <View style={styles.moduleTitleRow}>
                          <BookOpen size={18} color={theme.primary} />
                          <Text style={[styles.moduleTitle, { color: theme.text }]} numberOfLines={1}>
                            {mod.title}
                          </Text>
                        </View>
                        <View style={[styles.lessonBadge, { backgroundColor: theme.bgCard }]}>
                          <Text style={[styles.lessonBadgeText, { color: theme.textMuted }]}>
                            {mod.lessons.length} {mod.lessons.length > 1 ? 'supports' : 'support'}
                          </Text>
                        </View>
                      </View>

                      {/* Lessons list */}
                      <View style={styles.lessonsList}>
                        {mod.lessons.map((les, idx) => {
                          const lessonId = `${selectedCycle}-${mod.id}-${idx}`;
                          const isDone = !!completedLessons[lessonId];
                          const hasFile = les.href && les.href.startsWith('/courses/');
                          const isTD = les.docType === 'td';
                          const isExamen = les.docType === 'examen';

                          return (
                            <View 
                              key={idx} 
                              style={[
                                styles.lessonRow, 
                                { borderBottomColor: theme.border },
                                isDone && { backgroundColor: theme.emerald + '0c' }
                              ]}
                            >
                              <TouchableOpacity
                                onPress={() => handleLessonCheck(lessonId, les.title)}
                                style={styles.checkboxBtn}
                                activeOpacity={0.7}
                                title={isDone ? "Marquer comme à revoir" : "Valider la leçon"}
                              >
                                {isDone ? (
                                  <CheckCircle2 size={18} color={theme.emerald} />
                                ) : (
                                  <Circle size={18} color={theme.textDim} />
                                )}
                              </TouchableOpacity>

                              <View style={styles.lessonTitleCol}>
                                <TouchableOpacity
                                  onPress={() => {
                                    if (hasFile) {
                                      handleOpenPdfPreview(les.title, les.href, 'PDF');
                                    } else {
                                      handleLessonCheck(lessonId, les.title);
                                    }
                                  }}
                                  activeOpacity={0.7}
                                >
                                  <Text 
                                    style={[
                                      styles.lessonTitle, 
                                      { color: isDone ? theme.textMuted : theme.text },
                                      isDone && { textDecorationLine: 'line-through' }
                                    ]}
                                    numberOfLines={1}
                                  >
                                    {les.title}
                                  </Text>
                                </TouchableOpacity>

                                {/* Tag indicating if it's TD, Examen or Cours */}
                                <View style={styles.subTagRow}>
                                  {isTD && (
                                    <View style={[styles.docMiniBadge, { backgroundColor: theme.primaryGlow }]}>
                                      <Text style={{ fontSize: 10, fontWeight: '700', color: theme.primary }}>TD / TP</Text>
                                    </View>
                                  )}
                                  {isExamen && (
                                    <View style={[styles.docMiniBadge, { backgroundColor: theme.secondary + '22' }]}>
                                      <Text style={{ fontSize: 10, fontWeight: '700', color: theme.secondary }}>EXAMEN</Text>
                                    </View>
                                  )}
                                </View>
                              </View>

                              {/* Action buttons */}
                              <View style={styles.lessonActionButtons}>
                                {hasFile ? (
                                  <>
                                    <TouchableOpacity
                                      onPress={() => handleOpenPdfPreview(les.title, les.href, 'PDF')}
                                      style={[styles.smallActionBtn, { backgroundColor: theme.primaryGlow }]}
                                      title="Aperçu du cours"
                                    >
                                      <Eye size={13} color={theme.primary} />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                      onPress={() => window.open(les.href, '_blank')}
                                      style={[styles.smallActionBtn, { backgroundColor: theme.bgCard, borderColor: theme.border, borderWidth: 1 }]}
                                      title="Ouvrir / Télécharger le PDF"
                                    >
                                      <Download size={13} color={theme.text} />
                                    </TouchableOpacity>
                                  </>
                                ) : (
                                  <Text style={[styles.onlineTag, { color: theme.textDim }]}>En ligne</Text>
                                )}
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.explorerWrapper}>
          <View style={styles.explorerSummaryRow}>
            <Text style={[styles.explorerSummaryText, { color: theme.textDim }]}>
              <Text style={{ fontWeight: '800', color: theme.text }}>{filteredRealDocs.length}</Text> supports trouvés dans la base réelle pour {cycleData.cycle}
            </Text>
          </View>

          {filteredRealDocs.length === 0 ? (
            <View style={[styles.noDocsBox, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
              <FileText size={40} color={theme.textDim} />
              <Text style={[styles.noDocsTitle, { color: theme.text }]}>Aucun support ne correspond à ce filtre</Text>
              <Text style={[styles.noDocsSub, { color: theme.textMuted }]}>
                Essayez de réinitialiser la recherche ou sélectionnez un autre onglet.
              </Text>
              <TouchableOpacity
                style={[styles.resetExplorerBtn, { backgroundColor: theme.primary }]}
                onPress={() => {
                  setSearchFilter('');
                  setActiveSemestre('all');
                  setDocCategoryTab('all');
                }}
              >
                <Text style={styles.resetExplorerBtnText}>Réinitialiser les filtres</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.groupedExplorerContainer}>
              {groupedRealDocs.map((semestre) => (
                <View key={semestre.semestreName} style={[styles.semesterExplorerGroup, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
                  <View style={[styles.semesterExplorerHeader, { borderBottomColor: theme.border }]}>
                    <Layers size={16} color={theme.primary} />
                    <Text style={[styles.semesterExplorerTitle, { color: theme.text }]}>{semestre.semestreName}</Text>
                    <View style={[styles.semesterExplorerBadge, { backgroundColor: theme.primaryGlow }]}>
                      <Text style={[styles.semesterExplorerBadgeText, { color: theme.primary }]}>
                        {semestre.modules.reduce((sum, mod) => sum + mod.docs.length, 0)} fichiers
                      </Text>
                    </View>
                  </View>

                  <View style={styles.semesterModuleList}>
                    {semestre.modules.map((module) => (
                      <View key={`${semestre.semestreName}-${module.moduleName}`} style={styles.moduleExplorerBlock}>
                        <Text style={[styles.moduleExplorerTitle, { color: theme.text }]}>{module.moduleName}</Text>
                        <View style={styles.realDocsGrid}>
                          {module.docs.map((doc, index) => (
                            <View 
                              key={`${semestre.semestreName}-${module.moduleName}-${doc.name}-${index}`} 
                              style={[styles.realDocCard, { backgroundColor: theme.bgCard, borderColor: theme.border }]}
                            >
                              <View style={styles.realDocTopRow}>
                                <View style={[
                                  styles.docTypeBadge,
                                  {
                                    backgroundColor: doc.type === 'Cours'
                                      ? theme.primaryGlow
                                      : doc.type === 'Travaux Dirigés (TD/TP)'
                                        ? theme.primaryGlow
                                        : theme.secondary + '22'
                                  }
                                ]}>
                                  <Text style={[
                                    styles.docTypeBadgeText,
                                    {
                                      color: doc.type === 'Cours'
                                        ? theme.primary
                                        : doc.type === 'Travaux Dirigés (TD/TP)'
                                          ? theme.primary
                                          : theme.secondary
                                    }
                                  ]}>
                                    {doc.type}
                                  </Text>
                                </View>
                                <View style={styles.extAndSizeRow}>
                                  <Text style={[styles.extLabel, { color: theme.primary }]}>{doc.ext}</Text>
                                  <Text style={[styles.sizeLabel, { color: theme.textDim }]}>• {doc.size}</Text>
                                </View>
                              </View>

                              <Text style={[styles.realDocTitle, { color: theme.text }]} numberOfLines={2}>
                                {doc.name}
                              </Text>

                              <View style={styles.realDocActionsRow}>
                                <TouchableOpacity
                                  style={[styles.previewDocBtn, { backgroundColor: theme.primary }]}
                                  onPress={() => handleOpenPdfPreview(doc.name, doc.url, doc.ext, doc.size)}
                                  activeOpacity={0.8}
                                >
                                  <Eye size={13} color="#FFFFFF" />
                                  <Text style={styles.previewDocBtnText}>Aperçu</Text>
                                </TouchableOpacity>

                                <a
                                  href={doc.url}
                                  download
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '8px 12px',
                                    borderRadius: 10,
                                    backgroundColor: theme.bgElevated,
                                    border: `1px solid ${theme.border}`,
                                    color: theme.text,
                                    fontSize: 12,
                                    fontWeight: 600
                                  }}
                                  title="Télécharger le fichier"
                                >
                                  <Download size={13} color={theme.text} />
                                </a>
                              </View>
                            </View>
                          ))}
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}
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
    paddingTop: 20,
    paddingBottom: 60,
  },
  headerArea: {
    gap: 20,
    marginBottom: 40,
  },
  topInfo: {
    alignItems: 'center',
    textAlign: 'center',
    gap: 10,
  },
  cycleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  cycleTagText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  pageDesc: {
    fontSize: 15,
    maxWidth: 760,
    lineHeight: 22,
    textAlign: 'center',
  },
  cycleTabsBar: {
    flexDirection: 'row',
    padding: 6,
    borderRadius: 16,
    borderWidth: 1,
    maxWidth: 640,
    width: '100%',
    alignSelf: 'center',
    gap: 6,
  },
  cycleTabsBarMobile: {
    padding: 4,
    gap: 4,
    borderRadius: 14,
  },
  cycleTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 12,
    minWidth: 0,
  },
  cycleTabBtnMobile: {
    paddingVertical: 9,
    paddingHorizontal: 4,
    gap: 5,
    borderRadius: 10,
  },
  cycleTabLabel: {
    fontSize: 14,
    fontWeight: '800',
  },
  cycleTabLabelMobile: {
    fontSize: 12,
  },
  tabCountPill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  tabCountPillMobile: {
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 8,
  },
  tabCountText: {
    fontSize: 11,
    fontWeight: '700',
  },
  tabCountTextMobile: {
    fontSize: 10,
  },
  categorySeparationBar: {
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  categorySepLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  categoryChipsGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  categoryChipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  progressCard: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    maxWidth: 820,
    width: '100%',
    alignSelf: 'center',
  },
  progressRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  progressLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  progressNumber: {
    fontSize: 13,
    fontWeight: '800',
  },
  progressBarTrack: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  modeSwitchRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
  },
  modeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    maxWidth: '100%',
  },
  modeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    flexShrink: 1,
  },
  toolbarRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    width: '100%',
    marginTop: 6,
  },
  searchBox: {
    flex: 1,
    minWidth: 0,
    maxWidth: 480,
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
  semFilterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  semChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  semChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  semestresWrapper: {
    gap: 40,
  },
  semestreBlock: {
    gap: 16,
  },
  semestreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  semestreTitle: {
    fontSize: 15,
    fontWeight: '800',
    flex: 1,
    minWidth: 0,
  },
  moduleCountBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moduleCountText: {
    fontSize: 12,
    fontWeight: '800',
  },
  emptyModText: {
    fontSize: 14,
    padding: 20,
    textAlign: 'center',
  },
  modulesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
    gap: 20,
    width: '100%',
  },
  moduleCard: {
    width: '100%',
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  },
  moduleCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  moduleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  moduleTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  lessonBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  lessonBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  lessonsList: {
    padding: 6,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    gap: 10,
  },
  checkboxBtn: {
    padding: 2,
    flexShrink: 0,
  },
  lessonTitleCol: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  lessonTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  subTagRow: {
    flexDirection: 'row',
    gap: 6,
  },
  docMiniBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  lessonActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  smallActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineTag: {
    fontSize: 11,
    fontWeight: '600',
  },
  explorerWrapper: {
    gap: 18,
  },
  explorerSummaryRow: {
    paddingHorizontal: 4,
  },
  explorerSummaryText: {
    fontSize: 13,
  },
  groupedExplorerContainer: {
    gap: 18,
  },
  semesterExplorerGroup: {
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },
  semesterExplorerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  semesterExplorerTitle: {
    fontSize: 15,
    fontWeight: '800',
    flex: 1,
    minWidth: 0,
  },
  semesterExplorerBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  semesterExplorerBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  semesterModuleList: {
    padding: 16,
    gap: 18,
  },
  moduleExplorerBlock: {
    gap: 10,
  },
  moduleExplorerTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  realDocsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
    gap: 16,
    width: '100%',
  },
  realDocCard: {
    width: '100%',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
    boxShadow: '0 4px 18px rgba(0, 0, 0, 0.04)',
  },
  realDocTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  docTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  docTypeBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  extAndSizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  extLabel: {
    fontSize: 11,
    fontWeight: '800',
  },
  sizeLabel: {
    fontSize: 11,
  },
  realDocTitle: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    minHeight: 40,
  },
  moduleMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  realDocModuleText: {
    fontSize: 12,
  },
  realDocActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  previewDocBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 10,
  },
  previewDocBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  noDocsBox: {
    padding: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    textAlign: 'center',
    gap: 12,
    marginTop: 20,
  },
  noDocsTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  noDocsSub: {
    fontSize: 13,
  },
  resetExplorerBtn: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 10,
    marginTop: 6,
  },
  resetExplorerBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  }
});
