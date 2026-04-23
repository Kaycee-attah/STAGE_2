import { useEffect, useRef } from 'react';

export default function DeleteModal({ invoiceId, onConfirm, onCancel }) {
  const modalRef    = useRef();
  const cancelBtnRef = useRef();

  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, []);

  useEffect(() => {
    // Focus Cancel button immediately when modal opens
    cancelBtnRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      // ESC closes the modal
      if (e.key === 'Escape') {
        onCancel();
        return;
      }

      // Tab key traps focus inside the two buttons
      if (e.key === 'Tab' && modalRef.current) {
        const buttons = Array.from(modalRef.current.querySelectorAll('button'));
        if (!buttons.length) return;
        const first = buttons[0];
        const last  = buttons[buttons.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onCancel]);

  // Clicking outside the modal box also closes it
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onCancel();
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={handleBackdropClick}
    >
      <div className="modal" ref={modalRef}>
        <h2 id="modal-title" className="modal__title">Confirm Deletion</h2>
        <p className="modal__text">
          Are you sure you want to delete invoice <strong>#{invoiceId}</strong>?
          This action cannot be undone.
        </p>
        <div className="modal__actions">
          <button
            ref={cancelBtnRef}
            className="btn btn--secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="btn btn--danger"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
