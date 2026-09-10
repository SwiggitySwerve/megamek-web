/**
 * Modal Overlay Component
 *
 * Reusable modal overlay with backdrop and centering.
 *
 * @spec openspec/specs/confirmation-dialogs/spec.md
 */

import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalOverlayProps {
  fullScreen?: boolean;
  /** Whether modal is open */
  isOpen: boolean;
  /** Called when overlay is clicked or escape is pressed */
  onClose: () => void;
  /** Prevent closing (e.g., during operation) */
  preventClose?: boolean;
  /** Modal content */
  children: React.ReactNode;
  /** Additional CSS classes for the modal container */
  className?: string;
  /** ID of the element that names the dialog */
  ariaLabelledBy?: string;
  /** ID of the element that describes the dialog */
  ariaDescribedBy?: string;
}

/**
 * Modal overlay with focus trapping
 */
function CenteredModalOverlay({
  isOpen,
  onClose,
  preventClose = false,
  children,
  className = '',
  ariaLabelledBy,
  ariaDescribedBy,
}: ModalOverlayProps): React.ReactElement | null {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !preventClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, preventClose]);

  // Focus trap
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      };

      document.addEventListener('keydown', handleTabKey);
      firstElement?.focus();

      return () => {
        document.removeEventListener('keydown', handleTabKey);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !preventClose) {
      onClose();
    }
  };

  return (
    <div
      className="bg-surface-deep/80 fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className={`bg-surface-base border-border-theme max-h-[90vh] w-full overflow-auto rounded-lg border shadow-xl ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
      >
        {children}
      </div>
    </div>
  );
}

function FullScreenModal({
  onClose,
  preventClose = false,
  children,
  className = '',
  ariaLabelledBy,
  ariaDescribedBy,
}: ModalOverlayProps): React.ReactElement | null {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const opener = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (
        opener instanceof HTMLElement &&
        opener.isConnected &&
        opener.getClientRects().length > 0
      ) {
        opener.focus({ preventScroll: true });
      }
    };
  }, []);

  if (typeof document === 'undefined') return null;
  return createPortal(
    <dialog
      ref={dialogRef}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      aria-modal="true"
      className={`bg-surface-deep fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden border-0 p-0 text-inherit ${className}`}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const focusable = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]',
          ),
        ).filter(
          (element) =>
            element.tabIndex >= 0 &&
            !element.matches(':disabled') &&
            element.getClientRects().length > 0 &&
            getComputedStyle(element).visibility === 'visible',
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first) {
          event.preventDefault();
          return;
        }
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }}
      onCancel={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!preventClose) onClose();
      }}
    >
      {children}
    </dialog>,
    document.body,
  );
}

export function ModalOverlay(
  props: ModalOverlayProps,
): React.ReactElement | null {
  if (props.fullScreen) {
    return props.isOpen ? <FullScreenModal {...props} /> : null;
  }
  return <CenteredModalOverlay {...props} />;
}
