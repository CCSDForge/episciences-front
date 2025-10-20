import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useTranslation } from 'react-i18next';

import caretLeft from '/icons/caret-left-grey.svg';
import caretRight from '/icons/caret-right-grey.svg';
import downloadIcon from '/icons/download-black.svg';
import './PDFViewer.scss';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface IPDFViewerProps {
  pdfUrl: string;
  showDownloadButton?: boolean;
  prominentDownload?: boolean;
}

export default function PDFViewer({ pdfUrl, showDownloadButton = false, prominentDownload = false }: IPDFViewerProps): JSX.Element {
  const { t } = useTranslation();

  const [useIframe, setUseIframe] = useState(true);
  const [iframeError, setIframeError] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle iframe load error
  const handleIframeError = (): void => {
    console.warn('Iframe failed to load PDF, switching to react-pdf');
    setIframeError(true);
    setUseIframe(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Handle iframe load success
  const handleIframeLoad = (): void => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Set timeout for iframe loading
  useEffect(() => {
    if (useIframe && !iframeError) {
      timeoutRef.current = setTimeout(() => {
        console.warn('Iframe loading timeout, switching to react-pdf');
        setUseIframe(false);
      }, 8000); // 8 second timeout for all repositories

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [useIframe, iframeError, pdfUrl]);

  // Handle PDF document load success
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
    setNumPages(numPages);
    setError(null);
  };

  // Handle PDF document load error
  const onDocumentLoadError = (error: Error): void => {
    console.error('Error loading PDF:', error);
    setError('pdfError');
  };

  // Handle page change
  const goToPreviousPage = (): void => {
    setPageNumber((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = (): void => {
    setPageNumber((prev) => Math.min(numPages || 1, prev + 1));
  };

  // Handle download
  const handleDownload = (): void => {
    window.open(pdfUrl, '_blank');
  };

  // Render download button
  const renderDownloadButton = (): JSX.Element | null => {
    if (!showDownloadButton) return null;

    return (
      <div
        className={`pdfViewer-download ${prominentDownload ? 'pdfViewer-download-prominent' : ''}`}
        onClick={handleDownload}
      >
        <img src={downloadIcon} className="pdfViewer-download-icon" alt="" />
        <span className="pdfViewer-download-text">{t('pages.pdfViewer.download')}</span>
      </div>
    );
  };

  // Render navigation controls
  const renderControls = (): JSX.Element | null => {
    if (useIframe || !numPages || numPages <= 1) return null;

    return (
      <div className="pdfViewer-controls">
        <div
          className={`pdfViewer-controls-button ${pageNumber === 1 ? 'pdfViewer-controls-button-disabled' : ''}`}
          onClick={goToPreviousPage}
        >
          <img src={caretLeft} className="pdfViewer-controls-button-icon" alt="" />
          <span className="pdfViewer-controls-button-text">{t('pages.pdfViewer.previous')}</span>
        </div>

        <div className="pdfViewer-controls-pageInfo">
          {t('pages.pdfViewer.page')} {pageNumber} {t('pages.pdfViewer.of')} {numPages}
        </div>

        <div
          className={`pdfViewer-controls-button ${pageNumber === numPages ? 'pdfViewer-controls-button-disabled' : ''}`}
          onClick={goToNextPage}
        >
          <span className="pdfViewer-controls-button-text">{t('pages.pdfViewer.next')}</span>
          <img src={caretRight} className="pdfViewer-controls-button-icon" alt="" />
        </div>
      </div>
    );
  };

  // Render error state
  if (error) {
    return (
      <div className="pdfViewer">
        <div className="pdfViewer-error">
          <div className="pdfViewer-error-message">{t('pages.pdfViewer.error')}</div>
          <div className="pdfViewer-error-info">{t('pages.pdfViewer.errorInfo')}</div>
          <div className="pdfViewer-download pdfViewer-download-prominent" onClick={handleDownload}>
            <img src={downloadIcon} className="pdfViewer-download-icon" alt="" />
            <span className="pdfViewer-download-text">{t('pages.pdfViewer.openInNewTab')}</span>
          </div>
        </div>
      </div>
    );
  }

  // Render iframe or react-pdf based on state
  return (
    <div className="pdfViewer">
      {prominentDownload && renderDownloadButton()}

      {useIframe ? (
        <iframe
          ref={iframeRef}
          title="Document preview"
          loading="lazy"
          src={pdfUrl}
          className="pdfViewer-iframe"
          onError={handleIframeError}
          onLoad={handleIframeLoad}
          allow="fullscreen"
        />
      ) : (
        <div className="pdfViewer-reactPdf">
          {!prominentDownload && renderDownloadButton()}
          {renderControls()}
          <Document
            file={{ url: pdfUrl }}
            options={{
              cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
              cMapPacked: true,
              standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
            }}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<div className="pdfViewer-loading">{t('pages.pdfViewer.loading')}</div>}
            className="pdfViewer-reactPdf-document"
          >
            <Page
              pageNumber={pageNumber}
              className="pdfViewer-reactPdf-page"
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          </Document>
        </div>
      )}
    </div>
  );
}
