/**
 * Live BattleMech record-sheet canvas.
 *
 * @spec openspec/specs/record-sheet-export/spec.md
 */

import React, {
  useRef,
  useEffect,
  useCallback,
  useState,
  useMemo,
} from 'react';

import type { IUnitConfig } from '@/services/printing/recordsheet/types';

import { useEquipmentRegistry } from '@/hooks/useEquipmentRegistry';
import { usePreviewValidation } from '@/hooks/useUnitValidation';
import { useUnitStore } from '@/stores/useUnitStore';
import { PaperSize, PAPER_DIMENSIONS } from '@/types/printing';

import { useMechStructureFields } from '../tabs/useMechStructureFields';
import { renderUnitRecordSheetPreview } from './RecordSheetCanvasPreview';
import {
  buildBattleMechPreviewProjection,
  type PreviewUnitState,
} from './recordSheetPreview.logic';
import { RecordSheetPreviewValidationBanner } from './RecordSheetPreviewValidationBanner';
import { RecordSheetPreviewZoomControls } from './RecordSheetPreviewZoomControls';

interface RecordSheetPreviewProps {
  paperSize?: PaperSize;
  scale?: number;
  className?: string;
  /** Prebuilt projection shared with PDF and print actions. */
  unitConfig?: IUnitConfig;
}

export function RecordSheetPreview({
  paperSize = PaperSize.LETTER,
  scale: initialScale = 0.8,
  className = '',
  unitConfig,
}: RecordSheetPreviewProps): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(initialScale);
  const { isReady: equipmentRegistryReady } = useEquipmentRegistry();

  const fitToWidth = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth - 48;
      const { width } = PAPER_DIMENSIONS[paperSize];
      setZoom(Math.min(containerWidth / width, 3.0));
    }
  }, [paperSize]);

  const fitToPage = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { width, height } = PAPER_DIMENSIONS[paperSize];
    const availableWidth = container.clientWidth - 48;
    const availableHeight = container.clientHeight - 48;
    if (availableWidth <= 0 || availableHeight <= 0) return;

    setZoom(Math.min(availableWidth / width, availableHeight / height, 3.0));
  }, [paperSize]);

  useEffect(() => {
    fitToPage();
  }, [fitToPage]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(fitToPage);
    observer.observe(container);
    return () => observer.disconnect();
  }, [fitToPage]);

  const zoomIn = useCallback(() => {
    setZoom((value) => Math.min(value + 0.15, 3.0));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((value) => Math.max(value - 0.15, 0.2));
  }, []);

  const name = useUnitStore((s) => s.name);
  const chassis = useUnitStore((s) => s.chassis);
  const model = useUnitStore((s) => s.model);
  const tonnage = useUnitStore((s) => s.tonnage);
  const techBase = useUnitStore((s) => s.techBase);
  const rulesLevel = useUnitStore((s) => s.rulesLevel);
  const year = useUnitStore((s) => s.year);
  const role = useUnitStore((s) => s.role);
  const configuration = useUnitStore((s) => s.configuration);
  const {
    engineType,
    engineRating,
    gyroType,
    internalStructureType,
    cockpitType,
  } = useMechStructureFields();
  const armorType = useUnitStore((s) => s.armorType);
  const armorAllocation = useUnitStore((s) => s.armorAllocation);
  const heatSinkType = useUnitStore((s) => s.heatSinkType);
  const heatSinkCount = useUnitStore((s) => s.heatSinkCount);
  const enhancement = useUnitStore((s) => s.enhancement);
  const jumpMP = useUnitStore((s) => s.jumpMP);
  const equipment = useUnitStore((s) => s.equipment);

  const previewState = useMemo<PreviewUnitState>(
    () => ({
      name,
      chassis,
      model,
      tonnage,
      techBase,
      rulesLevel,
      year,
      role,
      configuration,
      engineType,
      engineRating,
      gyroType,
      internalStructureType,
      cockpitType,
      armorType,
      armorAllocation,
      heatSinkType,
      heatSinkCount,
      enhancement,
      jumpMP,
      equipment,
    }),
    [
      name,
      chassis,
      model,
      tonnage,
      techBase,
      rulesLevel,
      year,
      role,
      configuration,
      engineType,
      engineRating,
      gyroType,
      internalStructureType,
      cockpitType,
      armorType,
      armorAllocation,
      heatSinkType,
      heatSinkCount,
      enhancement,
      jumpMP,
      equipment,
    ],
  );

  const resolvedUnitConfig = useMemo(
    () =>
      unitConfig ??
      buildBattleMechPreviewProjection(previewState, equipmentRegistryReady)
        .unitConfig,
    [unitConfig, previewState, equipmentRegistryReady],
  );

  const validation = usePreviewValidation();

  const renderPreview = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    await renderUnitRecordSheetPreview({
      canvas,
      unitObject: resolvedUnitConfig,
      paperSize,
      errorMessage: 'Error rendering BattleMech record sheet preview:',
    });
  }, [resolvedUnitConfig, paperSize]);

  useEffect(() => {
    void renderPreview();
  }, [renderPreview]);

  const { width, height } = PAPER_DIMENSIONS[paperSize];
  const displayWidth = width * zoom;
  const displayHeight = height * zoom;

  return (
    <div
      className={`record-sheet-preview ${className}`}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
      }}
    >
      <RecordSheetPreviewValidationBanner
        issues={validation.issues}
        errorCount={validation.errorCount}
        warningCount={validation.warningCount}
      />

      <div
        ref={containerRef}
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          overflow: 'auto',
          padding: '24px',
          backgroundColor: 'var(--surface-deep)',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            flexShrink: 0,
            margin: 'auto',
            width: displayWidth,
            height: displayHeight,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
            backgroundColor: '#fff',
          }}
        />
      </div>

      <RecordSheetPreviewZoomControls
        zoom={zoom}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onFitToWidth={fitToWidth}
        onFitToPage={fitToPage}
      />
    </div>
  );
}

export function useRecordSheetCanvas(): React.RefObject<HTMLCanvasElement | null> {
  return useRef<HTMLCanvasElement | null>(null);
}
