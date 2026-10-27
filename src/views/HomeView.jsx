import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { useApp } from '../context/AppContext';
import { COURSES_DATA } from '../data/coursesData';
import { FORMATEURS_DATA } from '../data/formateursData';
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  GraduationCap, 
  Layers, 
  BookOpen, 
  Download, 
  CheckCircle2, 
  Code2, 
  Cpu, 
  Users, 
  Award,
  Zap,
  Globe,
  Star,
  Heart,
  Youtube,
  ExternalLink,
  ShieldCheck,
  FileText,
  Shield,
  Rocket
} from 'lucide-react';

export default function HomeView() {
  const { width: viewportWidth } = useWindowDimensions();
  const { 
    theme, 
    setCurrentTab, 
    setSelectedCycle, 
    navigateToVideos, 
    navigateToLicence, 
    triggerInstallPwa, 
    isPwaInstalled 
  } = useApp();

  const techHighlights = [
    { id: 'html', title: 'HTML5 & Sémantique', desc: 'Structure sémantique moderne, accessibilité WCAG et formulaires.', icon: Code2, color: theme.primary, vidCount: 17 },
    { id: 'css', title: 'CSS3 & Flexbox/Grid', desc: 'Design responsive, animations fluides, glassmorphism et mise en page pro.', icon: Layers, color: theme.primary, vidCount: 20 },
    { id: 'js', title: 'JavaScript ES6+', desc: 'DOM dynamique, asynchronisme async/await, API REST et architecture moderne.', icon: Zap, color: theme.primary, vidCount: 42 },
    { id: 'php', title: 'PHP & Backend Web', desc: 'Programmation orientée objet, sessions, PDO, sécurité et MVC.', icon: Cpu, color: theme.primary, vidCount: 6 },
    { id: 'python', title: 'Python & Algorithmes', desc: 'Traitement de données, scripts d\'automatisation et bases IA.', icon: Globe, color: theme.primary, vidCount: 6 },
    { id: 'vuejs', title: 'Vue.js Framework', desc: 'Applications réactives dynamiques, composants modulaires et réactivité.', icon: Sparkles, color: theme.primary, vidCount: 21 },
    { id: 'angular', title: 'Angular Enterprise', desc: 'Applications d\'entreprise robustes avec TypeScript et RxJS.', icon: Award, color: theme.primary, vidCount: 11 }
  ];

  return (
    <View style={styles.container}>
      {/* 1. Hero Section - Ultra Chic & Welcoming */}
      <View style={styles.heroSection}>
        {/* Glow ambient background */}
        <View style={[styles.glowOrb, { backgroundColor: theme.primary }]} />
        <View style={[styles.glowOrbSecondary, { backgroundColor: theme.secondary }]} />

        <View style={styles.heroContent}>
          {/* Dual SDBSNX & UNCHK Academic Partnership Showcase */}
          <View style={styles.dualEmblemPill}>
            <img 
              src="/sdbsnx-logo.png" 
              alt="SDBSNX - CODE • TECH • IMPACT" 
              style={{
                height: 42,
                width: 'auto',
                objectFit: 'contain',
                borderRadius: 8,
                background: '#FFFFFF',
                padding: '3px 8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }} 
            />
            <View style={[styles.emblemDivider, { backgroundColor: theme.border }]} />
            <img 
              src="/unchk-uvs-logo.png" 
              alt="Université Numérique Cheikh Hamidou Kane (ex UVS)" 
              style={{
                height: 42,
                width: 'auto',
                objectFit: 'contain',
                borderRadius: 8,
                background: '#FFFFFF',
                padding: '3px 8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }} 
            />
          </View>

          {/* Version badge */}
          <View style={[styles.badgeContainer, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
            <Sparkles size={14} color={theme.accent} />
            <Text style={[styles.badgeText, { color: theme.text }]}>
              SDBSNX • Plateforme Académique 100% Gratuite & Libre
            </Text>
            <View style={[styles.badgeLiveDot, { backgroundColor: theme.emerald }]} />
          </View>

          {/* Headline */}
          <Text style={[styles.heroHeading, { color: theme.text }]}>
            L'Excellence en{' '}
            <Text style={{ color: theme.primary }}>Informatique</Text> &{' '}
            <Text style={{ color: theme.primary }}>Développement Web</Text>
          </Text>

          {/* Subtitle */}
          <Text style={[styles.heroSubtitle, { color: theme.textMuted }]}>
            Bienvenue sur <Text style={{ fontWeight: '800', color: theme.text }}>SDBSNX</Text>, une plateforme de ressources en informatique et développement d’applications : cours, TD, examens et vidéos pour les niveaux L1, L2 et L3.
          </Text>

          {/* Action Buttons */}
          <View style={styles.heroBtnGroup}>
            <TouchableOpacity
              style={[styles.btnPrimary, { backgroundColor: theme.primary }]}
              onPress={() => navigateToLicence('L1')}
              activeOpacity={0.8}
            >
              <GraduationCap size={18} color="#FFFFFF" />
              <Text style={styles.btnPrimaryText}>Explorer les Licences (L1 - L3)</Text>
              <ArrowRight size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnSecondary, { borderColor: theme.border, backgroundColor: theme.bgCard }]}
              onPress={() => navigateToVideos('all')}
              activeOpacity={0.8}
            >
              <Play size={16} color={theme.primary} />
              <Text style={[styles.btnSecondaryText, { color: theme.text }]}>Vidéothèque HD (120+)</Text>
            </TouchableOpacity>

            {!isPwaInstalled && (
              <TouchableOpacity
                style={[styles.btnPwaHero, { borderColor: theme.secondary, backgroundColor: theme.secondary + '18' }]}
                onPress={triggerInstallPwa}
                activeOpacity={0.8}
              >
                <Download size={16} color={theme.secondary} />
                <Text style={[styles.btnPwaText, { color: theme.secondary }]}>Installer l'App</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Stats Bar */}
          <View style={[styles.statsGrid, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.primary }]}>530+</Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>Supports & Cours Réels</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.primary }]}>123</Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>Tutoriels Vidéos HD</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.accent }]}>3 Niveaux</Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>Licence 1 • L2 • L3</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.emerald }]}>100%</Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>Libre & Ouvert</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 2. Flagship Tribute & Gratitude Section to Grafikart */}
      <View style={styles.sectionWrap}>
        <View style={[styles.grafikartBannerCard, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
          {/* Ambient subtle glow */}
          <View style={[styles.tributeGlow, { backgroundColor: theme.primary }]} />

          <View style={styles.grafikartContent}>
            {/* Top Badge */}
            <View style={styles.tributeHeaderRow}>
              <View style={[styles.tributeBadge, { backgroundColor: theme.primaryGlow, borderColor: theme.border }]}>
                <Star size={14} color={theme.accent} fill={theme.accent} />
                <Text style={styles.tributeBadgeText}>HOMMAGE & REMERCIEMENTS SPÉCIAUX</Text>
              </View>
              <View style={[styles.authorChip, { backgroundColor: theme.primaryGlow }]}>
                <Heart size={13} color={theme.accent} fill={theme.accent} />
                <Text style={{ fontSize: 12, fontWeight: '700', color: theme.text }}>Reconnaissance Pédagogique</Text>
              </View>
            </View>

            {/* Title */}
            <Text style={[styles.grafikartTitle, { color: theme.text }]}>
            Merci à <Text style={{ color: theme.primary }}>Grafikart (Jonathan Boyer)</Text>, Formateur d'Exception
            </Text>

            {/* Author Testimonial / Personal Message */}
            <View style={[styles.quoteBox, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
              <Text style={[styles.quoteText, { color: theme.text }]}>
                « Je tiens à exprimer ma plus sincère gratitude et mes profonds remerciements à                 <Text style={{ fontWeight: '800', color: theme.primary }}>Jonathan Boyer (Grafikart)</Text>. 
                Il est l'un des formateurs exceptionnels dont la passion, la bienveillance et la remarquable clarté pédagogique m'ont permis d'apprendre pas à pas et de <Text style={{ fontWeight: '800', color: theme.emerald }}>devenir développeur aujourd'hui</Text>.
                Merci infiniment à lui de m'avoir accordé l'autorisation d'intégrer ses vidéos au sein de la plateforme IDA COURS, afin de permettre à toute notre communauté d'étudiants de bénéficier de cours de très haut niveau. »
              </Text>
              <Text style={[styles.quoteSignature, { color: theme.textMuted }]}>
                — Fondateur & Développeur de SDBSNX • IDA COURS
              </Text>
            </View>

            {/* Direct Links to Grafikart Platform & YouTube */}
            <View style={styles.grafikartLinksGrid}>
              {/* Card 1: Official Website */}
              <TouchableOpacity
                style={[styles.grafikartLinkCard, { backgroundColor: theme.bgCard, borderColor: theme.border }]}
                onPress={() => window.open('https://grafikart.fr', '_blank')}
                activeOpacity={0.8}
              >
                <View style={[styles.iconBoxGrafikart, { backgroundColor: theme.primaryGlow }]}>
                  <Globe size={24} color={theme.primary} />
                </View>
                <View style={styles.linkInfoCol}>
                  <View style={styles.linkTitleRow}>
                    <Text style={[styles.linkCardTitle, { color: theme.text }]}>Site Officiel Grafikart.fr</Text>
                    <ExternalLink size={15} color={theme.primary} />
                  </View>
                  <Text style={[styles.linkCardDesc, { color: theme.textMuted }]}>
                    Plus de 1000 tutoriels et formations gratuites : HTML, CSS, JavaScript, PHP, Vue.js, Laravel, Git et bonnes pratiques professionnelles.
                  </Text>
                  <Text style={styles.linkActionPrompt}>Visiter grafikart.fr →</Text>
                </View>
              </TouchableOpacity>

              {/* Card 2: YouTube Channel */}
              <TouchableOpacity
                style={[styles.grafikartLinkCard, { backgroundColor: theme.bgCard, borderColor: theme.border }]}
                onPress={() => window.open('https://www.youtube.com/@grafikart', '_blank')}
                activeOpacity={0.8}
              >
                <View style={[styles.iconBoxGrafikart, { backgroundColor: theme.primaryGlow }]}>
                  <Youtube size={24} color={theme.primary} />
                </View>
                <View style={styles.linkInfoCol}>
                  <View style={styles.linkTitleRow}>
                    <Text style={[styles.linkCardTitle, { color: theme.text }]}>Chaîne YouTube @grafikart</Text>
                    <ExternalLink size={15} color={theme.primary} />
                  </View>
                  <Text style={[styles.linkCardDesc, { color: theme.textMuted }]}>
                    Une communauté de plus de 350 000 passionnés de code. Vidéos gratuites, lives de programmation et astuces de développeur.
                  </Text>
                  <Text style={[styles.linkActionPrompt, { color: theme.primary }]}>Accéder à la chaîne YouTube →</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Gratitude to other educators & UNCHK */}
            <View style={[styles.otherMentorsRow, { borderTopColor: theme.border }]}>
              <Users size={16} color={theme.emerald} />
              <Text style={[styles.otherMentorsText, { color: theme.textMuted }]}>
                <Text style={{ fontWeight: '700', color: theme.text }}>Remerciements chaleureux également</Text> à tous les enseignants, professeurs et tuteurs de l'Université Numérique Cheikh Hamidou Kane (UNCHK), aux formateurs de Force-N, d'Orange Digital Center, et à l'ensemble des créateurs de la communauté francophone & internationale du logiciel libre.
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 3. Cycles Overview (Licence 1, 2, 3) */}
      <View style={styles.sectionWrap}>
        <View style={styles.sectionHeader}>
          <View style={[styles.secTag, { backgroundColor: theme.primaryGlow }]}>
            <GraduationCap size={15} color={theme.primary} />
            <Text style={[styles.secTagText, { color: theme.primary }]}>CURRICULUM UNIVERSITAIRE</Text>
          </View>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Explorez Votre Niveau de Licence</Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textMuted }]}>
            Plus de 530 supports officiels (cours magistraux, fiches TD, TP et examens) directement accessibles.
          </Text>
        </View>

        <View style={styles.cyclesGrid}>
          {[
            { key: 'L1', docCount: '170 documents', color: theme.primary, label: 'L1 • Fondations & Web' },
            { key: 'L2', docCount: '333 documents', color: theme.secondary, label: 'L2 • Backend & Mobile' },
            { key: 'L3', docCount: '30 documents', color: theme.accent, label: 'L3 • Architecture & Sécurité' }
          ].map((item) => {
            const cycleKey = item.key;
            const data = COURSES_DATA[cycleKey];

            return (
              <View 
                key={cycleKey} 
                style={[
                  styles.cycleCard, 
                  { backgroundColor: theme.bgElevated, borderColor: theme.border }
                ]}
              >
                <View style={[styles.cycleBadge, { backgroundColor: item.color + '22', borderColor: item.color }]}>
                  <Text style={[styles.cycleBadgeText, { color: item.color }]}>{item.label}</Text>
                </View>

                <Text style={[styles.cycleTitle, { color: theme.text }]}>{data.fullName}</Text>
                <Text style={[styles.cycleDesc, { color: theme.textMuted }]}>{data.description}</Text>

                <View style={styles.modulesCountRow}>
                  <View style={styles.metaBadge}>
                    <FileText size={14} color={item.color} />
                    <Text style={[styles.metaBadgeText, { color: theme.text, fontWeight: '700' }]}>
                      {item.docCount} en ligne
                    </Text>
                  </View>
                  <View style={styles.metaBadge}>
                    <CheckCircle2 size={14} color={theme.emerald} />
                    <Text style={[styles.metaBadgeText, { color: theme.text }]}>PDFs & TD Disponibles</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.cycleBtn, { backgroundColor: item.color }]}
                  onPress={() => navigateToLicence(cycleKey)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cycleBtnText}>Accéder aux cours de {data.cycle}</Text>
                  <ArrowRight size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>

      {/* Spécialisations */}
      <View style={[styles.sectionWrap, styles.specializationsSection]}>
        <View style={[styles.sectionHeader, styles.specializationsHeader]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Spécialisations</Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textMuted }]}>
            Cybersécurité et entrepreneuriat numérique.
          </Text>
        </View>

        <View
          style={[
            styles.specializationsGrid,
            {
              gridTemplateColumns: viewportWidth <= 640
                ? 'minmax(0, 1fr)'
                : 'repeat(2, minmax(0, 1fr))',
            },
          ]}
        >
          {/* Carte Cybersécurité */}
          <View 
            style={[
              styles.cycleCard, 
              styles.specializationCard,
              { backgroundColor: theme.bgElevated, borderColor: theme.border }
            ]}
          >
            <View style={[styles.cycleBadge, { backgroundColor: theme.primaryGlow, borderColor: theme.border }]}>
              <Shield size={14} color={theme.primary} />
              <Text style={[styles.cycleBadgeText, { color: theme.text }]}>CYBERSÉCURITÉ</Text>
            </View>

            <Text style={[styles.cycleTitle, { color: theme.text }]}>Ressources en Cybersécurité</Text>
            <Text style={[styles.cycleDesc, { color: theme.textMuted }]}>
              Hacking éthique, vulnérabilités OWASP Top 10, analyse de trames Wireshark, durcissement serveur Linux et conformité avec la Commission des Données Personnelles (CDP Sénégal).
            </Text>

            <View style={styles.modulesCountRow}>
              <View style={styles.metaBadge}>
                <Shield size={14} color={theme.primary} />
                <Text style={[styles.metaBadgeText, { color: theme.text, fontWeight: '700' }]}>Labs & Normes ISO</Text>
              </View>
              <View style={styles.metaBadge}>
                <CheckCircle2 size={14} color={theme.emerald} />
                <Text style={[styles.metaBadgeText, { color: theme.text }]}>Espace Documents Ouvert</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.cycleBtn, styles.specializationButton, { backgroundColor: theme.primary }]}
              onPress={() => setCurrentTab('cybersecurite')}
              activeOpacity={0.8}
            >
              <Text style={styles.cycleBtnText}>Explorer les ressources Cybersécurité</Text>
              <ArrowRight size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Carte Entrepreneuriat */}
          <View 
            style={[
              styles.cycleCard, 
              styles.specializationCard,
              { backgroundColor: theme.bgElevated, borderColor: theme.border }
            ]}
          >
            <View style={[styles.cycleBadge, { backgroundColor: theme.primaryGlow, borderColor: theme.border }]}>
              <Rocket size={14} color={theme.primary} />
              <Text style={[styles.cycleBadgeText, { color: theme.text }]}>ENTREPRENEURIAT</Text>
            </View>

            <Text style={[styles.cycleTitle, { color: theme.text }]}>Entrepreneuriat Tech & Business</Text>
            <Text style={[styles.cycleDesc, { color: theme.textMuted }]}>
              Création d'entreprise au Sénégal (APIX, NINEA, RCCM), structuration du Business Model Canvas, rédaction de Pitch Decks percutants et accès aux financements (DER/FJ, CTIC, Force-N).
            </Text>

            <View style={styles.modulesCountRow}>
              <View style={styles.metaBadge}>
                <Rocket size={14} color={theme.textMuted} />
                <Text style={[styles.metaBadgeText, { color: theme.text, fontWeight: '700' }]}>Modèles & Pitch Decks</Text>
              </View>
              <View style={styles.metaBadge}>
                <CheckCircle2 size={14} color={theme.emerald} />
                <Text style={[styles.metaBadgeText, { color: theme.text }]}>Guides Légaux Sénégal</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.cycleBtn, styles.specializationButton, { backgroundColor: theme.primary }]}
              onPress={() => setCurrentTab('entrepreneuriat')}
              activeOpacity={0.8}
            >
              <Text style={styles.cycleBtnText}>Découvrir le Pôle Entrepreneuriat</Text>
              <ArrowRight size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 4. Technologies & Vidéothèque Phares */}
      <View style={styles.sectionWrap}>
        <View style={styles.sectionHeader}>
          <View style={[styles.secTag, { backgroundColor: theme.secondary + '22' }]}>
            <Code2 size={15} color={theme.secondary} />
            <Text style={[styles.secTagText, { color: theme.secondary }]}>VIDÉOTHÈQUE & COMPÉTENCES CLÉS</Text>
          </View>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>123 Vidéos par Technologie</Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textMuted }]}>
            Cliquez sur un langage ou framework pour accéder immédiatement à toutes les vidéos dédiées réalisées par Grafikart.
          </Text>
        </View>

        <View style={styles.techGrid}>
          {techHighlights.map((tech) => {
            const Icon = tech.icon;
            return (
              <TouchableOpacity
                key={tech.id}
                style={[
                  styles.techCard,
                  { backgroundColor: theme.bgElevated, borderColor: theme.border }
                ]}
                onPress={() => navigateToVideos(tech.id)}
                activeOpacity={0.8}
              >
                <View style={styles.techCardHeader}>
                  <View style={[styles.techIconBox, { backgroundColor: tech.color + '22', borderColor: tech.color }]}>
                    <Icon size={22} color={tech.color} />
                  </View>
                  <View style={[styles.vidCountPill, { backgroundColor: tech.color + '18' }]}>
                    <Play size={10} color={tech.color} />
                    <Text style={[styles.vidCountText, { color: tech.color }]}>{tech.vidCount} vidéos</Text>
                  </View>
                </View>
                <Text style={[styles.techTitle, { color: theme.text }]}>{tech.title}</Text>
                <Text style={[styles.techDesc, { color: theme.textMuted }]}>{tech.desc}</Text>
                <View style={styles.cardFooterLink}>
                  <Text style={[styles.cardFooterText, { color: tech.color }]}>Visionner les tutoriels</Text>
                  <ArrowRight size={14} color={tech.color} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 5. University Vision & UNCHK Banner */}
      <View style={styles.sectionWrap}>
        <View style={[styles.unchkCard, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
          <View style={styles.unchkContent}>
            <View style={[styles.unchkBadge, { backgroundColor: theme.accent + '22' }]}>
              <Award size={15} color={theme.accent} />
              <Text style={[styles.unchkBadgeText, { color: theme.accent }]}>VISION ACADÉMIQUE SÉNÉGAL</Text>
            </View>
            <Text style={[styles.unchkTitle, { color: theme.text }]}>
              L'Excellence Numérique à l'UNCHK (ex-UVS)
            </Text>
            <Text style={[styles.unchkText, { color: theme.textMuted }]}>
              L'Université Numérique Cheikh Hamidou Kane offre une opportunité historique de démocratiser le savoir technologique de haut niveau. 
              Grâce à la formation à distance, apprenez à votre rythme tout en développant une rigueur et une autonomie indispensables aux grands ingénieurs logiciels de demain.
            </Text>
            <View style={styles.unchkPoints}>
              <View style={styles.unchkPointItem}>
                <CheckCircle2 size={16} color={theme.emerald} />
                <Text style={[styles.pointText, { color: theme.text }]}>Diplômes universitaires reconnus par le CAMES</Text>
              </View>
              <View style={styles.unchkPointItem}>
                <CheckCircle2 size={16} color={theme.emerald} />
                <Text style={[styles.pointText, { color: theme.text }]}>Flexibilité totale pour étudiants et professionnels</Text>
              </View>
              <View style={styles.unchkPointItem}>
                <CheckCircle2 size={16} color={theme.emerald} />
                <Text style={[styles.pointText, { color: theme.text }]}>Espaces Numériques Ouverts (ENO) dans toutes les régions</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* 6. Formateurs & Partenaires Preview */}
      <View style={styles.sectionWrap}>
        <View style={styles.sectionHeader}>
          <View style={[styles.secTag, { backgroundColor: theme.emerald + '22' }]}>
            <Users size={15} color={theme.emerald} />
            <Text style={[styles.secTagText, { color: theme.emerald }]}>ÉCOSYSTÈME DE FORMATION</Text>
          </View>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Nos Références & Partenaires Pédagogiques</Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textMuted }]}>
            Des ressources conçues avec le meilleur de la pédagogie francophone et internationale.
          </Text>
        </View>

        <View style={styles.formateursGrid}>
          {FORMATEURS_DATA.slice(0, 4).map((f) => (
            <View 
              key={f.id} 
              style={[styles.partnerCard, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}
            >
              <View style={[styles.partnerBadge, { backgroundColor: theme.primaryGlow }]}>
                <Text style={[styles.partnerBadgeText, { color: theme.primary }]}>{f.badge}</Text>
              </View>
              <Text style={[styles.partnerName, { color: theme.text }]}>{f.name}</Text>
              <Text style={[styles.partnerRole, { color: theme.secondary }]}>{f.role}</Text>
              <Text style={[styles.partnerDesc, { color: theme.textMuted }]} numberOfLines={3}>{f.description}</Text>
              <TouchableOpacity 
                style={styles.partnerLink}
                onPress={() => window.open(f.url, '_blank')}
              >
                <Text style={[styles.partnerLinkText, { color: theme.primary }]}>En savoir plus</Text>
                <ArrowRight size={13} color={theme.primary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.centerActionWrap}>
          <TouchableOpacity
            style={[styles.btnOutline, { borderColor: theme.border, backgroundColor: theme.bgCard }]}
            onPress={() => setCurrentTab('formateurs')}
          >
            <Text style={[styles.btnOutlineText, { color: theme.text }]}>Découvrir tous nos formateurs et partenaires</Text>
            <ArrowRight size={16} color={theme.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingBottom: 40,
  },
  heroSection: {
    position: 'relative',
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowOrb: {
    position: 'absolute',
    top: -100,
    left: '15%',
    width: 380,
    height: 380,
    borderRadius: 190,
    filter: 'blur(140px)',
    opacity: 0.2,
    pointerEvents: 'none',
  },
  glowOrbSecondary: {
    position: 'absolute',
    top: 50,
    right: '15%',
    width: 320,
    height: 320,
    borderRadius: 160,
    filter: 'blur(130px)',
    opacity: 0.18,
    pointerEvents: 'none',
  },
  heroContent: {
    maxWidth: 960,
    width: '100%',
    alignItems: 'center',
    textAlign: 'center',
    zIndex: 1,
  },
  dualEmblemPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  emblemDivider: {
    width: 1,
    height: 24,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 30,
    borderWidth: 1,
    marginBottom: 24,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  badgeLiveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  heroHeading: {
    fontSize: 44,
    lineHeight: 52,
    fontWeight: '900',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: -1,
  },
  heroSubtitle: {
    fontSize: 17,
    lineHeight: 28,
    maxWidth: 780,
    marginBottom: 32,
    textAlign: 'center',
  },
  heroBtnGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    justifyContent: 'center',
    marginBottom: 44,
  },
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 14,
    boxShadow: '0 8px 24px rgba(30, 91, 69, 0.24)',
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  btnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  btnSecondaryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  btnPwaHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  btnPwaText: {
    fontSize: 14,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 860,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statNumber: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 36,
  },
  sectionWrap: {
    maxWidth: 1320,
    marginHorizontal: 'auto',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 60,
  },
  specializationsSection: {
    marginTop: 36,
  },
  specializationsHeader: {
    marginBottom: 18,
  },
  specializationsGrid: {
    display: 'grid',
    gap: 16,
    width: '100%',
  },
  specializationCard: {
    width: '100%',
    minWidth: 0,
    maxWidth: 'none',
    padding: 20,
    gap: 10,
    boxShadow: '0 4px 16px rgba(30, 45, 35, 0.06)',
  },
  specializationButton: {
    marginTop: 4,
  },
  grafikartBannerCard: {
    position: 'relative',
    padding: 34,
    borderRadius: 24,
    borderWidth: 1.5,
    boxShadow: '0 18px 45px rgba(30, 91, 69, 0.12)',
    overflow: 'hidden',
  },
  tributeGlow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#1E5B45',
    filter: 'blur(110px)',
    opacity: 0.15,
    pointerEvents: 'none',
  },
  grafikartContent: {
    gap: 18,
  },
  tributeHeaderRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  tributeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  tributeBadgeText: {
    color: '#A8743F',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  authorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  grafikartTitle: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  quoteBox: {
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#1E5B45',
    borderWidth: 1,
    gap: 10,
  },
  quoteText: {
    fontSize: 15,
    lineHeight: 25,
    fontStyle: 'italic',
  },
  quoteSignature: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
  },
  grafikartLinksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 6,
  },
  grafikartLinkCard: {
    flex: 1,
    minWidth: 280,
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
  },
  iconBoxGrafikart: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  linkInfoCol: {
    flex: 1,
    gap: 6,
  },
  linkTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  linkCardTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  linkCardDesc: {
    fontSize: 13,
    lineHeight: 19,
  },
  linkActionPrompt: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E5B45',
    marginTop: 4,
  },
  otherMentorsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1,
    paddingTop: 16,
    marginTop: 6,
  },
  otherMentorsText: {
    fontSize: 13,
    lineHeight: 20,
    flex: 1,
  },
  sectionHeader: {
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 36,
  },
  secTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 12,
  },
  secTagText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: 15,
    maxWidth: 680,
    textAlign: 'center',
    lineHeight: 22,
  },
  cyclesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    justifyContent: 'center',
  },
  cycleCard: {
    flex: 1,
    minWidth: 280,
    maxWidth: 380,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    gap: 14,
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
  },
  cycleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
  },
  cycleBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  cycleTitle: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
  },
  cycleDesc: {
    fontSize: 13,
    lineHeight: 20,
    flex: 1,
  },
  modulesCountRow: {
    gap: 8,
    marginVertical: 4,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cycleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 6,
  },
  cycleBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
    justifyContent: 'center',
  },
  techCard: {
    flex: 1,
    minWidth: 260,
    maxWidth: 360,
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
  },
  techCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  techIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vidCountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  vidCountText: {
    fontSize: 11,
    fontWeight: '700',
  },
  techTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  techDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  cardFooterLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  cardFooterText: {
    fontSize: 12,
    fontWeight: '700',
  },
  unchkCard: {
    padding: 36,
    borderRadius: 24,
    borderWidth: 1,
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1)',
  },
  unchkContent: {
    maxWidth: 820,
    gap: 14,
  },
  unchkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  unchkBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  unchkTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  unchkText: {
    fontSize: 14,
    lineHeight: 24,
  },
  unchkPoints: {
    gap: 10,
    marginTop: 8,
  },
  unchkPointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pointText: {
    fontSize: 13,
    fontWeight: '600',
  },
  formateursGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'center',
  },
  partnerCard: {
    flex: 1,
    minWidth: 260,
    maxWidth: 340,
    padding: 22,
    borderRadius: 18,
    borderWidth: 1,
    gap: 8,
  },
  partnerBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  partnerBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  partnerName: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 4,
  },
  partnerRole: {
    fontSize: 12,
    fontWeight: '600',
  },
  partnerDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
  partnerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  partnerLinkText: {
    fontSize: 12,
    fontWeight: '700',
  },
  centerActionWrap: {
    alignItems: 'center',
    marginTop: 30,
  },
  btnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  btnOutlineText: {
    fontSize: 14,
    fontWeight: '600',
  }
});
