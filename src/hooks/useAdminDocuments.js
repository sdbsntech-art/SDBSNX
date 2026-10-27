import { useEffect, useState } from 'react';
import { DOCUMENT_BUCKET, supabase } from '../lib/supabase';

const formatFileSize = (bytes) => {
  if (!bytes) return 'Document';
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
};

export default function useAdminDocuments(section) {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    const refreshDocuments = () => setRefreshKey((key) => key + 1);
    window.addEventListener('admin-documents-changed', refreshDocuments);

    if (!supabase) {
      setDocuments([]);
      setError('');
      return () => {
        active = false;
        window.removeEventListener('admin-documents-changed', refreshDocuments);
      };
    }

    const loadDocuments = async () => {
      const { data, error: queryError } = await supabase
        .from('documents')
        .select('id, section, category, title, description, storage_path, file_name, file_size, content_type, created_at')
        .eq('section', section)
        .order('created_at', { ascending: false });

      if (!active) return;
      if (queryError) {
        setError('Les nouveaux documents ne sont pas disponibles pour le moment.');
        return;
      }

      setError('');
      setDocuments(data.map((document) => ({
        ...document,
        format: document.content_type === 'application/pdf'
          ? 'PDF'
          : document.file_name.split('.').pop()?.toUpperCase() || 'DOC',
        size: formatFileSize(document.file_size),
        downloadUrl: supabase.storage
          .from(DOCUMENT_BUCKET)
          .getPublicUrl(document.storage_path).data.publicUrl,
      })));
    };

    loadDocuments().catch(() => {
      if (active) setError('Les nouveaux documents ne sont pas disponibles pour le moment.');
    });

    return () => {
      active = false;
      window.removeEventListener('admin-documents-changed', refreshDocuments);
    };
  }, [section, refreshKey]);

  return {
    documents,
    error,
    refresh: () => setRefreshKey((key) => key + 1),
  };
}
