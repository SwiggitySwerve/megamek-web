import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { AppIcon } from '@/components/ui/AppIcon';
import { CustomizerTabId } from '@/hooks/useCustomizerRouter';
import { UnitValidationState } from '@/hooks/useUnitValidation';
import {
  IUnitValidationError,
  UnitValidationSeverity,
} from '@/types/validation/UnitValidationInterfaces';
import {
  getTabForCategory,
  getTabLabel,
} from '@/utils/validation/validationNavigation';

import {
  ValidationIssueIcon,
  validationIconColors,
  type ValidationIconSeverity,
} from './ValidationIssueIcon';

interface ValidationSummaryProps {
  validation: UnitValidationState;
  onNavigate?: (tabId: CustomizerTabId) => void;
  onIssueNavigate?: (issue: IUnitValidationError) => void;
  maxItems?: number;
  className?: string;
  unitName?: string;
  section?: CustomizerTabId;
}

interface ValidationIssue {
  error: IUnitValidationError;
  severity: ValidationIconSeverity;
  critical?: boolean;
}

function flattenErrors(
  result: UnitValidationState['result'],
): ValidationIssue[] {
  return (result?.results ?? [])
    .flatMap<ValidationIssue>((result) => [
      ...result.errors.map((error) => ({
        error,
        severity: 'error' as const,
        critical: error.severity === UnitValidationSeverity.CRITICAL_ERROR,
      })),
      ...result.warnings.map((error) => ({
        error,
        severity: 'warning' as const,
      })),
      ...result.infos.map((error) => ({ error, severity: 'info' as const })),
    ])
    .sort((a, b) => Number(Boolean(b.critical)) - Number(Boolean(a.critical)));
}

