export default function StatusBadge({ status }) {
  return (
    <span className={`status-badge status-badge--${status}`} aria-label={`Status: ${status}`}>
      <span className="status-badge__dot" aria-hidden="true" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
