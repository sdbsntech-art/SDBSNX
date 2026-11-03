import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity, ArrowDown, ArrowLeft, ArrowUp, BookOpen, Check, ChevronLeft, ChevronRight,
  FileText, GraduationCap, LayoutDashboard, LogOut, Menu, Moon, Plus, Search, Shield,
  Sun, Trash2, Users, X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { navigateToPath } from '../lib/navigation';
import '../styles/admin.css';

const PAGE_SIZE = 20;
const MAX_FILE_SIZE = 20 * 1024 * 1024;
const LIBRARY_MIME_TYPES = new Set([
  'application/pdf',
  'application/epub+zip',
  'image/png',
  'image/jpeg',
  'image/webp',
]);

const SECTIONS = [
  { id: 'dashboard', label: 'Vue d’ensemble', icon: LayoutDashboard },
  { id: 'courses', label: 'Cours', icon: GraduationCap },
  { id: 'resources', label: 'Ressources', icon: BookOpen },
  { id: 'library', label: 'Bibliothèque', icon: FileText },
  { id: 'announcements', label: 'Annonces', icon: Activity },
  { id: 'users', label: 'Utilisateurs', icon: Users, adminOnly: true },
  { id: 'audit', label: 'Journal d’audit', icon: Shield, adminOnly: true },
];

const COLLECTIONS = {
  courses: {
    table: 'courses',
    singular: 'cours',
    select: 'id,title,description,level,published,created_by,created_at',
    fields: [
      { name: 'title', label: 'Titre', type: 'text', required: true, maxLength: 200 },
      { name: 'description', label: 'Description', type: 'textarea', maxLength: 4000 },
      { name: 'level', label: 'Niveau', type: 'select', options: ['L1', 'L2', 'L3', 'autre'], required: true },
      { name: 'published', label: 'Publié', type: 'checkbox' },
    ],
  },
  resources: {
    table: 'resources',
    singular: 'ressource',
    select: 'id,course_id,title,type,url,content,position,published,created_at',
    fields: [
      { name: 'title', label: 'Titre', type: 'text', required: true, maxLength: 200 },
      { name: 'course_id', label: 'Cours associé', type: 'course', required: true },
      { name: 'type', label: 'Type', type: 'select', options: ['video', 'pdf', 'link', 'text'], required: true },
      { name: 'url', label: 'URL HTTPS (facultative)', type: 'url', maxLength: 2048 },
      { name: 'content', label: 'Contenu textuel', type: 'textarea', maxLength: 12000 },
      { name: 'position', label: 'Position', type: 'number', min: 0, required: true },
      { name: 'published', label: 'Publié', type: 'checkbox' },
    ],
  },
  library: {
    table: 'library_items',
    singular: 'élément de bibliothèque',
    select: 'id,title,author,description,category,file_path,external_url,published,created_by,created_at',
    fields: [
      { name: 'title', label: 'Titre', type: 'text', required: true, minLength: 3, maxLength: 200 },
      { name: 'author', label: 'Auteur (facultatif)', type: 'text', maxLength: 200 },
      { name: 'description', label: 'Description', type: 'textarea', maxLength: 4000 },
      { name: 'category', label: 'Catégorie', type: 'text', required: true, maxLength: 120 },
      { name: 'external_url', label: 'Lien externe HTTPS (facultatif)', type: 'url', maxLength: 2048 },
      { name: 'file', label: 'Fichier PDF, EPUB ou image (max. 20 Mo)', type: 'file' },
      { name: 'published', label: 'Publié', type: 'checkbox' },
    ],
  },
  announcements: {
    table: 'announcements',
    singular: 'annonce',
    select: 'id,title,content,published,created_by,created_at',
    fields: [
      { name: 'title', label: 'Titre', type: 'text', required: true, minLength: 3, maxLength: 200 },
      { name: 'content', label: 'Contenu', type: 'textarea', required: true, minLength: 1, maxLength: 12000 },
      { name: 'published', label: 'Publié', type: 'checkbox' },
    ],
  },
};

function friendlyError(error, section) {
  if (import.meta.env.DEV) console.error(`Supabase request failed (${section}):`, error);
  return 'L’opération n’a pas abouti. Vérifiez vos droits et réessayez.';
}

function cleanFileName(name) {
  return name.normalize('NFKC').replace(/[^\w.-]+/g, '-').replace(/^-+|-+$/g, '').slice(-120) || 'document';
}

