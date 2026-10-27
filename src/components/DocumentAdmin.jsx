import React, { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FileText, LockKeyhole, LogOut, Trash2, Upload, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DOCUMENT_BUCKET, isSupabaseConfigured, supabase } from '../lib/supabase';

const SECTION_OPTIONS = [
  { id: 'library', label: 'Bibliothèque', categories: ['Web', 'Algorithmique', 'Bases de Données', 'Langage C', 'Sécurité', 'Mobile', 'Autre'] },
  { id: 'cybersecurity', label: 'Cybersécurité', categories: ['fondamentaux', 'reseau', 'pentest', 'normes'] },
  { id: 'entrepreneurship', label: 'Entrepreneuriat', categories: ['creation', 'business', 'financement', 'documents'] },
  { id: 'courses', label: 'Cours Licence', categories: ['L1', 'L2', 'L3'] },
];
const ALLOWED_EXTENSIONS = new Set(['pdf', 'doc', 'docx', 'ppt', 'pptx', 'zip']);
const MAX_FILE_SIZE = 30 * 1024 * 1024;
const MIME_TYPES = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  zip: 'application/zip',
};

const readableError = (error) => {
  if (error?.message?.includes('Failed to fetch')) {
    return 'Connexion à Supabase impossible. Vérifiez la configuration réseau du projet.';
  }
  return error?.message || 'Une erreur est survenue. Veuillez réessayer.';
};

