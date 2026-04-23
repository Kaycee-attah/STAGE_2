# Stage 2 — Invoice Management App

**HNG Frontend Internship | Stage 2**

A fully responsive Invoice Management Application built with React and Vite.

---

## Live Demo

[View on Vercel]([#](https://stage-2-81au7gts6-attahkelechi97-3050s-projects.vercel.app))

---

## Setup Instructions

```bash
# Clone the repo
git clone https://github.com/Kaycee-attah/HNG_Internship_2026.git
cd HNG_Internship_2026/Stage2/invoice-app

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## Architecture

```
src/
├── context/
│   ├── ThemeContext.jsx     # Light/dark mode with localStorage
│   └── InvoiceContext.jsx   # All invoice state + CRUD via useReducer
├── pages/
│   ├── InvoiceListPage.jsx  # Main list view with filter + new invoice
│   └── InvoiceDetailPage.jsx # Full invoice detail + actions
├── components/
│   ├── InvoiceForm.jsx      # Create + edit form with validation
│   ├── StatusBadge.jsx      # Paid / Pending / Draft badge
│   ├── FilterDropdown.jsx   # Multi-select checkbox filter
│   ├── DeleteModal.jsx      # Confirmation modal with focus trap
│   └── EmptyState.jsx       # Empty list illustration
├── utils/
│   └── helpers.js           # ID gen, date format, currency, localStorage
├── App.jsx                  # Root — state-based routing (list ↔ detail)
└── index.css                # All styles via CSS custom properties
```

**State management:** `useContext` + `useReducer` — single invoice reducer handles all CRUD. No external state library needed.

**Routing:** Simple `useState` in App.jsx (`selectedId` null = list, set = detail). No react-router needed for two views.

**Persistence:** `localStorage` — invoices saved on every mutation, loaded on mount. Theme preference also stored.

---

## Features Implemented

- ✅ Create invoices (save as pending or draft)
- ✅ Read invoice list + full detail view
- ✅ Update/edit invoices
- ✅ Delete invoices with confirmation modal
- ✅ Save as draft
- ✅ Mark pending invoices as paid
- ✅ Filter by status (Draft / Pending / Paid)
- ✅ Light & dark mode toggle (persisted)
- ✅ Full responsiveness (320px → 1440px+)
- ✅ Hover states on all interactive elements
- ✅ Form validation with error states
- ✅ localStorage persistence

---

## Trade-offs

- **No react-router** — only two views needed; useState routing is simpler and avoids a dependency
- **No CSS modules** — a single index.css with BEM naming keeps everything in one place for a project this size
- **No backend** — localStorage meets the spec requirement and avoids deployment complexity

---

## Accessibility Notes

- Semantic HTML throughout (`<main>`, `<aside>`, `<article>`, `<address>`, `<table>`, `<fieldset>`, `<legend>`)
- All form fields have `<label htmlFor="">`
- All buttons are `<button>` elements with descriptive `aria-label`
- Delete modal: focus trap, ESC to close, keyboard navigable
- Filter dropdown: `aria-haspopup`, `aria-expanded`, `role="listbox"`
- Status badges have `aria-label`
- Invoice list items have descriptive `aria-label` for screen readers
- `aria-live="polite"` on invoice count
- WCAG AA colour contrast in both light and dark modes
- Visible `:focus-visible` outlines on all interactive elements

---

## Beyond Requirements

- Animated form panel slide-in
- Modal fade-in animation
- Sample invoice data pre-loaded on first visit
- Invoice ID auto-generated in format AA1234
- Payment due date auto-calculated from payment terms
- Grand total auto-calculated from line items
