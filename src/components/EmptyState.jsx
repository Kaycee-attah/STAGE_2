export default function EmptyState({ filtered }) {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <div className="empty-state__illustration" aria-hidden="true">
        <svg width="242" height="200" viewBox="0 0 242 200" fill="none">
          <ellipse cx="121" cy="185" rx="80" ry="15" fill="currentColor" opacity="0.05"/>
          <rect x="61" y="40" width="120" height="140" rx="12" fill="currentColor" opacity="0.08"/>
          <rect x="71" y="55" width="60" height="8" rx="4" fill="currentColor" opacity="0.15"/>
          <rect x="71" y="71" width="100" height="6" rx="3" fill="currentColor" opacity="0.1"/>
          <rect x="71" y="85" width="80" height="6" rx="3" fill="currentColor" opacity="0.1"/>
          <rect x="71" y="110" width="100" height="6" rx="3" fill="currentColor" opacity="0.08"/>
          <rect x="71" y="124" width="60" height="6" rx="3" fill="currentColor" opacity="0.08"/>
          <circle cx="181" cy="50" r="30" fill="currentColor" opacity="0.06"/>
          <path d="M171 50h20M181 40v20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.3"/>
        </svg>
      </div>
      <h2 className="empty-state__title">Nothing here</h2>
      <p className="empty-state__text">
        {filtered
          ? 'No invoices match that filter. Try a different status.'
          : 'Create an invoice by clicking the New Invoice button.'}
      </p>
    </div>
  );
}
