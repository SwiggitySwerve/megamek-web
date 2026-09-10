/**
 * Preview Toolbar Component
 *
 * Toolbar with Download PDF and Print buttons for the record sheet preview.
 *
 * @spec openspec/specs/record-sheet-export/spec.md
 */

import React, { useCallback, useState } from 'react';

import { AppIcon } from '@/components/ui/AppIcon';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { PaperSize } from '@/types/printing';
import { logger } from '@/utils/logger';

// =============================================================================
// Types
// =============================================================================

interface PreviewToolbarProps {
  /** Callback to export PDF */
  onExportPDF: () => Promise<void>;
  /** Callback to print */
  onPrint: () => void;
  /** Current paper size */
  paperSize: PaperSize;
  /** Callback to change paper size */
  onPaperSizeChange: (size: PaperSize) => void;
  /** CSS class name */
  className?: string;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Preview Toolbar Component
 *
 * Provides export and print controls for the record sheet.
 */
export function PreviewToolbar({
  onExportPDF,
  onPrint,
  paperSize,
  onPaperSizeChange,
  className = '',
}: PreviewToolbarProps): React.ReactElement {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = useCallback(async () => {
    setIsExporting(true);
    try {
      await onExportPDF();
    } catch (error) {
      logger.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  }, [onExportPDF]);

  const handlePrint = useCallback(() => {
    try {
      onPrint();
    } catch (error) {
      logger.error('Error printing:', error);
      alert(
        'Failed to open print dialog. Please check popup blocker settings.',
      );
    }
  }, [onPrint]);

  return (
    <div
      className={`preview-toolbar ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px',
        padding: '12px 16px',
        backgroundColor: 'var(--surface-base)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      {/* Paper Size Select */}
      <div
        className="w-full shrink-0 sm:w-auto"
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <label
          htmlFor="paper-size"
          style={{
            color: 'var(--text-secondary)',
            fontSize: '13px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
          }}
        >
          Paper Size:
        </label>
        <select
          id="paper-size"
          value={paperSize}
          onChange={(e) => onPaperSizeChange(e.target.value as PaperSize)}
          style={{
            padding: '6px 12px',
            borderRadius: '4px',
            border: '1px solid var(--border-default)',
            backgroundColor: 'var(--surface-raised)',
            color: 'var(--text-primary)',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          <option value={PaperSize.LETTER}>
            Letter (8.5&quot; × 11&quot;)
          </option>
          <option value={PaperSize.A4}>A4 (210mm × 297mm)</option>
        </select>
      </div>

      {/* Spacer */}
      <div className="hidden sm:block" style={{ flex: 1 }} />

      {/* Print Button */}
      <button
        onClick={handlePrint}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 16px',
          minHeight: 44,
          whiteSpace: 'nowrap',
          borderRadius: '6px',
          border: '1px solid var(--border-default)',
          backgroundColor: 'var(--surface-raised)',
          color: 'var(--text-primary)',
          fontSize: '13px',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--surface-base)';
          e.currentTarget.style.borderColor = 'var(--border-strong)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--surface-raised)';
          e.currentTarget.style.borderColor = 'var(--border-default)';
        }}
      >
        <PrintIcon />
        Print
      </button>

      {/* Download PDF Button */}
      <button
        onClick={handleExportPDF}
        disabled={isExporting}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 16px',
          minHeight: 44,
          whiteSpace: 'nowrap',
          borderRadius: '6px',
          border: 'none',
          backgroundColor: isExporting
            ? 'var(--surface-raised)'
            : 'var(--accent-primary)',
          color: 'var(--text-primary)',
          fontSize: '13px',
          fontWeight: 500,
          cursor: isExporting ? 'not-allowed' : 'pointer',
          transition: 'all 0.15s ease',
          opacity: isExporting ? 0.7 : 1,
        }}
        onMouseEnter={(e) => {
          if (!isExporting) {
            e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isExporting) {
            e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
          }
        }}
      >
        <DownloadIcon />
        {isExporting ? 'Exporting...' : 'Download PDF'}
      </button>
    </div>
  );
}

// =============================================================================
// Icons
// =============================================================================

function PrintIcon(): React.ReactElement {
  return (
    <SvgIcon size="inline" aria-hidden="true">
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </SvgIcon>
  );
}

function DownloadIcon(): React.ReactElement {
  return <AppIcon name="download" size="inline" aria-hidden="true" />;
}
