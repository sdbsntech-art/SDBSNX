import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ExternalLink, 
  Download, 
  FileText, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  Loader2, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
  RefreshCw,
  Eye
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';

// Configure PDF.js worker
if (typeof window !== 'undefined' && pdfjsLib && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
}

export default function PdfViewerModal() {
  const { activePdfPreview, setActivePdfPreview, theme, triggerToast } = useApp();
  
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState('single'); // 'single' | 'continuous'
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  const modalContainerRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const singleCanvasRef = useRef(null);
  const renderTaskRef = useRef(null);
  const pdfDocRef = useRef(null);

  // Resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        } else {
          handleClose();
        }
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        handleNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [numPages, currentPage]);

  // Fullscreen listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Format and clean document title
  const cleanTitle = useCallback((rawName) => {
    if (!rawName) return 'Support de Cours';
    try {
      const decoded = decodeURIComponent(rawName);
      // Remove file extension for cleaner title
      return decoded.replace(/\.(pdf|docx|doc|pptx|xlsx)$/i, '');
    } catch {
      return rawName;
    }
  }, []);

  const fileUrl = activePdfPreview?.url || '#';
  const rawTitle = activePdfPreview?.name || activePdfPreview?.filename || 'Document';
  const displayTitle = cleanTitle(rawTitle);
  const isPdf = activePdfPreview?.ext === 'PDF' || 
    (fileUrl && fileUrl.toLowerCase().endsWith('.pdf')) ||
    (rawTitle && rawTitle.toLowerCase().endsWith('.pdf'));

  // Load PDF document using PDF.js
  useEffect(() => {
    if (!activePdfPreview || !isPdf || !fileUrl || fileUrl === '#') {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setLoadError(null);
    setCurrentPage(1);
    setZoomLevel(isMobile ? 100 : 110);
    pdfDocRef.current = null;

    const loadPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({
          url: fileUrl,
          cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
          cMapPacked: true,
        });

        const pdf = await loadingTask.promise;
        if (!isMounted) return;

        pdfDocRef.current = pdf;
        setNumPages(pdf.numPages);
        setIsLoading(false);
      } catch (err) {
        console.warn('PDF.js loading failed or CORS restriction:', err);
        if (isMounted) {
          setLoadError(err.message || 'Impossible de charger le visualiseur interactif.');
          setIsLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      isMounted = false;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {}
      }
    };
  }, [activePdfPreview, fileUrl, isPdf, isMobile]);

  // Render current page onto Canvas
  const renderCurrentPage = useCallback(async () => {
    if (!pdfDocRef.current || !singleCanvasRef.current || currentPage < 1) return;

    try {
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {}
      }

      const page = await pdfDocRef.current.getPage(currentPage);
      const canvas = singleCanvasRef.current;
      if (!canvas) return;

      const containerWidth = canvasContainerRef.current 
        ? canvasContainerRef.current.clientWidth 
        : window.innerWidth;

      const unscaledViewport = page.getViewport({ scale: 1 });
      
      // Calculate responsive fit width
      const horizontalPadding = isMobile ? 16 : 48;
      const availableWidth = Math.max(containerWidth - horizontalPadding, 280);
      const fitScale = availableWidth / unscaledViewport.width;
      const actualScale = fitScale * (zoomLevel / 100);

      // Retina / HiDPI sharp rendering
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      const viewport = page.getViewport({ scale: actualScale });

      canvas.width = Math.floor(viewport.width * dpr);
      canvas.height = Math.floor(viewport.height * dpr);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
      };

      const task = page.render(renderContext);
      renderTaskRef.current = task;
      await task.promise;
    } catch (err) {
      if (err?.name !== 'RenderingCancelledException') {
        console.error('Error rendering PDF page:', err);
      }
    }
  }, [currentPage, zoomLevel, isMobile]);

  useEffect(() => {
    if (!isLoading && pdfDocRef.current && !loadError) {
      renderCurrentPage();
    }
  }, [isLoading, currentPage, zoomLevel, renderCurrentPage, loadError]);

  if (!activePdfPreview) return null;

  const handleClose = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setActivePdfPreview(null);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, numPages || 1));
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 20, 220));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 20, 60));
  const handleResetZoom = () => setZoomLevel(100);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (modalContainerRef.current) {
          await modalContainerRef.current.requestFullscreen();
          setIsFullscreen(true);
        }
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      window.open(fileUrl, '_blank');
    }
  };

  const handleOpenExternal = () => {
    if (fileUrl && fileUrl !== '#') {
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="pdf-modal-overlay" role="dialog" aria-modal="true" aria-label={displayTitle}>
      {/* Backdrop */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'transparent',
          zIndex: 0
        }}
        onClick={handleClose} 
      />

      {/* Main Modal Card */}
      <div 
        ref={modalContainerRef}
        className="pdf-modal-container"
        style={{
          backgroundColor: theme.bgElevated,
          borderColor: theme.border,
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: isMobile ? '100dvh' : '92vh',
          width: isMobile ? '100vw' : 'min(96vw, 1200px)',
          borderRadius: isMobile ? 0 : 20,
          overflow: 'hidden',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.55)',
        }}
      >
        {/* Top Header Bar */}
        <header 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            padding: isMobile ? '10px 12px' : '12px 20px',
            borderBottom: `1px solid ${theme.border}`,
            backgroundColor: theme.bgCard,
            flexShrink: 0,
            zIndex: 10
          }}
        >
          {/* Left info: Back + Type + Decoded Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Fermer le document"
              title="Fermer (Échap)"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: isMobile ? '7px 9px' : '8px 12px',
                borderRadius: 10,
                border: `1px solid ${theme.border}`,
                backgroundColor: theme.bgSecondary,
                color: theme.text,
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 700,
                flexShrink: 0
              }}
            >
              <ArrowLeft size={15} color={theme.primary} />
              <span className="pdf-header-label">Retour</span>
            </button>

            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 8px',
                borderRadius: 8,
                backgroundColor: theme.primaryGlow,
                border: `1px solid ${theme.borderHover}`,
                flexShrink: 0
              }}
            >
              <FileText size={13} color={theme.primary} />
              <span style={{ fontSize: 11, fontWeight: 800, color: theme.primary }}>
                {activePdfPreview.ext || 'PDF'}
              </span>
            </div>

            <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', flex: 1 }}>
              <span 
                style={{
                  fontSize: isMobile ? 12 : 14,
                  fontWeight: 700,
                  color: theme.text,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  lineHeight: 1.2
                }}
                title={displayTitle}
              >
                {displayTitle}
              </span>
              {numPages > 0 && (
                <span style={{ fontSize: 11, color: theme.textDim, marginTop: 1 }}>
                  Page {currentPage} sur {numPages}
                </span>
              )}
            </div>
          </div>

          {/* Right Toolbar Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 5 : 8, flexShrink: 0 }}>
            {/* Page navigation controls if PDF loaded */}
            {numPages > 1 && (
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  padding: '3px 6px',
                  borderRadius: 10,
                  backgroundColor: theme.bgSecondary,
                  border: `1px solid ${theme.border}`
                }}
              >
                <button
                  type="button"
                  onClick={handlePrevPage}
                  disabled={currentPage <= 1}
                  title="Page précédente"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '4px',
                    borderRadius: 6,
                    cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                    opacity: currentPage <= 1 ? 0.35 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    color: theme.text
                  }}
                >
                  <ChevronLeft size={16} />
                </button>
                <span style={{ fontSize: 11, fontWeight: 800, color: theme.text, minWidth: 44, textAlign: 'center' }}>
                  {currentPage}/{numPages}
                </span>
                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={currentPage >= numPages}
                  title="Page suivante"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '4px',
                    borderRadius: 6,
                    cursor: currentPage >= numPages ? 'not-allowed' : 'pointer',
                    opacity: currentPage >= numPages ? 0.35 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    color: theme.text
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

            {/* Zoom Controls (hidden on small mobile screens to keep header clean) */}
            {!isMobile && isPdf && !loadError && (
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  padding: '2px 4px',
                  borderRadius: 10,
                  backgroundColor: theme.bgSecondary,
                  border: `1px solid ${theme.border}`
                }}
              >
                <button
                  type="button"
                  onClick={handleZoomOut}
                  title="Zoom arrière"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '5px 7px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    color: theme.textMuted
                  }}
                >
                  <ZoomOut size={14} />
                </button>
                <button
                  type="button"
                  onClick={handleResetZoom}
                  title="Ajuster (100%)"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '4px 6px',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    color: zoomLevel === 100 ? theme.primary : theme.text
                  }}
                >
                  {zoomLevel}%
                </button>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  title="Zoom avant"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '5px 7px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    color: theme.textMuted
                  }}
                >
                  <ZoomIn size={14} />
                </button>
              </div>
            )}

            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
              style={{
                display: isMobile ? 'none' : 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 10px',
                borderRadius: 10,
                border: `1px solid ${theme.border}`,
                backgroundColor: theme.bgCard,
                color: theme.text,
                cursor: 'pointer',
              }}
            >
              {isFullscreen ? <Minimize2 size={15} color={theme.primary} /> : <Maximize2 size={15} color={theme.primary} />}
            </button>

            {/* Open in external tab */}
            <button
              type="button"
              onClick={handleOpenExternal}
              title="Ouvrir dans un nouvel onglet"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: isMobile ? '7px 9px' : '8px 11px',
                borderRadius: 10,
                border: `1px solid ${theme.border}`,
                backgroundColor: theme.bgCard,
                color: theme.text,
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600
              }}
            >
              <ExternalLink size={14} color={theme.primary} />
              <span className="pdf-header-label">Onglet</span>
            </button>

            {/* Download Button */}
            <a
              href={fileUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (triggerToast) triggerToast(`Téléchargement de : ${displayTitle}`, 'success');
              }}
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: isMobile ? '7px 11px' : '8px 13px',
                borderRadius: 10,
                backgroundColor: theme.primary,
                color: '#FFFFFF',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(30, 91, 69, 0.28)'
              }}
              title="Télécharger le fichier PDF"
            >
              <Download size={14} color="#FFF" />
              <span className="pdf-header-label">Télécharger</span>
            </a>

            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              title="Fermer"
              aria-label="Fermer"
              style={{
                width: 34,
                height: 34,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
                border: `1px solid ${theme.border}`,
                backgroundColor: theme.bgSecondary,
                color: theme.text,
                cursor: 'pointer'
              }}
            >
              <X size={17} />
            </button>
          </div>
        </header>

        {/* Mobile quick zoom & page strip */}
        {isMobile && numPages > 0 && !loadError && (
          <div 
            style={{
              padding: '6px 12px',
              backgroundColor: theme.primaryGlow,
              borderBottom: `1px solid ${theme.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
              fontSize: 11
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button 
                type="button"
                onClick={handleZoomOut}
                style={{ background: 'transparent', border: `1px solid ${theme.border}`, borderRadius: 6, padding: '2px 8px', color: theme.text, fontSize: 11, fontWeight: 700 }}
              >
                -
              </button>
              <span style={{ color: theme.primary, fontWeight: 800 }}>{zoomLevel}%</span>
              <button 
                type="button"
                onClick={handleZoomIn}
                style={{ background: 'transparent', border: `1px solid ${theme.border}`, borderRadius: 6, padding: '2px 8px', color: theme.text, fontSize: 11, fontWeight: 700 }}
              >
                +
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: theme.textDim, fontSize: 11 }}>
                Page {currentPage} / {numPages}
              </span>
              <button
                type="button"
                onClick={() => window.open(fileUrl, '_blank')}
                style={{
                  background: theme.primary,
                  color: '#FFF',
                  border: 'none',
                  padding: '3px 8px',
                  borderRadius: 6,
                  fontSize: 10,
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Plein Écran
              </button>
            </div>
          </div>
        )}

        {/* Document Body Area */}
        <div 
          ref={canvasContainerRef}
          style={{
            flex: 1,
            width: '100%',
            height: '100%',
            backgroundColor: '#0F172A',
            position: 'relative',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: isLoading ? 'center' : 'flex-start',
            padding: isMobile ? '10px 4px 60px' : '20px 16px',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {/* Loading Skeleton */}
          {isLoading && (
            <div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                padding: 30,
                textAlign: 'center'
              }}
            >
              <div 
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 18,
                  backgroundColor: 'rgba(30, 91, 69, 0.2)',
                  border: `1px solid ${theme.primary}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Loader2 size={28} color={theme.primary} className="animate-spin" />
              </div>

              <div>
                <p style={{ color: '#F1F5F9', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
                  Chargement du document haute définition...
                </p>
                <p style={{ color: '#94A3B8', fontSize: 12 }}>
                  Préparation du rendu net et interactif.
                </p>
              </div>
            </div>
          )}

          {/* Primary View: Native Canvas Render via PDF.js */}
          {!isLoading && !loadError && isPdf && (
            <div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                minHeight: '100%'
              }}
            >
              <div 
                style={{
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
                  borderRadius: 8,
                  overflow: 'hidden',
                  backgroundColor: '#FFFFFF',
                  maxWidth: '100%'
                }}
              >
                <canvas ref={singleCanvasRef} style={{ display: 'block' }} />
              </div>

              {/* Bottom Quick Page Turner for Mobile */}
              {numPages > 1 && (
                <div 
                  style={{
                    marginTop: 18,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '8px 16px',
                    borderRadius: 30,
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
                  }}
                >
                  <button
                    type="button"
                    onClick={handlePrevPage}
                    disabled={currentPage <= 1}
                    style={{
                      background: theme.primary,
                      color: '#FFF',
                      border: 'none',
                      borderRadius: 20,
                      padding: '6px 14px',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                      opacity: currentPage <= 1 ? 0.4 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <ChevronLeft size={16} /> Précédent
                  </button>

                  <span style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 800 }}>
                    {currentPage} / {numPages}
                  </span>

                  <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={currentPage >= numPages}
                    style={{
                      background: theme.primary,
                      color: '#FFF',
                      border: 'none',
                      borderRadius: 20,
                      padding: '6px 14px',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: currentPage >= numPages ? 'not-allowed' : 'pointer',
                      opacity: currentPage >= numPages ? 0.4 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    Suivant <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Fallback / Error or Non-PDF Files: Elegant Branded Card */}
          {(!isPdf || (loadError && !isLoading)) && (
            <div 
              style={{
                margin: 'auto',
                maxWidth: 480,
                width: '100%',
                padding: isMobile ? 20 : 32,
                borderRadius: 20,
                backgroundColor: theme.bgElevated,
                border: `1px solid ${theme.border}`,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: 16
              }}
            >
              <div 
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 20,
                  backgroundColor: theme.primaryGlow,
                  border: `1px solid ${theme.primary}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FileText size={34} color={theme.primary} />
              </div>

              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: theme.text, marginBottom: 6 }}>
                  {displayTitle}
                </h3>
                <p style={{ fontSize: 13, color: theme.textMuted, lineHeight: 1.5 }}>
                  {isPdf 
                    ? "Ce cours PDF est disponible pour consultation directe et téléchargement haute qualité." 
                    : `Ce document au format ${activePdfPreview.ext || 'Office'} se télécharge ou s'ouvre dans votre application.`
                  }
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10, width: '100%', flexDirection: 'column' }}>
                <a
                  href={fileUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '12px 20px',
                    borderRadius: 12,
                    backgroundColor: theme.primary,
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: 14,
                    boxShadow: '0 4px 14px rgba(30, 91, 69, 0.35)'
                  }}
                >
                  <Download size={16} color="#FFF" />
                  <span>Télécharger le support complet</span>
                </a>

                <button
                  type="button"
                  onClick={() => window.open(fileUrl, '_blank')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '12px 20px',
                    borderRadius: 12,
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.bgCard,
                    color: theme.text,
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: 'pointer'
                  }}
                >
                  <ExternalLink size={16} color={theme.primary} />
                  <span>Ouvrir dans un nouvel onglet</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