function uploadWithProgress(client, path, file, onProgress) {
  return client.storage.from('library').createSignedUploadUrl(path)
    .then(({ data, error }) => {
      if (error) throw error;
      return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('PUT', data.signedUrl);
        request.setRequestHeader('cache-control', 'max-age=3600');
        request.setRequestHeader('content-type', file.type);
        request.setRequestHeader('x-upsert', 'false');
        request.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
        });
        request.addEventListener('load', () => {
          if (request.status >= 200 && request.status < 300) {
            onProgress(100);
            resolve();
          } else {
            reject(new Error('upload_failed'));
          }
        });
        request.addEventListener('error', () => reject(new Error('upload_failed')));
        request.addEventListener('timeout', () => reject(new Error('upload_failed')));
        request.send(file);
      });
    });
}

function AdminForm({ collection, initial, courses, saving, uploadingFile, uploadProgress, onCancel, onSave }) {
  const [values, setValues] = useState(() => {
    const result = {};
    for (const field of collection.fields) {
      if (field.type === 'checkbox') result[field.name] = Boolean(initial?.[field.name]);
      else if (field.type === 'file') result[field.name] = null;
      else result[field.name] = initial?.[field.name] ?? (field.name === 'position' ? 0 : '');
    }
    return result;
  });
  const [validation, setValidation] = useState('');

  const setField = (name, value) => setValues((current) => ({ ...current, [name]: value }));

  const submit = (event) => {
    event.preventDefault();
    setValidation('');
    for (const field of collection.fields) {
      if (field.required && !values[field.name] && values[field.name] !== 0) {
        setValidation(`Le champ « ${field.label} » est obligatoire.`);
        return;
      }
      if (typeof values[field.name] === 'string') {
        if (field.minLength && values[field.name].trim().length < field.minLength) {
          setValidation(`Le champ « ${field.label} » doit contenir au moins ${field.minLength} caractères.`);
          return;
        }
        if (field.maxLength && values[field.name].length > field.maxLength) {
          setValidation(`Le champ « ${field.label} » ne peut pas dépasser ${field.maxLength} caractères.`);
          return;
        }
      }
      if (field.type === 'url' && values[field.name]) {
        try {
          if (new URL(values[field.name]).protocol !== 'https:') throw new Error('URL');
        } catch {
          setValidation(`Le champ « ${field.label} » doit être une URL HTTPS valide.`);
          return;
        }
      }
      if (field.name === 'url' && values.type !== 'text' && !values.url) {
        setValidation('Une URL HTTPS est nécessaire pour cette ressource.');
        return;
      }
    }
    onSave(values);
  };

  return (
    <form className="admin-form admin-editor-form" onSubmit={submit}>
      <div className="admin-form-heading">
        <div>
          <p className="admin-eyebrow">{initial ? 'Modifier' : 'Créer'}</p>
          <h2>{initial ? `Modifier ${collection.singular}` : `Nouveau ${collection.singular}`}</h2>
        </div>
        <button className="admin-icon-button" type="button" aria-label="Fermer le formulaire" onClick={onCancel}><X size={19} /></button>
      </div>
      {collection.fields.map((field) => (
        <label className={field.type === 'checkbox' ? 'admin-checkbox-row' : ''} key={field.name}>
          {field.type === 'checkbox' ? (
            <>
              <input type="checkbox" checked={Boolean(values[field.name])} onChange={(event) => setField(field.name, event.target.checked)} />
              <span>{field.label}</span>
            </>
          ) : field.type === 'textarea' ? (
            <>
              <span>{field.label}</span>
              <textarea required={field.required} maxLength={field.maxLength} value={values[field.name]} onChange={(event) => setField(field.name, event.target.value)} rows={4} />
            </>
          ) : field.type === 'select' ? (
            <>
              <span>{field.label}</span>
              <select required={field.required} value={values[field.name]} onChange={(event) => setField(field.name, event.target.value)}>
                <option value="">Choisir…</option>
                {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </>
          ) : field.type === 'course' ? (
            <>
              <span>{field.label}</span>
              <select required={field.required} value={values[field.name]} onChange={(event) => setField(field.name, event.target.value)}>
                <option value="">Choisir un cours…</option>
                {courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
              </select>
            </>
          ) : field.type === 'file' ? (
            <>
              <span>{field.label}</span>
              <input type="file" accept=".pdf,.epub,.png,.jpg,.jpeg,.webp" onChange={(event) => setField(field.name, event.target.files?.[0] || null)} />
              {initial?.file_path && <small>Fichier actuel : {initial.file_path.split('/').pop()}</small>}
            </>
          ) : (
            <>
              <span>{field.label}</span>
              <input
                type={field.type}
                required={field.required}
                min={field.min}
                maxLength={field.maxLength}
                value={values[field.name]}
                onChange={(event) => setField(field.name, field.type === 'number' ? event.target.value : event.target.value)}
              />
            </>
          )}
        </label>
      ))}
      {uploadingFile && collection.table === 'library' && (
        <div className="admin-upload-progress" role="status" aria-live="polite">
          <div><span>Envoi du fichier</span><strong>{uploadProgress}%</strong></div>
          <progress max="100" value={uploadProgress} aria-label="Progression de l’envoi du fichier" />
        </div>
      )}
      {validation && <p className="admin-alert admin-alert-error" role="alert">{validation}</p>}
      <div className="admin-form-actions">
        <button type="button" className="admin-button admin-button-secondary" onClick={onCancel}>Annuler</button>
        <button type="submit" className="admin-button admin-button-primary" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
      </div>
    </form>
  );
}

export default function AdminView() {
  const { user, role, signOut, supabase } = useAuth();
  const [section, setSection] = useState('dashboard');
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [publicationFilter, setPublicationFilter] = useState('');
  const [rows, setRows] = useState([]);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isDark, setIsDark] = useState(() => (
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ));
  const sidebarRef = useRef(null);
  const menuTriggerRef = useRef(null);
  const isAdmin = role === 'admin';
  const visibleSections = useMemo(() => SECTIONS.filter((item) => !item.adminOnly || isAdmin), [isAdmin]);

  const recordAudit = useCallback(async (action, details) => {
    const { error: auditError } = await supabase
      .from('audit_logs')
      .insert({ user_id: user.id, action, details });
    if (auditError) throw auditError;
  }, [user.id]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE;
    try {
      if (section === 'dashboard') {
        const tables = ['courses', 'resources', 'library_items', 'announcements'];
        const counts = await Promise.all(tables.map((table) => supabase.from(table).select('id', { count: 'exact', head: true })));
        const failedCount = counts.find((result) => result.error);
        if (failedCount) throw failedCount.error;
        const nextStats = tables.map((table, index) => ({ label: ({ courses: 'Cours', resources: 'Ressources', library_items: 'Bibliothèque', announcements: 'Annonces' })[table], value: counts[index].count || 0 }));
        if (isAdmin) {
          const usersCount = await supabase.from('profiles').select('id', { count: 'exact', head: true });
          if (usersCount.error) throw usersCount.error;
          nextStats.push({ label: 'Utilisateurs', value: usersCount.count || 0 });
        }
        setStats(nextStats);
        const recent = await supabase.from('courses').select('id,title,level,published,created_at').order('created_at', { ascending: false }).limit(5);
        if (recent.error) throw recent.error;
        setRows(recent.data || []);
        if (isAdmin) {
          const activity = await supabase.from('audit_logs').select('id,action,details,created_at').order('created_at', { ascending: false }).limit(5);
          if (activity.error) throw activity.error;
          setRecentActivity(activity.data || []);
        }
      } else if (section === 'users') {
        let query = supabase.from('profiles').select('id,email,full_name,track,created_at', { count: 'exact' });
        const searchTerm = search.trim().replace(/[,%()]/g, ' ');
        if (searchTerm) query = query.or(`email.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`);
        const result = await query.order('created_at', { ascending: false }).range(from, to - 1);
        if (result.error) throw result.error;
        setRows(result.data || []);
        setHasNextPage((result.count || 0) > to);
        const userIds = (result.data || []).map((profile) => profile.id);
        if (userIds.length) {
          const [rolesResult, progressResults] = await Promise.all([
            supabase.from('user_roles').select('user_id,role').in('user_id', userIds),
            Promise.all(userIds.map((id) => supabase
              .from('progress')
              .select('id', { count: 'exact', head: true })
              .eq('user_id', id)
              .eq('completed', true))),
          ]);
          if (rolesResult.error) throw rolesResult.error;
          const roleMap = Object.fromEntries((rolesResult.data || []).map((item) => [item.user_id, item.role]));
          const progressMap = Object.fromEntries(userIds.map((id, index) => {
            if (progressResults[index].error) throw progressResults[index].error;
            return [id, progressResults[index].count || 0];
          }));
          setRows((current) => current.map((profile) => ({
            ...profile,
            role: roleMap[profile.id] || 'student',
            completedCount: progressMap[profile.id] || 0,
          })));
        }
      } else if (section === 'audit') {
        let query = supabase.from('audit_logs').select('id,user_id,action,details,created_at', { count: 'exact' });
        if (search.trim()) query = query.ilike('action', `%${search.trim()}%`);
        const result = await query.order('created_at', { ascending: false }).range(from, to - 1);
        if (result.error) throw result.error;
        setRows(result.data || []);
        setHasNextPage((result.count || 0) > to);
      } else {
        const collection = COLLECTIONS[section];
        let query = supabase.from(collection.table).select(collection.select, { count: 'exact' });
        if (search.trim()) query = query.ilike('title', `%${search.trim()}%`);
        if (section === 'courses' && levelFilter) query = query.eq('level', levelFilter);
        if (section === 'courses' && publicationFilter) query = query.eq('published', publicationFilter === 'published');
        const result = await query.order('created_at', { ascending: false }).range(from, to - 1);
        if (result.error) throw result.error;
        setRows(result.data || []);
        setHasNextPage((result.count || 0) > to);
      }
    } catch (loadError) {
      setError(friendlyError(loadError, section));
    } finally {
      setLoading(false);
    }
  }, [section, page, search, levelFilter, publicationFilter, isAdmin]);

  useEffect(() => { void loadData(); }, [loadData]);

  useEffect(() => {
    if (section !== 'resources' || !supabase) return;
    supabase.from('courses').select('id,title').order('title').limit(100)
      .then(({ data, error: coursesError }) => {
        if (coursesError) setError(friendlyError(coursesError, 'courses'));
        else setCourses(data || []);
      })
      .catch((coursesError) => setError(friendlyError(coursesError, 'courses')));
  }, [section]);

  useEffect(() => {
    setPage(0);
    setRows([]);
    setEditing(null);
    setShowForm(false);
    setMobileNavOpen(false);
  }, [section, search, levelFilter, publicationFilter]);

  useEffect(() => {
    if (!mobileNavOpen) {
      document.body.style.overflow = '';
      return undefined;
    }

    document.body.style.overflow = 'hidden';
    const firstItem = sidebarRef.current?.querySelector('button');
    firstItem?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMobileNavOpen(false);
        menuTriggerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileNavOpen]);

  const saveItem = async (values) => {
    const collection = COLLECTIONS[section];
    setSaving(true);
    setUploadProgress(0);
    setError('');
    setNotice('');
    let uploadedPath = null;
    let committed = false;
    try {
      const record = {};
      for (const field of collection.fields) {
        if (field.type === 'file') continue;
        const value = values[field.name];
        if (field.type === 'number') record[field.name] = Number(value);
        else if (field.type === 'url' && !value) record[field.name] = null;
        else record[field.name] = typeof value === 'string' ? value.trim() : value;
      }
      if (section === 'courses' || section === 'library' || section === 'announcements') {
        if (!editing) record.created_by = user.id;
      }

      if (section === 'library') {
        const file = values.file;
        if (file) {
          if (file.size > MAX_FILE_SIZE) throw new Error('file_too_large');
          if (!LIBRARY_MIME_TYPES.has(file.type)) throw new Error('file_type_not_allowed');
          const path = `${user.id}/${crypto.randomUUID()}-${cleanFileName(file.name)}`;
          setUploadingFile(true);
          await uploadWithProgress(supabase, path, file, setUploadProgress);
          setUploadingFile(false);
          uploadedPath = path;
          record.file_path = path;
        } else {
          record.file_path = editing?.file_path || null;
        }
        if (!record.file_path && !record.external_url) throw new Error('library_source_required');
      }

      const result = editing
        ? await supabase.from(collection.table).update(record).eq('id', editing.id).select('id').single()
        : await supabase.from(collection.table).insert(record).select('id').single();
      if (result.error) throw result.error;
      committed = true;
      let postCommitError = '';
      try {
        await recordAudit(`${section}.${editing ? 'update' : 'create'}`, { id: result.data.id, title: record.title });
      } catch (auditError) {
        postCommitError = 'Le contenu est enregistré, mais le journal d’audit n’a pas pu être mis à jour. Contactez un administrateur avant de recommencer.';
        if (import.meta.env.DEV) console.error('Content saved but audit entry failed:', auditError);
      }

      if (section === 'library' && editing?.file_path && uploadedPath && editing.file_path !== uploadedPath) {
        const { error: removeError } = await supabase.storage.from('library').remove([editing.file_path]);
        if (removeError) {
          postCommitError = 'Le contenu est enregistré, mais l’ancien fichier n’a pas pu être retiré du stockage.';
          if (import.meta.env.DEV) console.error('Unable to remove the replaced library file:', removeError);
        }
      }
      setShowForm(false);
      setEditing(null);
      await loadData();
      if (postCommitError) setError(postCommitError);
      else setNotice('Modifications enregistrées.');
    } catch (saveError) {
      if (uploadedPath && !committed) {
        const { error: cleanupError } = await supabase.storage.from('library').remove([uploadedPath]);
        if (cleanupError && import.meta.env.DEV) console.error('Unable to clean up an incomplete library upload:', cleanupError);
      }
      if (saveError.message === 'file_too_large') setError('Le fichier dépasse la limite de 20 Mo.');
      else if (saveError.message === 'file_type_not_allowed') setError('Format refusé. Utilisez PDF, EPUB, PNG, JPEG ou WebP.');
      else if (saveError.message === 'library_source_required') setError('Ajoutez un fichier ou un lien externe HTTPS.');
      else setError(friendlyError(saveError, section));
    } finally {
      setUploadingFile(false);
      setSaving(false);
    }
  };

  const togglePublished = async (item) => {
    const collection = COLLECTIONS[section];
    try {
      const { error: updateError } = await supabase.from(collection.table).update({ published: !item.published }).eq('id', item.id);
      if (updateError) throw updateError;
      let auditFailed = false;
      try {
        await recordAudit(`${section}.publish`, { id: item.id, published: !item.published });
      } catch (auditError) {
        auditFailed = true;
        if (import.meta.env.DEV) console.error('Publish state changed but audit entry failed:', auditError);
      }
      await loadData();
      if (auditFailed) setError('La publication a changé, mais le journal d’audit n’a pas pu être mis à jour.');
    } catch (updateError) {
      setError(friendlyError(updateError, section));
    }
  };

  const deleteItem = async (item) => {
    if (!isAdmin || !window.confirm(`Supprimer définitivement « ${item.title} » ?`)) return;
    const collection = COLLECTIONS[section];
    let rowDeleted = false;
    try {
      const { error: deleteError } = await supabase.from(collection.table).delete().eq('id', item.id);
      if (deleteError) throw deleteError;
      rowDeleted = true;
      let postDeleteError = '';
      if (section === 'library' && item.file_path) {
        const { error: storageError } = await supabase.storage.from('library').remove([item.file_path]);
        if (storageError) {
          postDeleteError = 'L’élément est supprimé, mais son fichier n’a pas pu être retiré du stockage.';
          if (import.meta.env.DEV) console.error('Library row deleted but storage file could not be removed:', storageError);
        }
      }
      try {
        await recordAudit(`${section}.delete`, { id: item.id, title: item.title });
      } catch (auditError) {
        postDeleteError = 'L’élément est supprimé, mais le journal d’audit n’a pas pu être mis à jour.';
        if (import.meta.env.DEV) console.error('Content deleted but audit entry failed:', auditError);
      }
      await loadData();
      if (postDeleteError) setError(postDeleteError);
      else setNotice('Élément supprimé.');
    } catch (deleteError) {
      if (rowDeleted) {
        await loadData();
        setError('L’élément est supprimé, mais une étape associée (fichier ou journal) a échoué. Vérifiez le stockage et le journal avant toute nouvelle action.');
        return;
      }
      setError(friendlyError(deleteError, section));
    }
  };

  const changeRole = async (profile, nextRole) => {
    if (profile.id === user.id) {
      setError('Vous ne pouvez pas modifier votre propre rôle.');
      return;
    }
    if (!window.confirm(`Attribuer le rôle « ${nextRole} » à ${profile.email} ?`)) return;
    try {
      const { error: roleUpdateError } = await supabase
        .from('user_roles')
        .upsert({ user_id: profile.id, role: nextRole }, { onConflict: 'user_id' });
      if (roleUpdateError) throw roleUpdateError;
      let auditFailed = false;
      try {
        await recordAudit('users.role.update', { user_id: profile.id, role: nextRole });
      } catch (auditError) {
        auditFailed = true;
        if (import.meta.env.DEV) console.error('User role updated but audit entry failed:', auditError);
      }
      await loadData();
      if (auditFailed) setError('Le rôle a été modifié, mais le journal d’audit n’a pas pu être mis à jour.');
      else setNotice('Rôle mis à jour.');
    } catch (roleError) {
      setError(friendlyError(roleError, 'users'));
    }
  };

  const moveResource = async (item, direction) => {
    const courseItems = rows.filter((row) => row.course_id === item.course_id).sort((a, b) => a.position - b.position);
    const index = courseItems.findIndex((row) => row.id === item.id);
    const target = courseItems[index + direction];
    if (!target) return;
    try {
      const currentPosition = item.position;
      const { error: firstError } = await supabase.from('resources').update({ position: target.position }).eq('id', item.id);
      if (firstError) throw firstError;
      const { error: secondError } = await supabase.from('resources').update({ position: currentPosition }).eq('id', target.id);
      if (secondError) throw secondError;
      await recordAudit('resources.reorder', { id: item.id, target_id: target.id });
      await loadData();
    } catch (moveError) {
      setError(friendlyError(moveError, 'resources'));
    }
  };

  const handleLogout = async () => {
    const { error: signOutError } = await signOut();
    if (signOutError) {
      setError('La déconnexion n’a pas abouti. Réessayez.');
      if (import.meta.env.DEV) console.error('Supabase sign-out failed:', signOutError);
    } else {
      navigateToPath('/connexion', { replace: true });
    }
  };

  const currentSection = visibleSections.find((item) => item.id === section) || visibleSections[0];
  const pageTitle = section === 'dashboard' ? 'Vue d’ensemble' : currentSection.label;

  return (
    <div className={`admin-shell${isDark ? ' is-dark' : ''}`}>
      {mobileNavOpen && <button className="admin-sidebar-scrim" type="button" aria-label="Fermer le menu" onClick={() => setMobileNavOpen(false)} />}
      <aside className={`admin-sidebar${mobileNavOpen ? ' is-open' : ''}`} ref={sidebarRef} id="admin-navigation-drawer">
        <a href="/" className="admin-brand" onClick={(event) => { event.preventDefault(); navigateToPath('/'); }}>
          <img src="/sdbsnx-logo.png" alt="" />
          <span><strong>SDBSNX</strong><small>Administration</small></span>
        </a>
        <nav className="admin-sidebar-nav" aria-label="Navigation administration">
          <span className="admin-nav-label">ESPACE DE GESTION</span>
          {visibleSections.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={`admin-nav-item${section === item.id ? ' is-active' : ''}`}
                key={item.id}
                type="button"
                onClick={() => setSection(item.id)}
              >
                <Icon size={18} /><span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="admin-sidebar-bottom">
          <div className="admin-user-chip">
            <span className="admin-avatar">{(user.email || 'S').slice(0, 1).toUpperCase()}</span>
            <span className="admin-user-label"><strong>{user.email}</strong><small>{role === 'admin' ? 'Administrateur' : 'Éditeur'}</small></span>
          </div>
          <button type="button" className="admin-nav-item" onClick={handleLogout}><LogOut size={18} /><span>Déconnexion</span></button>
          <button type="button" className="admin-nav-item" onClick={() => navigateToPath('/')}><ArrowLeft size={18} /><span>Retour au site</span></button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button type="button" ref={menuTriggerRef} className="admin-icon-button admin-mobile-menu" aria-label="Ouvrir le menu" aria-expanded={mobileNavOpen} aria-controls="admin-navigation-drawer" onClick={() => setMobileNavOpen(true)}><Menu size={21} /></button>
          <div className="admin-topbar-title"><p className="admin-eyebrow">ESPACE DE GESTION</p><h1>{pageTitle}</h1></div>
          <button type="button" className="admin-icon-button admin-theme-toggle" aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'} onClick={() => setIsDark((value) => !value)}>
            {isDark ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          <span className="admin-role-badge">{role === 'admin' ? 'ADMIN' : 'ÉDITEUR'}</span>
        </header>

        <main className="admin-content">
          {error && <div className="admin-alert admin-alert-error" role="alert"><span>{error}</span><button type="button" onClick={() => setError('')} aria-label="Fermer"><X size={16} /></button></div>}
          {notice && <div className="admin-alert admin-alert-success" role="status"><span>{notice}</span><button type="button" onClick={() => setNotice('')} aria-label="Fermer"><X size={16} /></button></div>}

          {section === 'dashboard' && (
            <>
              <div className="admin-welcome">
                <div><p className="admin-eyebrow">BONJOUR</p><h2>Bienvenue dans votre espace de gestion.</h2><p>Gérez les contenus de la plateforme en respectant les droits de votre rôle.</p></div>
                <div className="admin-welcome-icon"><LayoutDashboard size={28} /></div>
              </div>
              {loading ? <div className="admin-loading">Chargement des indicateurs…</div> : (
                <div className="admin-stat-grid">
                  {stats.map((stat) => <article className="admin-stat-card" key={stat.label}><span>{stat.label}</span><strong>{stat.value}</strong></article>)}
                </div>
              )}
              <section className="admin-panel">
                <div className="admin-panel-heading"><div><p className="admin-eyebrow">CONTENU</p><h2>Cours récemment créés</h2></div><button type="button" className="admin-button admin-button-secondary" onClick={() => setSection('courses')}>Voir les cours <ChevronRight size={16} /></button></div>
                <AdminTable rows={rows} section="dashboard" />
              </section>
              {isAdmin && (
                <section className="admin-panel">
                  <div className="admin-panel-heading"><div><p className="admin-eyebrow">SÉCURITÉ</p><h2>Activité récente</h2></div></div>
                  {loading ? <div className="admin-loading">Chargement…</div> : recentActivity.length ? (
                    <div className="admin-activity-list">
                      {recentActivity.map((item) => (
                        <article className="admin-activity-item" key={item.id}>
                          <span className="admin-activity-dot" aria-hidden="true" />
                          <div><strong>{item.action}</strong><small>{JSON.stringify(item.details || {})}</small></div>
                          <time dateTime={item.created_at}>{new Date(item.created_at).toLocaleString('fr-FR')}</time>
                        </article>
                      ))}
                    </div>
                  ) : <div className="admin-empty"><p>Aucune activité enregistrée pour le moment.</p></div>}
                </section>
              )}
            </>
          )}

          {section !== 'dashboard' && (
            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div><p className="admin-eyebrow">GESTION</p><h2>{pageTitle}</h2></div>
                {COLLECTIONS[section] && <button type="button" className="admin-button admin-button-primary" onClick={() => { setEditing(null); setShowForm(true); }}><Plus size={17} /> Ajouter</button>}
              </div>
              <div className="admin-toolbar">
                <label className="admin-search"><Search size={17} /><span className="admin-visually-hidden">Rechercher {section === 'users' ? 'par nom ou e-mail' : 'dans la liste'}</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={section === 'users' ? 'Rechercher par nom ou e-mail' : 'Rechercher'} /></label>
                {section === 'courses' && (
                  <>
                    <label className="admin-filter">
                      <span className="admin-visually-hidden">Filtrer par niveau</span>
                      <select value={levelFilter} onChange={(event) => setLevelFilter(event.target.value)}>
                        <option value="">Tous les niveaux</option>
                        {['L1', 'L2', 'L3', 'autre'].map((level) => <option value={level} key={level}>{level}</option>)}
                      </select>
                    </label>
                    <label className="admin-filter">
                      <span className="admin-visually-hidden">Filtrer par publication</span>
                      <select value={publicationFilter} onChange={(event) => setPublicationFilter(event.target.value)}>
                        <option value="">Tous les états</option>
                        <option value="published">Publié</option>
                        <option value="draft">Brouillon</option>
                      </select>
                    </label>
                  </>
                )}
                <span className="admin-result-count">{rows.length} résultat{rows.length !== 1 ? 's' : ''} sur cette page</span>
              </div>
              {showForm && COLLECTIONS[section] && (
                <AdminForm
                  collection={COLLECTIONS[section]}
                  initial={editing}
                  courses={courses}
                  saving={saving}
                  uploadingFile={uploadingFile}
                  uploadProgress={uploadProgress}
                  onCancel={() => { setShowForm(false); setEditing(null); }}
                  onSave={saveItem}
                />
              )}
              {loading ? <div className="admin-loading">Chargement…</div> : error ? (
                <div className="admin-empty"><p>Les données ne sont pas disponibles.</p><button type="button" className="admin-button admin-button-secondary" onClick={loadData}>Réessayer</button></div>
              ) : (
                <AdminTable
                  rows={rows}
                  section={section}
                  isAdmin={isAdmin}
                  currentUserId={user.id}
                  onEdit={(row) => { setEditing(row); setShowForm(true); }}
                  onDelete={deleteItem}
                  onTogglePublished={togglePublished}
                  onChangeRole={changeRole}
                  onMoveResource={moveResource}
                />
              )}
              {!loading && section !== 'dashboard' && (
                <div className="admin-pagination">
                  <button className="admin-button admin-button-secondary" type="button" disabled={page === 0} onClick={() => setPage((value) => Math.max(0, value - 1))}><ChevronLeft size={16} /> Précédent</button>
                  <span>Page {page + 1}</span>
                  <button className="admin-button admin-button-secondary" type="button" disabled={!hasNextPage} onClick={() => setPage((value) => value + 1)}>Suivant <ChevronRight size={16} /></button>
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

function AdminTable({ rows, section, isAdmin = false, currentUserId, onEdit, onDelete, onTogglePublished, onChangeRole, onMoveResource }) {
  if (!rows.length) return <div className="admin-empty"><p>Aucun élément à afficher.</p></div>;
  if (section === 'users') {
    return (
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Utilisateur</th><th>Parcours</th><th>Inscription</th><th>Progression</th><th>Rôle</th></tr></thead>
          <tbody>{rows.map((row) => (
            <tr key={row.id}>
              <td><strong>{row.full_name || 'Nom non renseigné'}</strong><small>{row.email}</small></td>
              <td>{row.track || '—'}</td>
              <td>{row.created_at ? new Date(row.created_at).toLocaleDateString('fr-FR') : '—'}</td>
              <td>{row.completedCount || 0} activité(s)</td>
              <td>
                {row.id === currentUserId
                  ? <span className="admin-status">{row.role} · vous</span>
                  : <select aria-label={`Rôle de ${row.email}`} value={row.role} onChange={(event) => onChangeRole(row, event.target.value)} disabled={!isAdmin}>
                    {['student', 'editor', 'admin'].map((role) => <option key={role} value={role}>{role}</option>)}
                  </select>}
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    );
  }
  if (section === 'audit') {
    return (
      <div className="admin-table-wrap">
        <table className="admin-table"><thead><tr><th>Date</th><th>Utilisateur</th><th>Action</th><th>Détails</th></tr></thead>
          <tbody>{rows.map((row) => <tr key={row.id}><td>{new Date(row.created_at).toLocaleString('fr-FR')}</td><td>{row.user_id}</td><td><span className="admin-status">{row.action}</span></td><td><code>{JSON.stringify(row.details || {})}</code></td></tr>)}</tbody>
        </table>
      </div>
    );
  }
  const recentDashboard = section === 'dashboard';
  const resourceList = section === 'resources';
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead><tr>
          <th>Titre</th>
          {section === 'courses' && <th>Niveau</th>}
          {resourceList && <th>Type</th>}
          {!recentDashboard && <th>État</th>}
          <th>Date</th>
          {!recentDashboard && <th className="admin-actions-heading">Actions</th>}
        </tr></thead>
        <tbody>{rows.map((row, index) => (
          <tr key={row.id}>
            <td><strong>{row.title}</strong>{row.description && <small>{row.description}</small>}</td>
            {section === 'courses' && <td>{row.level}</td>}
            {resourceList && <td>{row.type}</td>}
            {!recentDashboard && <td><span className={`admin-status${row.published ? ' is-published' : ''}`}>{row.published ? 'Publié' : 'Brouillon'}</span></td>}
            <td>{row.created_at ? new Date(row.created_at).toLocaleDateString('fr-FR') : '—'}</td>
            {!recentDashboard && <td><div className="admin-row-actions">
              {resourceList && <><button type="button" className="admin-icon-button" aria-label="Monter la ressource" disabled={index === 0} onClick={() => onMoveResource(row, -1)}><ArrowUp size={16} /></button><button type="button" className="admin-icon-button" aria-label="Descendre la ressource" onClick={() => onMoveResource(row, 1)}><ArrowDown size={16} /></button></>}
              <button type="button" className="admin-button admin-button-small admin-button-secondary" onClick={() => onEdit(row)}>Modifier</button>
              <button type="button" className="admin-button admin-button-small admin-button-secondary" onClick={() => onTogglePublished(row)}><Check size={15} />{row.published ? 'Dépublier' : 'Publier'}</button>
              {isAdmin && <button type="button" className="admin-icon-button admin-danger-button" aria-label={`Supprimer ${row.title}`} onClick={() => onDelete(row)}><Trash2 size={16} /></button>}
            </div></td>}
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}
