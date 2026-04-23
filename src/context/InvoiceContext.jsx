import { createContext, useContext, useReducer, useEffect } from 'react';
import { loadInvoices, saveInvoices, generateId, addDays, calcTotal } from '../utils/helpers';

const InvoiceContext = createContext();

const SAMPLE_INVOICES = [
  {
    id: 'RT3080', createdAt: '2021-08-18', paymentDue: '2021-09-19', paymentTerms: 30,
    description: 'Re-branding', clientName: 'Jensen Huang', clientEmail: 'jensenh@mail.com',
    status: 'paid',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '106 Kendell Street', city: 'Sharrington', postCode: 'NR24 5WQ', country: 'United Kingdom' },
    items: [{ name: 'Brand Guidelines', quantity: 1, price: 1800.90 }],
    total: 1800.90,
  },
  {
    id: 'XM9141', createdAt: '2021-08-21', paymentDue: '2021-09-20', paymentTerms: 30,
    description: 'Graphic Design', clientName: 'Alex Grim', clientEmail: 'alexgrim@mail.com',
    status: 'pending',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '84 Church Way', city: 'Bradford', postCode: 'BD1 9PB', country: 'United Kingdom' },
    items: [
      { name: 'Banner Design', quantity: 1, price: 156.00 },
      { name: 'Email Design', quantity: 2, price: 200.00 },
    ],
    total: 556.00,
  },
  {
    id: 'RG0314', createdAt: '2021-09-24', paymentDue: '2021-10-01', paymentTerms: 7,
    description: 'Website Redesign', clientName: 'John Morrison', clientEmail: 'jm@myco.com',
    status: 'draft',
    senderAddress: { street: '19 Union Terrace', city: 'London', postCode: 'E1 3EZ', country: 'United Kingdom' },
    clientAddress: { street: '79 Dover Road', city: 'Westhall', postCode: 'IP19 3PF', country: 'United Kingdom' },
    items: [{ name: 'Website Redesign', quantity: 1, price: 14002.33 }],
    total: 14002.33,
  },
];

function reducer(state, action) {
  let next;
  switch (action.type) {
    case 'LOAD':
      return action.payload;
    case 'ADD':
      next = [...state, action.payload];
      saveInvoices(next); return next;
    case 'UPDATE':
      next = state.map(inv => inv.id === action.payload.id ? action.payload : inv);
      saveInvoices(next); return next;
    case 'DELETE':
      next = state.filter(inv => inv.id !== action.id);
      saveInvoices(next); return next;
    case 'MARK_PAID':
      next = state.map(inv => inv.id === action.id ? { ...inv, status: 'paid' } : inv);
      saveInvoices(next); return next;
    default: return state;
  }
}

export function InvoiceProvider({ children }) {
  const [invoices, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    const stored = loadInvoices();
    dispatch({ type: 'LOAD', payload: stored.length ? stored : SAMPLE_INVOICES });
    if (!stored.length) saveInvoices(SAMPLE_INVOICES);
  }, []);

  const addInvoice = (data, isDraft) => {
    const id = generateId();
    const invoice = {
      ...data,
      id,
      createdAt: new Date().toISOString().split('T')[0],
      paymentDue: addDays(new Date().toISOString().split('T')[0], Number(data.paymentTerms) || 30),
      status: isDraft ? 'draft' : 'pending',
      total: calcTotal(data.items),
    };
    dispatch({ type: 'ADD', payload: invoice });
    return id;
  };

  const updateInvoice = (data) => {
    const updated = {
      ...data,
      paymentDue: addDays(data.createdAt, Number(data.paymentTerms) || 30),
      total: calcTotal(data.items),
    };
    dispatch({ type: 'UPDATE', payload: updated });
  };

  const deleteInvoice = (id) => dispatch({ type: 'DELETE', id });
  const markPaid = (id) => dispatch({ type: 'MARK_PAID', id });

  return (
    <InvoiceContext.Provider value={{ invoices, addInvoice, updateInvoice, deleteInvoice, markPaid }}>
      {children}
    </InvoiceContext.Provider>
  );
}

export const useInvoices = () => useContext(InvoiceContext);
