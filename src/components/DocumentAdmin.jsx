import React, { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FileText, LockKeyhole, LogOut, Trash2, Upload, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const SECTION_OPTIONS = [
  { id: 'library', label: 'Bibliothèque', categories: ['Web', 'Algorithmique', 'Bases de Données', 'Langage C', 'Sécurité', 'Mobile', 'Autre'] },
  { id: 'cybersecurity', label: 'Cybersécurité', categories: ['fondamentaux', 'reseau', 'pentest', 'normes'] },
  { id: 'entrepreneurship', label: 'Entrepreneuriat', categories: ['creation', 'business', 'financement', 'documents'] },
  { id: 'courses', label: 'Cours Licence', categories: ['L1', 'L2', 'L3'] },
];

const STORAGE_KEY = 'sdbsnx_local_documents';
const SESSION_KEY = 'sdbsnx_local_admin_session';
const ADMIN_EMAIL = 'seydoubakhayokho1@gmail.com';
const ADMIN_PASSWORD = 'sdbsnx@@00';
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

const readDocuments = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveDocuments = (documents) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
};

const readSession = () => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result));
  reader.onerror = () => reject(new Error('Impossible de lire le fichier local.'));
  reader.readAsDataURL(file);
});

const readableError = (error) => error?.message || 'Une erreur est survenue. Veuillez réessayer.';

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
    if (!open) return;
    const session = readSession();
    if (session) {
      setUser(session);
    }
    setDocuments(readDocuments());
  }, [open]);

  const signIn = async () => {
    if (!email.trim() || !password) {
      setErrorMessage('Saisissez votre adresse e-mail et votre mot de passe.');
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      setErrorMessage('Identifiants invalides. Vérifiez vos informations puis réessayez.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const session = { id: 'local-admin', email: ADMIN_EMAIL };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    setPassword('');
    setSuccessMessage('Connexion locale réussie.');
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      localStorage.removeItem(SESSION_KEY);
      setUser(null);
      setDocuments(readDocuments());
      setPassword('');
      setSuccessMessage('Déconnexion locale réussie.');
    } catch (error) {
      setErrorMessage(readableError(error));
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async () => {
    if (!user || !title.trim() || !file) {
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

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const safeFileName = file.name.normalize('NFKD').replace(/[^\w.-]+/g, '-');
      const documentId = `local-${Date.now()}-${crypto.randomUUID()}`;
      const entry = {
        id: documentId,
        section,
        category,
        title: title.trim(),
        description: description.trim(),
        file_name: file.name,
        file_size: file.size,
        content_type: MIME_TYPES[extension],
        created_at: new Date().toISOString(),
        storage_path: `${section}/${documentId}-${safeFileName}`,
        downloadUrl: dataUrl,
        format: extension.toUpperCase(),
        size: `${(file.size / (1024 * 1024)).toFixed(1)} Mo`,
      };

      const currentDocuments = readDocuments();
      const nextDocuments = [entry, ...currentDocuments];
      saveDocuments(nextDocuments);
      setDocuments(nextDocuments);
      setTitle('');
      setDescription('');
      setFile(null);
      setSuccessMessage('Document enregistré localement et disponible dans la rubrique choisie.');
      window.dispatchEvent(new CustomEvent('admin-documents-changed'));
    } catch (error) {
      setErrorMessage(readableError(error));
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (document) => {
    if (!window.confirm(`Supprimer « ${document.title} » ?`)) return;

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const currentDocuments = readDocuments().filter((item) => item.id !== document.id);
      saveDocuments(currentDocuments);
      setDocuments(currentDocuments);
      window.dispatchEvent(new CustomEvent('admin-documents-changed'));
      setSuccessMessage('Document supprimé de la mémoire locale.');
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

        {!user ? (
          <View className="admin-login-form">
            <View style={[styles.notice, { backgroundColor: theme.primaryGlow }]}>
              <LockKeyhole size={18} color={theme.primary} />
              <Text style={[styles.bodyText, { color: theme.textMuted }]}>
                Accès réservé. Connexion locale de démonstration active.
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
          <Text
            className="admin-success-message"
            style={[styles.successMessage, { color: theme.primary, backgroundColor: `${theme.primary}12` }]}
            accessibilityRole="status"
          >
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
    zIndex: 1300,
    backgroundColor: 'rgba(15, 23, 18, 0.42)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  dialog: {
    width: 'min(900px, 100%)',
    maxHeight: '86vh',
    overflowY: 'auto',
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    boxShadow: '0 18px 50px rgba(0, 0, 0, 0.18)',
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subheading: {
    fontSize: 13,
    marginTop: 2,
  },
  notice: {
    padding: 12,
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  compactInfo: {
    fontSize: 12,
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 13,
    lineHeight: 18,
  },
  input: {
    width: '100%',
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 14,
    marginBottom: 10,
  },
  descriptionInput: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  primaryButton: {
    minHeight: 42,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  signOutButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.25)',
  },
  signOutText: {
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 12,
    marginBottom: 6,
    fontWeight: '700',
  },
  fieldHint: {
    fontSize: 11,
    marginTop: 4,
  },
  errorMessage: {
    marginTop: 12,
    padding: 10,
    borderRadius: 10,
    fontSize: 12,
    lineHeight: 18,
  },
  successMessage: {
    marginTop: 12,
    padding: 10,
    borderRadius: 10,
    fontSize: 12,
    lineHeight: 18,
  },
  documentRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  documentCopy: {
    flex: 1,
    minWidth: 0,
  },
  documentTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  documentMeta: {
    fontSize: 11,
    marginTop: 4,
  },
  deleteButton: {
    width: 34,
    height: 34,
    borderRadius: 9,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.25)',
  },
  uploadButton: {
    flex: 0,
  },
};
