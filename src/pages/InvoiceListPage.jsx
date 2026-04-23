import { useState } from 'react';
import { useInvoices } from '../context/InvoiceContext';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import FilterDropdown from '../components/FilterDropdown';
import InvoiceForm from '../components/InvoiceForm';
import EmptyState from '../components/EmptyState';
import { formatDate, formatCurrency } from '../utils/helpers';

export default function InvoiceListPage({ onSelect }) {
  const { invoices } = useInvoices();
  const [filters, setFilters] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const filtered = filters.length
    ? invoices.filter(inv => filters.includes(inv.status))
    : invoices;

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content" id="main-content">
        <div className="list-page">

          {/* Header */}
          <div className="list-page__header">
            <div>
              <h1 className="list-page__title">Invoices</h1>
              <p className="list-page__count" aria-live="polite">
                <span className="hide-mobile">There are </span>
                {filtered.length} {filtered.length === 1 ? 'invoice' : 'invoices'}
                <span className="hide-mobile"> total</span>
              </p>
            </div>
            <div className="list-page__actions">
              <FilterDropdown selected={filters} onChange={setFilters} />
              <button
                className="btn btn--primary btn--new"
                onClick={() => setShowForm(true)}
                aria-label="Create new invoice"
              >
                <span className="btn__icon" aria-hidden="true">
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M6.313 1.5v8M2.313 5.5h8"
                      stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </span>
                <span>New <span className="hide-mobile">Invoice</span></span>
              </button>
            </div>
          </div>

          {/* Invoice list or empty state */}
          {filtered.length === 0 ? (
            <EmptyState filtered={filters.length > 0} />
          ) : (
            <ul className="invoice-list" aria-label="Invoice list">
              {filtered.map(inv => (
                <li key={inv.id}>
                  <button
                    className="invoice-card"
                    onClick={() => onSelect(inv.id)}
                    aria-label={`Invoice ${inv.id}, ${inv.clientName}, due ${formatDate(inv.paymentDue)}, status: ${inv.status}`}
                  >
                    <span className="invoice-card__id">
                      <span aria-hidden="true">#</span>{inv.id}
                    </span>
                    <span className="invoice-card__date">Due {formatDate(inv.paymentDue)}</span>
                    <span className="invoice-card__client">{inv.clientName}</span>
                    <span className="invoice-card__amount">{formatCurrency(inv.total)}</span>
                    <StatusBadge status={inv.status} />
                    <span className="invoice-card__arrow" aria-hidden="true">
                      <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
                        <path d="M1 1l4 4-4 4"
                          stroke="#7C5DFA" strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

        </div>
      </main>

      {showForm && <InvoiceForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
