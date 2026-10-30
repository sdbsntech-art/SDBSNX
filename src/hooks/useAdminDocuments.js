import { useEffect, useState } from 'react';

const formatFileSize = (bytes) => {
  if (!bytes) return 'Document';
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
};

const STORAGE_KEY = 'sdbsnx_local_documents';

export default function useAdminDocuments(section) {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    const refreshDocuments = () => setRefreshKey((key) => key + 1);
    window.addEventListener('admin-documents-changed', refreshDocuments);

    try {
      const rawDocuments = localStorage.getItem(STORAGE_KEY);
      const savedDocuments = rawDocuments ? JSON.parse(rawDocuments) : [];
      const filtered = savedDocuments
        .filter((document) => document.section === section)
        .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
        .map((document) => ({
          ...document,
          format: document.content_type === 'application/pdf'
            ? 'PDF'
            : (document.file_name || 'DOC').split('.').pop()?.toUpperCase() || 'DOC',
          size: formatFileSize(document.file_size),
          downloadUrl: document.downloadUrl || '#',
        }));

      if (active) {
        setDocuments(filtered);
        setError('');
      }
    } catch {
      if (active) {
        setError('Les documents locaux ne sont pas disponibles pour le moment.');
      }
    }

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
