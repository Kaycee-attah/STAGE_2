import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { InvoiceProvider } from './context/InvoiceContext';
import InvoiceListPage from './pages/InvoiceListPage';
import InvoiceDetailPage from './pages/InvoiceDetailPage';

export default function App() {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <ThemeProvider>
      <InvoiceProvider>
        {selectedId ? (
          <InvoiceDetailPage
            invoiceId={selectedId}
            onBack={() => setSelectedId(null)}
          />
        ) : (
          <InvoiceListPage onSelect={setSelectedId} />
        )}
      </InvoiceProvider>
    </ThemeProvider>
  );
}