export function ValidationSummary({
  validation,
  onNavigate,
  onIssueNavigate,
  maxItems = 5,
  className = '',
  unitName = 'Unit',
  section,
}: ValidationSummaryProps): React.ReactElement | null {
  const [open, setOpen] = useState<ValidationIconSeverity | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0, maxHeight: 400 });
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const id = useId();
  const all = useMemo(
    () =>
      flattenErrors(validation.result).filter(
        (item) =>
          !section || getTabForCategory(item.error.category) === section,
      ),
    [validation.result, section],
  );
  const counts = section
    ? {
        error: all.filter((item) => item.severity === 'error').length,
        warning: all.filter((item) => item.severity === 'warning').length,
        info: all.filter((item) => item.severity === 'info').length,
      }
    : {
        error: validation.errorCount,
        warning: validation.warningCount,
        info: validation.infoCount,
      };
  const issues = all.filter((item) => item.severity === open);
  const shown = showAll ? issues : issues.slice(0, maxItems);

  useEffect(() => {
    if (!open) return;
    const updatePosition = (): void => {
      if (!trigger.current) return;
      const box = trigger.current.getBoundingClientRect();
      const top = Math.max(
        8,
        Math.min(box.bottom + 4, window.innerHeight - 180),
      );
      setPosition({
        left: Math.max(8, Math.min(box.left, window.innerWidth - 344)),
        top,
        maxHeight: window.innerHeight - top - 8,
      });
    };
    updatePosition();
    panel.current
      ?.querySelector<HTMLButtonElement>('[data-validation-issue]')
      ?.focus({ preventScroll: true });
    const outside = (event: PointerEvent): void => {
      const target = event.target as Node;
      if (!root.current?.contains(target) && !panel.current?.contains(target))
        setOpen(null);
    };
    const escape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(null);
        trigger.current?.focus({ preventScroll: true });
      }
    };
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);

  const hasIssues = counts.error + counts.warning + counts.info > 0;
  if (!hasIssues) {
    if (section) return null;
    return (
      <span
        className={`inline-flex min-h-11 items-center gap-1 px-2 text-xs ${validation.isLoading || validation.isValidating ? 'text-text-theme-secondary' : 'text-green-400'} ${className}`}
        role="status"
      >
        {validation.isLoading || validation.isValidating ? (
          'Checking…'
        ) : validation.isValid ? (
          <>
            <AppIcon name="check" size="inline" aria-hidden="true" /> Valid
          </>
        ) : (
          'Validation pending'
        )}
      </span>
    );
  }

  return (
    <div
      ref={root}
      className={`flex shrink-0 items-center gap-1 ${className}`}
      aria-label={
        section ? `${getTabLabel(section)} validation` : 'Unit validation'
      }
      aria-busy={validation.isValidating}
    >
      {(['error', 'warning', 'info'] as const).map(
        (severity) =>
          counts[severity] > 0 && (
            <button
              key={severity}
              type="button"
              aria-label={`${unitName}: ${counts[severity]} ${severity}${counts[severity] === 1 ? '' : 's'}${section ? ` in ${getTabLabel(section)}` : ''}, show issues`}
              aria-expanded={open === severity}
              aria-haspopup="dialog"
              aria-controls={open === severity ? id : undefined}
              onClick={(event) => {
                trigger.current = event.currentTarget;
                setShowAll(false);
                setOpen(open === severity ? null : severity);
              }}
              className={`focus-visible:outline-accent hover:bg-surface-raised flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-1 rounded px-1.5 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-[-2px] ${validationIconColors[severity]} ${section ? '' : 'border-border-theme bg-surface-base border'}`}
            >
              <ValidationIssueIcon severity={severity} />
              {counts[severity] > 99 ? '99+' : counts[severity]}
              {!section && (
                <span aria-hidden="true" className="text-[9px]">
                  <AppIcon
                    name="chevron-down"
                    size="inline"
                    aria-hidden="true"
                  />
                </span>
              )}
            </button>
          ),
      )}
      {open &&
        createPortal(
          <div
            ref={panel}
            id={id}
            role="dialog"
            aria-labelledby={`${id}-title`}
            className="bg-surface-base border-border-theme text-text-theme-primary fixed z-[70] flex w-[336px] max-w-[calc(100vw-1rem)] flex-col overflow-hidden rounded-lg border shadow-xl"
            style={{
              left: position.left,
              top: position.top,
              maxHeight: position.maxHeight,
            }}
          >
            <div className="border-border-theme flex min-h-11 shrink-0 items-center justify-between gap-2 border-b pl-3">
              <h3 id={`${id}-title`} className="min-w-0 text-xs font-semibold">
                {unitName} ·{' '}
                {open === 'error'
                  ? 'Errors'
                  : open === 'warning'
                    ? 'Warnings'
                    : 'Information'}
                {section ? ` · ${getTabLabel(section)}` : ''}
              </h3>
              <button
                type="button"
                aria-label="Close validation issues"
                onClick={() => {
                  setOpen(null);
                  trigger.current?.focus();
                }}
                className="focus-visible:outline-accent hover:bg-surface-raised min-h-11 min-w-11 rounded text-lg focus-visible:outline-2"
              >
                {' '}
                <AppIcon name="close" size="inline" aria-hidden="true" />
              </button>
            </div>
            <div className="min-h-0 overflow-y-auto">
              {shown.map((item, index) => (
                <button
                  key={`${item.error.ruleId}-${item.error.field ?? ''}-${index}`}
                  type="button"
                  data-validation-issue
                  onClick={() => {
                    if (!onNavigate && !onIssueNavigate) return;
                    setOpen(null);
                    if (onIssueNavigate) onIssueNavigate(item.error);
                    else onNavigate?.(getTabForCategory(item.error.category));
                  }}
                  className="border-border-theme hover:bg-surface-raised focus-visible:outline-accent flex min-h-11 w-full items-start gap-2 border-b p-3 text-left last:border-b-0 focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
                >
                  <span
                    className={`pt-0.5 ${validationIconColors[item.severity]}`}
                  >
                    <ValidationIssueIcon severity={item.severity} />
                  </span>
                  <span className="min-w-0">
                    <span
                      className={`block text-xs font-medium ${validationIconColors[item.severity]}`}
                    >
                      {item.error.message}
                    </span>
                    {item.error.suggestion && (
                      <span className="text-text-theme-secondary mt-1 block text-xs">
                        {item.error.suggestion}
                      </span>
                    )}
                    <span className="text-text-theme-secondary mt-2 block text-xs">
                      {item.critical ? 'Critical error' : item.error.severity} •
                      Go to{' '}
                      {getTabLabel(getTabForCategory(item.error.category))}{' '}
                      <AppIcon
                        name="arrow-right"
                        size="inline"
                        aria-hidden="true"
                      />
                    </span>
                  </span>
                </button>
              ))}
              {shown.length === 0 && (
                <p className="text-text-theme-secondary p-3 text-xs">
                  No remaining issues in this group.
                </p>
              )}
              {!showAll && issues.length > shown.length && (
                <button
                  type="button"
                  onClick={() => setShowAll(true)}
                  className="text-text-theme-primary hover:bg-surface-raised min-h-11 w-full px-3 text-left text-xs"
                >
                  +{issues.length - shown.length} more issues · Show all
                </button>
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
