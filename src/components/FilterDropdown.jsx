import { useState, useRef, useEffect } from 'react';

const STATUSES = ['draft', 'pending', 'paid'];

export default function FilterDropdown({ selected, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (status) => {
    const next = selected.includes(status)
      ? selected.filter(s => s !== status)
      : [...selected, status];
    onChange(next);
  };

  return (
    <div className="filter" ref={ref}>
      <button
        className="filter__btn"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Filter invoices by status"
      >
        <span>Filter{selected.length ? ` (${selected.length})` : ''}</span>
        <svg className={`filter__chevron${open ? ' filter__chevron--open' : ''}`} width="11" height="7" viewBox="0 0 11 7" fill="none" aria-hidden="true">
          <path d="M1 1l4.5 4.5L10 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {open && (
        <ul className="filter__dropdown" role="listbox" aria-multiselectable="true" aria-label="Filter by status">
          {STATUSES.map(status => (
            <li key={status} role="option" aria-selected={selected.includes(status)}>
              <label className="filter__option">
                <input
                  type="checkbox"
                  checked={selected.includes(status)}
                  onChange={() => toggle(status)}
                  aria-label={`Filter by ${status}`}
                />
                <span className="filter__checkbox" aria-hidden="true">
                  {selected.includes(status) && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                      <path d="M1 3.5l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                <span className="filter__label">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