export default function DocumentAdmin({ open, onClose }) {
  const { theme } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [section, setSection] = useState(SECTION_OPTIONS[0].id);
  const [category, setCategory] = useState(SECTION_OPTIONS[0].categories[0]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const selectedSection = SECTION_OPTIONS.find((option) => option.id === section);

  useEffect(() => {
    if (!open || !supabase) return undefined;
    let active = true;

    supabase.auth.getSession().then(async ({ data, error }) => {
      if (error) throw error;
      if (!active || !data.session) return;
      await verifyAdministrator(data.session.user, active);
    }).catch((error) => {
      if (active) setErrorMessage(readableError(error));
    });

    return () => {
      active = false;
    };
  }, [open]);

  useEffect(() => {
    if (!open || !user || !supabase) return undefined;
    let active = true;

    supabase
      .from('documents')
      .select('id, section, category, title, description, file_name, file_size, created_at, storage_path')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) throw error;
        setDocuments(data);
      })
      .catch((error) => {
        if (active) setErrorMessage(readableError(error));
      });

    return () => {
      active = false;
    };
  }, [open, user, successMessage]);

  const verifyAdministrator = async (authUser, active = true) => {
    const { data, error } = await supabase
      .from('document_admins')
      .select('user_id')
      .eq('user_id', authUser.id)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      await supabase.auth.signOut();
      if (active) {
        setErrorMessage('Ce compte n’a pas les droits administrateur. Ajoutez son utilisateur à la liste des administrateurs Supabase.');
      }
      return false;
    }

    if (active) {
      setUser(authUser);
      setErrorMessage('');
    }
    return true;
  };

  const signIn = async () => {
    if (!supabase || !email.trim() || !password) {
      setErrorMessage('Saisissez votre adresse e-mail et votre mot de passe.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      const isAdministrator = await verifyAdministrator(data.user);
      if (isAdministrator) setPassword('');
    } catch (error) {
      setErrorMessage(readableError(error));
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async () => {
    if (!supabase || !user || !title.trim() || !file) {
      setErrorMessage('Renseignez le titre et sélectionnez un document.');
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_EXTENSIONS.has(extension)) {
      setErrorMessage('Formats acceptés : PDF, DOC, DOCX, PPT, PPTX et ZIP.');
      return;
    }
    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      setErrorMessage('Le fichier doit peser entre 1 octet et 30 Mo.');
      return;
    }

    const safeFileName = file.name.normalize('NFKD').replace(/[^\w.-]+/g, '-');
    const storagePath = `${section}/${crypto.randomUUID()}-${safeFileName}`;
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const { error: uploadError } = await supabase.storage
        .from(DOCUMENT_BUCKET)
        .upload(storagePath, file, {
          cacheControl: '3600',
          contentType: MIME_TYPES[extension],
          upsert: false,
        });
      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase.from('documents').insert({
        section,
        category,
        title: title.trim(),
        description: description.trim(),
        storage_path: storagePath,
        file_name: file.name,
        file_size: file.size,
        content_type: MIME_TYPES[extension],
        created_by: user.id,
      });
      if (insertError) {
        const { error: cleanupError } = await supabase.storage
          .from(DOCUMENT_BUCKET)
          .remove([storagePath]);
        if (cleanupError) {
          throw new Error(`L’enregistrement a échoué et le fichier temporaire n’a pas pu être supprimé : ${insertError.message}`);
        }
        throw insertError;
      }

      setTitle('');
      setDescription('');
      setFile(null);
      setSuccessMessage('Document ajouté. Il sera visible dans la rubrique choisie après actualisation.');
      window.dispatchEvent(new CustomEvent('admin-documents-changed'));
    } catch (error) {
      setErrorMessage(readableError(error));
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (document) => {
    if (!supabase || !window.confirm(`Supprimer « ${document.title} » ?`)) return;
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const { error: deleteError } = await supabase
        .from('documents')
        .delete()
        .eq('id', document.id);
      if (deleteError) throw deleteError;
      setDocuments((currentDocuments) => currentDocuments.filter((item) => item.id !== document.id));
      window.dispatchEvent(new CustomEvent('admin-documents-changed'));

      const { error: storageError } = await supabase.storage
        .from(DOCUMENT_BUCKET)
        .remove([document.storage_path]);
      if (storageError) {
        throw new Error(`La fiche a été retirée, mais son fichier n’a pas pu être supprimé du stockage : ${storageError.message}`);
      }
      setSuccessMessage('Document supprimé.');
    } catch (error) {
      setErrorMessage(readableError(error));
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (!supabase) return;
    setLoading(true);
    setErrorMessage('');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setDocuments([]);
      setPassword('');
      setSuccessMessage('');
    } catch (error) {
      setErrorMessage(readableError(error));
    } finally {
      setLoading(false);
    }
  };

  const changeSection = (nextSection) => {
    const next = SECTION_OPTIONS.find((option) => option.id === nextSection);
    setSection(nextSection);
    setCategory(next.categories[0]);
    setFile(null);
  };

  if (!open) return null;

  return (
    <View className="admin-overlay" style={styles.overlay}>
      <View
        className="admin-dialog"
        style={[styles.dialog, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}
        accessibilityRole="dialog"
        accessibilityLabel="Administration des documents"
      >
        <View className="admin-heading">
          <View>
            <Text style={[styles.heading, { color: theme.text }]}>Administration</Text>
            <Text style={[styles.subheading, { color: theme.textMuted }]}>Gestion des documents pédagogiques</Text>
          </View>
          <TouchableOpacity onPress={onClose} accessibilityRole="button" accessibilityLabel="Fermer">
            <X size={20} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        {!isSupabaseConfigured ? (
          <View style={[styles.notice, { backgroundColor: theme.primaryGlow }]}>
            <Text style={[styles.noticeTitle, { color: theme.text }]}>Configuration Supabase requise</Text>
            <Text style={[styles.bodyText, { color: theme.textMuted }]}>
              Renseignez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans le fichier .env, puis exécutez supabase/schema.sql dans l’éditeur SQL de votre projet Supabase.
            </Text>
          </View>
        ) : !user ? (
          <View className="admin-login-form">
            <View style={[styles.notice, { backgroundColor: theme.primaryGlow }]}>
              <LockKeyhole size={18} color={theme.primary} />
              <Text style={[styles.bodyText, { color: theme.textMuted }]}>
                Accès réservé aux comptes autorisés dans Supabase.
              </Text>
            </View>
            <TextInput
              style={[styles.input, { backgroundColor: theme.bgCard, borderColor: theme.border, color: theme.text }]}
              placeholder="Adresse e-mail"
              placeholderTextColor={theme.textDim}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              accessibilityLabel="Adresse e-mail administrateur"
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.bgCard, borderColor: theme.border, color: theme.text }]}
              placeholder="Mot de passe"
              placeholderTextColor={theme.textDim}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="current-password"
              onSubmitEditing={signIn}
              accessibilityLabel="Mot de passe administrateur"
            />
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: theme.primary }]}
              onPress={signIn}
              disabled={loading}
              accessibilityRole="button"
            >
              <Text style={styles.primaryButtonText}>{loading ? 'Connexion…' : 'Se connecter'}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="admin-workspace">
            <View className="admin-session-row">
              <Text style={[styles.bodyText, { color: theme.textMuted }]} numberOfLines={1}>{user.email}</Text>
              <TouchableOpacity style={styles.signOutButton} onPress={signOut} disabled={loading}>
                <LogOut size={15} color={theme.textMuted} />
                <Text style={[styles.signOutText, { color: theme.textMuted }]}>Déconnexion</Text>
              </TouchableOpacity>
            </View>

            <View className="admin-document-form">
              <Text style={[styles.sectionHeading, { color: theme.text }]}>Ajouter un document</Text>
              <View className="admin-form-grid">
                <View className="admin-field">
                  <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>Rubrique</Text>
                  <select
                    className="admin-select"
                    style={{ backgroundColor: theme.bgCard, borderColor: theme.border, color: theme.text }}
                    value={section}
                    onChange={(event) => changeSection(event.target.value)}
                    aria-label="Rubrique du document"
                  >
                    {SECTION_OPTIONS.map((option) => (
                      <option key={option.id} value={option.id}>{option.label}</option>
                    ))}
                  </select>
                </View>
                <View className="admin-field">
                  <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>Catégorie</Text>
                  <select
                    className="admin-select"
                    style={{ backgroundColor: theme.bgCard, borderColor: theme.border, color: theme.text }}
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    aria-label="Catégorie du document"
                  >
                    {selectedSection.categories.map((value) => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </select>
                </View>
              </View>
              <TextInput
                style={[styles.input, { backgroundColor: theme.bgCard, borderColor: theme.border, color: theme.text }]}
                placeholder="Titre du document"
                placeholderTextColor={theme.textDim}
                value={title}
                onChangeText={setTitle}
                maxLength={180}
              />
              <TextInput
                style={[styles.input, styles.descriptionInput, { backgroundColor: theme.bgCard, borderColor: theme.border, color: theme.text }]}
                placeholder="Description (facultative)"
                placeholderTextColor={theme.textDim}
                value={description}
                onChangeText={setDescription}
                maxLength={1200}
                multiline
              />
              <View className="admin-file-row">
                <label className="admin-file-label">
                  <Upload size={15} />
                  <span>{file ? file.name : 'Choisir un fichier (PDF, Word, PPT ou ZIP)'}</span>
                  <input
                    className="admin-file-input"
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                    onChange={(event) => setFile(event.target.files?.[0] || null)}
                  />
                </label>
                <TouchableOpacity
                  style={[styles.primaryButton, styles.uploadButton, { backgroundColor: theme.primary }]}
                  onPress={uploadDocument}
                  disabled={loading}
                  accessibilityRole="button"
                >
                  <Upload size={15} color="#FFFFFF" />
                  <Text style={styles.primaryButtonText}>{loading ? 'En cours…' : 'Ajouter'}</Text>
                </TouchableOpacity>
              </View>
              <Text style={[styles.fieldHint, { color: theme.textDim }]}>Taille maximale : 30 Mo.</Text>
            </View>

            <View className="admin-documents-list">
              <Text style={[styles.sectionHeading, { color: theme.text }]}>Documents ajoutés ({documents.length})</Text>
              {documents.length === 0 ? (
                <Text style={[styles.bodyText, { color: theme.textDim }]}>Aucun document ajouté pour le moment.</Text>
              ) : documents.map((document) => (
                <View
                  className="admin-document-row"
                  key={document.id}
                  style={[styles.documentRow, { borderColor: theme.border, backgroundColor: theme.bgCard }]}
                >
                  <FileText size={17} color={theme.primary} />
                  <View className="admin-document-copy" style={styles.documentCopy}>
                    <Text style={[styles.documentTitle, { color: theme.text }]} numberOfLines={1}>{document.title}</Text>
                    <Text style={[styles.documentMeta, { color: theme.textDim }]} numberOfLines={1}>
                      {SECTION_OPTIONS.find((option) => option.id === document.section)?.label} · {document.category} · {document.file_name}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => deleteDocument(document)}
                    disabled={loading}
                    accessibilityRole="button"
                    accessibilityLabel={`Supprimer ${document.title}`}
                    style={styles.deleteButton}
                  >
                    <Trash2 size={16} color={theme.secondary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {!!errorMessage && (
          <Text
            className="admin-error-message"
            style={[styles.errorMessage, { color: theme.secondary, backgroundColor: `${theme.secondary}18` }]}
            accessibilityRole="alert"
          >
            {errorMessage}
          </Text>
        )}
        {!!successMessage && (
          <Text className="admin-success-message" style={[styles.successMessage, { color: theme.primary }]} accessibilityRole="status">
            {successMessage}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 11000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(12, 21, 16, 0.62)',
  },
  dialog: {
    width: '100%',
    maxWidth: 720,
    maxHeight: '90vh',
    overflowY: 'auto',
    padding: 22,
    borderRadius: 16,
    borderWidth: 1,
    boxShadow: '0 24px 70px rgba(0,0,0,0.28)',
    gap: 16,
  },
  heading: { fontSize: 20, fontWeight: '800' },
  subheading: { fontSize: 12, marginTop: 3 },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    borderRadius: 10,
  },
  noticeTitle: { fontSize: 14, fontWeight: '700' },
  bodyText: { fontSize: 12, lineHeight: 18, flexShrink: 1 },
  input: {
    minHeight: 42,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderRadius: 9,
    fontSize: 13,
    outlineStyle: 'none',
  },
  descriptionInput: { minHeight: 68, textAlignVertical: 'top' },
  primaryButton: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingHorizontal: 14,
    borderWidth: 0,
    borderRadius: 9,
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  sectionHeading: { fontSize: 14, fontWeight: '800', marginBottom: 8 },
  fieldLabel: { fontSize: 11, fontWeight: '700', marginBottom: 5 },
  fieldHint: { fontSize: 11 },
  uploadButton: { flexShrink: 0 },
  documentRow: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 9,
  },
  documentCopy: { flex: 1, minWidth: 0, gap: 3 },
  documentTitle: { fontSize: 12, fontWeight: '700' },
  documentMeta: { fontSize: 10 },
  deleteButton: { padding: 8 },
  signOutButton: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  signOutText: { fontSize: 11, fontWeight: '600' },
  errorMessage: { fontSize: 12, lineHeight: 18 },
  successMessage: { fontSize: 12, lineHeight: 18, fontWeight: '600' },
};
