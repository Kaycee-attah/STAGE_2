import { useState, useEffect } from 'react';
import { useInvoices } from '../context/InvoiceContext';

const EMPTY_ITEM = { name: '', quantity: 1, price: 0 };
const TERMS = [1, 7, 14, 30];

// Generate a simple unique ID for item keys — avoids React key/state bugs
// when items are removed from the middle of the list
let _itemId = 0;
const newItemId = () => `item-${++_itemId}-${Date.now()}`;

function emptyForm() {
  return {
    description: '', clientName: '', clientEmail: '', paymentTerms: 30,
    senderAddress: { street: '', city: '', postCode: '', country: '' },
    clientAddress: { street: '', city: '', postCode: '', country: '' },
    items: [{ ...EMPTY_ITEM, _id: newItemId() }],
  };
}

// ---- Field component lives OUTSIDE InvoiceForm so its identity is stable
// across re-renders and React never unmounts/remounts it on keystroke ----
function Field({ id, label, path, type = 'text', value, error, onChange }) {
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className="form-field">
      <label
        htmlFor={id}
        className={error ? 'form-label form-label--error' : 'form-label'}
      >
        {label}
        {error && <span className="form-error" aria-hidden="true"> — {error}</span>}
      </label>
      <input
        id={id}
        type={type}
        className={error ? 'form-input form-input--error' : 'form-input'}
        value={value ?? ''}
        onChange={e => onChange(path, e.target.value)}
        aria-invalid={!!error}
        aria-describedby={errorId}
      />
      {error && (
        <span id={errorId} className="sr-only" role="alert">{label}: {error}</span>
      )}
    </div>
  );
}

