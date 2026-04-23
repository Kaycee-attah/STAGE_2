import { useState, useCallback } from 'react';
import { useInvoices } from '../context/InvoiceContext';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import DeleteModal from '../components/DeleteModal';
import InvoiceForm from '../components/InvoiceForm';
import { formatDate, formatCurrency } from '../utils/helpers';

export default function InvoiceDetailPage({ invoiceId, onBack }) {
  const { invoices, deleteInvoice, markPaid } = useInvoices();
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit,   setShowEdit]   = useState(false);

  // ALL hooks above early return — React rules of hooks
  const handleCancelDelete = useCallback(() => setShowDelete(false), []);

  const handleDelete = useCallback(() => {
    deleteInvoice(invoiceId);
    setShowDelete(false);
    onBack();
  }, [deleteInvoice, invoiceId, onBack]);

  const invoice = invoices.find(inv => inv.id === invoiceId);
  if (!invoice) return null;

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content" id="main-content">
        <div className="detail-page">

          {/* Back button */}
          <button
            className="back-btn"
            onClick={onBack}
            aria-label="Go back to invoice list"
          >
            <svg width="7" height="10" viewBox="0 0 7 10" fill="none" aria-hidden="true">
              <path d="M6 1L2 5l4 4"
                stroke="#7C5DFA" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Go back
          </button>

          {/* Status bar — desktop only actions */}
          <div className="detail-status-bar">
            <span className="detail-status-bar__label">Status</span>
            <StatusBadge status={invoice.status} />
            <div className="detail-status-bar__actions">
              {invoice.status !== 'paid' && (
                <button
                  className="btn btn--secondary"
                  onClick={() => setShowEdit(true)}
                  aria-label="Edit this invoice"
                >
                  Edit
                </button>
              )}
              <button
                className="btn btn--danger"
                onClick={() => setShowDelete(true)}
                aria-label="Delete this invoice"
              >
                Delete
              </button>
              {invoice.status === 'pending' && (
                <button
                  className="btn btn--primary"
                  onClick={() => markPaid(invoiceId)}
                  aria-label="Mark invoice as paid"
                >
                  Mark as Paid
                </button>
              )}
            </div>
          </div>

          {/* Invoice detail card */}
          <article
            className="detail-card"
            aria-label={`Invoice ${invoice.id} details`}
          >
            {/* Top: ID + sender address */}
            <div className="detail-card__top">
              <div>
                <p className="detail-id">
                  <span aria-hidden="true">#</span>{invoice.id}
                </p>
                <p className="detail-desc">{invoice.description}</p>
              </div>
              <address className="detail-address" aria-label="Sender address">
                <span>{invoice.senderAddress.street}</span>
                <span>{invoice.senderAddress.city}</span>
                <span>{invoice.senderAddress.postCode}</span>
                <span>{invoice.senderAddress.country}</span>
              </address>
            </div>

            {/* Meta: dates, client, email */}
            <div className="detail-card__meta">
              <div className="detail-meta-group">
                <div>
                  <p className="detail-label">Invoice Date</p>
                  <p className="detail-value">{formatDate(invoice.createdAt)}</p>
                </div>
                <div>
                  <p className="detail-label">Payment Due</p>
                  <p className="detail-value">{formatDate(invoice.paymentDue)}</p>
                </div>
              </div>
              <div>
                <p className="detail-label">Bill To</p>
                <p className="detail-value">{invoice.clientName}</p>
                <address className="detail-address" aria-label="Client address">
                  <span>{invoice.clientAddress.street}</span>
                  <span>{invoice.clientAddress.city}</span>
                  <span>{invoice.clientAddress.postCode}</span>
                  <span>{invoice.clientAddress.country}</span>
                </address>
              </div>
              <div>
                <p className="detail-label">Sent To</p>
                <p className="detail-value">{invoice.clientEmail}</p>
              </div>
            </div>

            {/* Items table */}
            <div className="detail-items">
              <table className="items-list" aria-label="Invoice items">
                <thead>
                  <tr>
                    <th scope="col" style={{ textAlign: 'left' }}>Item Name</th>
                    <th scope="col" style={{ textAlign: 'center' }}>QTY.</th>
                    <th scope="col" style={{ textAlign: 'right' }}>Price</th>
                    <th scope="col" style={{ textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, i) => (
                    <tr key={i}>
                      <td className="items-list__name">{item.name}</td>
                      <td className="items-list__qty"  style={{ textAlign: 'center' }}>{item.quantity}</td>
                      <td className="items-list__price"style={{ textAlign: 'right' }}>{formatCurrency(item.price)}</td>
                      <td className="items-list__total"style={{ textAlign: 'right' }}>
                        {formatCurrency(Number(item.quantity) * Number(item.price))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div
                className="detail-total"
                aria-label={`Amount due: ${formatCurrency(invoice.total)}`}
              >
                <span>Amount Due</span>
                <span className="detail-total__amount">{formatCurrency(invoice.total)}</span>
              </div>
            </div>
          </article>

          {/* Mobile action bar — shown only on small screens via CSS */}
          <div className="mobile-actions" role="group" aria-label="Invoice actions">
            {invoice.status !== 'paid' && (
              <button className="btn btn--secondary" onClick={() => setShowEdit(true)}>
                Edit
              </button>
            )}
            <button className="btn btn--danger" onClick={() => setShowDelete(true)}>
              Delete
            </button>
            {invoice.status === 'pending' && (
              <button className="btn btn--primary" onClick={() => markPaid(invoiceId)}>
                Mark as Paid
              </button>
            )}
          </div>

        </div>
      </main>

      {showDelete && (
        <DeleteModal
          invoiceId={invoiceId}
          onConfirm={handleDelete}
          onCancel={handleCancelDelete}
        />
      )}
      {showEdit && (
        <InvoiceForm
          invoice={invoice}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  );
}
