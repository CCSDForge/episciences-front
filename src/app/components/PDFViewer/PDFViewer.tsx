import { useState, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useTranslation } from 'react-i18next';

import Loader from '../Loader/Loader';
import downloadIcon from '/icons/download-black.svg';
import './PDFViewer.scss';

// Configure PDF.js worker - use CDN for reliability
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface IPDFViewerProps {
  pdfUrl: string;
  showDownloadButton?: boolean;
  prominentDownload?: boolean;
}

export default function PDFViewer({
  pdfUrl,
  showDownloadButton = false,
  prominentDownload = false,
}: IPDFViewerProps): JSX.Element {
  const { t } = useTranslation();

  const [numPages, setNumPages] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Detect if PDF is from Zenodo - use react-pdf for better compatibility
  const isZenodo = useMemo(() => {
    try {
      const { hostname } = new URL(pdfUrl);
      return hostname === 'zenodo.org' || hostname.endsWith('.zenodo.org');
    } catch (error) {
      return false;
    }
  }, [pdfUrl]);

  // Memoize file and options to prevent unnecessary re-renders
  const fileConfig = useMemo(() => ({ url: pdfUrl }), [pdfUrl]);
  const documentOptions = useMemo(
    () => ({
      cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
      cMapPacked: true,
      standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
    }),
    []
  );

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
        <span className="pdfViewer-download-text">
          {t('pages.pdfViewer.download')}
        </span>
      </div>
    );
  };

  // Render error state
  if (error) {
    return (
      <div className="pdfViewer">
        <div className="pdfViewer-error">
          <div className="pdfViewer-error-message">
            {t('pages.pdfViewer.error')}
          </div>
          <div className="pdfViewer-error-info">
            {t('pages.pdfViewer.errorInfo')}
          </div>
          <div
            className="pdfViewer-download pdfViewer-download-prominent"
            onClick={handleDownload}
          >
            <img
              src={downloadIcon}
              className="pdfViewer-download-icon"
              alt=""
            />
            <span className="pdfViewer-download-text">
              {t('pages.pdfViewer.openInNewTab')}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // For Zenodo PDFs, use react-pdf for better compatibility
  // For other PDFs, use simple iframe
  if (isZenodo) {
    return (
      <div className="pdfViewer">
        {prominentDownload && renderDownloadButton()}

        <div className="pdfViewer-pages">
          {!prominentDownload && renderDownloadButton()}
          <Document
            file={fileConfig}
            options={documentOptions}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<Loader />}
            className="pdfViewer-pages-document"
          >
            {Array.from(new Array(numPages), (_, index) => (
              <div
                key={`page_${index + 1}`}
                id={`page-${index + 1}`}
                className="pdfViewer-page-wrapper"
              >
                <Page
                  pageNumber={index + 1}
                  width={800}
                  className="pdfViewer-page"
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  loading={<Loader />}
                />
              </div>
            ))}
          </Document>
        </div>
      </div>
    );
  }

  // For non-Zenodo PDFs, use simple iframe (faster, native browser viewer)
  return (
    <div className="pdfViewer">
      {prominentDownload && renderDownloadButton()}
      <iframe
        title="Document preview"
        loading="lazy"
        src={pdfUrl}
        className="pdfViewer-iframe"
        allow="fullscreen"
      />
    </div>
  );
}