export default function InvoiceForm({ invoice, onClose }) {
  const { addInvoice, updateInvoice } = useInvoices();
  const isEdit = !!invoice;
  const [form, setForm] = useState(() => {
    if (isEdit) {
      return {
        ...invoice,
        items: invoice.items.map(it => ({ ...it, _id: it._id || newItemId() })),
      };
    }
    return emptyForm();
  });
  const [errors, setErrors] = useState({});

  // Lock background scroll when form is open
  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, []);

  // Generic deep-path setter — used by Field and Select inputs
  const set = (path, val) => {
    setForm(prev => {
      const next = { ...prev };
      const parts = path.split('.');
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) {
        cur[parts[i]] = { ...cur[parts[i]] };
        cur = cur[parts[i]];
      }
      cur[parts[parts.length - 1]] = val;
      return next;
    });
    setErrors(e => ({ ...e, [path]: undefined }));
  };

  const setItem = (idx, field, val) => {
    setForm(prev => {
      const items = prev.items.map((it, i) => i === idx ? { ...it, [field]: val } : it);
      return { ...prev, items };
    });
    setErrors(e => ({ ...e, [`item_${idx}_${field}`]: undefined, items: undefined }));
  };

  const addItem = () =>
    setForm(prev => ({ ...prev, items: [...prev.items, { ...EMPTY_ITEM, _id: newItemId() }] }));

  const removeItem = (idx) =>
    setForm(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }));

  const validate = () => {
    const e = {};
    if (!form.clientName.trim())  e.clientName  = 'Required';
    if (!form.clientEmail.trim()) e.clientEmail = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.clientEmail))
      e.clientEmail = 'Valid email required';
    if (!form.description.trim()) e.description = 'Required';
    if (!form.senderAddress.street.trim())   e['senderAddress.street']   = 'Required';
    if (!form.senderAddress.city.trim())     e['senderAddress.city']     = 'Required';
    if (!form.senderAddress.postCode.trim()) e['senderAddress.postCode'] = 'Required';
    if (!form.senderAddress.country.trim())  e['senderAddress.country']  = 'Required';
    if (!form.clientAddress.street.trim())   e['clientAddress.street']   = 'Required';
    if (!form.clientAddress.city.trim())     e['clientAddress.city']     = 'Required';
    if (!form.clientAddress.postCode.trim()) e['clientAddress.postCode'] = 'Required';
    if (!form.clientAddress.country.trim())  e['clientAddress.country']  = 'Required';
    if (form.items.length === 0) e.items = 'At least one item required';
    form.items.forEach((it, i) => {
      if (!it.name.trim())           e[`item_${i}_name`]     = 'Required';
      if (Number(it.quantity) <= 0)  e[`item_${i}_quantity`] = 'Must be > 0';
      if (Number(it.price)    <= 0)  e[`item_${i}_price`]    = 'Must be > 0'; // positive = strictly greater than 0
    });
    return e;
  };

  // Draft validation — only requires client name so the list card isn't blank
  const validateDraft = () => {
    const e = {};
    if (!form.clientName.trim()) e.clientName = 'Required even for drafts';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (isEdit) { updateInvoice(form); }
    else        { addInvoice(form, false); }
    onClose();
  };

  const handleDraft = () => {
    if (isEdit) return;
    const e = validateDraft();
    if (Object.keys(e).length) { setErrors(e); return; }
    addInvoice(form, true);
    onClose();
  };

  // Helper to read a dot-path value from form
  const val = (path) => path.split('.').reduce((o, k) => o?.[k], form);

  return (
    <div className="form-overlay" role="dialog" aria-modal="true" aria-label="Invoice form">
      <div className="form-panel">

        <button className="form-panel__close" onClick={onClose} aria-label="Close form">
          <svg width="7" height="10" viewBox="0 0 7 10" fill="none" aria-hidden="true">
            <path d="M6 1L2 5l4 4" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Go back
        </button>

        <h1 className="form-panel__title">
          {isEdit ? <>Edit <span>#{form.id}</span></> : 'New Invoice'}
        </h1>

        <div className="form-panel__body">

          {/* Bill From */}
          <fieldset className="form-section">
            <legend className="form-section__legend">Bill From</legend>
            <Field id="s-street" label="Street Address"
              path="senderAddress.street" value={val('senderAddress.street')}
              error={errors['senderAddress.street']} onChange={set} />
            <div className="form-row">
              <Field id="s-city"    label="City"
                path="senderAddress.city"     value={val('senderAddress.city')}
                error={errors['senderAddress.city']}     onChange={set} />
              <Field id="s-post"    label="Post Code"
                path="senderAddress.postCode" value={val('senderAddress.postCode')}
                error={errors['senderAddress.postCode']} onChange={set} />
              <Field id="s-country" label="Country"
                path="senderAddress.country"  value={val('senderAddress.country')}
                error={errors['senderAddress.country']}  onChange={set} />
            </div>
          </fieldset>

          {/* Bill To */}
          <fieldset className="form-section">
            <legend className="form-section__legend">Bill To</legend>
            <Field id="c-name"  label="Client's Name"
              path="clientName"  value={form.clientName}
              error={errors.clientName}  onChange={set} />
            <Field id="c-email" label="Client's Email"
              path="clientEmail" value={form.clientEmail} type="email"
              error={errors.clientEmail} onChange={set} />
            <Field id="c-street" label="Street Address"
              path="clientAddress.street" value={val('clientAddress.street')}
              error={errors['clientAddress.street']} onChange={set} />
            <div className="form-row">
              <Field id="c-city"    label="City"
                path="clientAddress.city"     value={val('clientAddress.city')}
                error={errors['clientAddress.city']}     onChange={set} />
              <Field id="c-post"    label="Post Code"
                path="clientAddress.postCode" value={val('clientAddress.postCode')}
                error={errors['clientAddress.postCode']} onChange={set} />
              <Field id="c-country" label="Country"
                path="clientAddress.country"  value={val('clientAddress.country')}
                error={errors['clientAddress.country']}  onChange={set} />
            </div>
          </fieldset>

          {/* Invoice Details */}
          <fieldset className="form-section">
            <legend className="form-section__legend">Invoice Details</legend>
            <Field id="f-desc" label="Project Description"
              path="description" value={form.description}
              error={errors.description} onChange={set} />
            <div className="form-field">
              <label htmlFor="f-terms" className="form-label">Payment Terms</label>
              <select
                id="f-terms"
                className="form-input form-select"
                value={form.paymentTerms}
                onChange={e => set('paymentTerms', e.target.value)}
              >
                {TERMS.map(t => (
                  <option key={t} value={t}>Net {t} {t === 1 ? 'Day' : 'Days'}</option>
                ))}
              </select>
            </div>
          </fieldset>

          {/* Item List */}
          <fieldset className="form-section">
            <legend className="form-section__legend">Item List</legend>
            {errors.items && (
              <p className="form-error form-error--block">{errors.items}</p>
            )}

            <div className="items-table" role="table" aria-label="Invoice items">
              <div className="items-table__head" role="row" aria-hidden="true">
                <span style={{ flex: '1 1 35%' }}>Item Name</span>
                <span style={{ flex: '0 0 64px', width: 64, textAlign: 'center' }}>Qty.</span>
                <span style={{ flex: '1 1 20%', textAlign: 'right' }}>Price</span>
                <span style={{ flex: '1 1 20%', textAlign: 'right' }}>Total</span>
                <span style={{ width: 20 }} />
              </div>

              {form.items.map((item, idx) => (
                <div key={item._id} className="items-table__row" role="row">

                  {/* Name */}
                  <div className="form-field" style={{ flex: '1 1 35%', minWidth: 0 }} role="cell">
                    <label htmlFor={`item-name-${idx}`} className="sr-only">Item name</label>
                    <input
                      id={`item-name-${idx}`}
                      type="text"
                      className={errors[`item_${idx}_name`] ? 'form-input form-input--error' : 'form-input'}
                      value={item.name}
                      onChange={e => setItem(idx, 'name', e.target.value)}
                      aria-label="Item name"
                      aria-invalid={!!errors[`item_${idx}_name`]}
                    />
                  </div>

                  {/* Quantity */}
                  <div className="form-field" style={{ flex: '0 0 64px', width: 64 }} role="cell">
                    <label htmlFor={`item-qty-${idx}`} className="sr-only">Quantity</label>
                    <input
                      id={`item-qty-${idx}`}
                      type="number"
                      min="1"
                      className={errors[`item_${idx}_quantity`] ? 'form-input form-input--error form-input--center' : 'form-input form-input--center'}
                      value={item.quantity}
                      onChange={e => setItem(idx, 'quantity', e.target.value)}
                      aria-label="Quantity"
                      aria-invalid={!!errors[`item_${idx}_quantity`]}
                    />
                  </div>

                  {/* Price */}
                  <div className="form-field" style={{ flex: '1 1 20%', minWidth: 0 }} role="cell">
                    <label htmlFor={`item-price-${idx}`} className="sr-only">Price</label>
                    <input
                      id={`item-price-${idx}`}
                      type="number"
                      min="0"
                      step="0.01"
                      className={errors[`item_${idx}_price`] ? 'form-input form-input--error form-input--right' : 'form-input form-input--right'}
                      value={item.price}
                      onChange={e => setItem(idx, 'price', e.target.value)}
                      aria-label="Price"
                      aria-invalid={!!errors[`item_${idx}_price`]}
                    />
                  </div>

                  {/* Total */}
                  <div className="item-total" style={{ flex: '1 1 20%', minWidth: 0 }} role="cell" aria-label="Item total">
                    £{((Number(item.quantity) || 0) * (Number(item.price) || 0)).toFixed(2)}
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    className="item-delete"
                    onClick={() => removeItem(idx)}
                    aria-label={`Remove item ${idx + 1}`}
                  >
                    <svg width="13" height="16" viewBox="0 0 13 16" fill="none" aria-hidden="true">
                      <path d="M11.583 3.556H8.944l-.777-1.333a1 1 0 00-.861-.5H4.694a1 1 0 00-.862.5l-.777 1.333H.417A.417.417 0 000 3.973v.833c0 .23.187.417.417.417h.416v8.333A1.667 1.667 0 002.5 15.19h8a1.667 1.667 0 001.667-1.667V5.223h.416A.417.417 0 0013 4.806v-.833a.417.417 0 00-.417-.417z" fill="currentColor"/>
                    </svg>
                  </button>

                </div>
              ))}
            </div>

            <button type="button" className="btn btn--add-item" onClick={addItem}>
              + Add New Item
            </button>
          </fieldset>

        </div>{/* /form-panel__body */}

        {/* Footer */}
        <div className="form-panel__footer">
          <button className="btn btn--secondary" onClick={onClose}>
            {isEdit ? 'Cancel' : 'Discard'}
          </button>
          <div className="form-panel__footer-right">
            {!isEdit && (
              <button className="btn btn--draft" onClick={handleDraft}>
                Save as Draft
              </button>
            )}
            <button className="btn btn--primary" onClick={handleSave}>
              {isEdit ? 'Save Changes' : 'Save & Send'}
            </button>
          </div>
        </div>

      </div>{/* /form-panel */}
    </div>
  );
}
