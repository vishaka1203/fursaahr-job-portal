import React from 'react';

const AgentInvoiceList = ({ invoices }) => {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h2>Agent Invoice List</h2>

      {invoices.length === 0 ? (
        <p>No invoices available</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>
                Invoice ID
              </th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>
                Customer Name
              </th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>
                Total (KWD)
              </th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>
                Due Date
              </th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>
                Payment Type
              </th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.invoiceid}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {invoice.invoiceid}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {invoice.customername}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {invoice.total}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {invoice.duedate}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {invoice.paytype}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// Sample data for the component
const sampleInvoices = [
  {
    invoiceid: 381,
    customername: 'FAHED.A.A.AL AZMI',
    total: '750.000',
    duedate: '2023-12-31',
    paytype: 'K-Net',
  },
  {
    invoiceid: 382,
    customername: 'John Doe',
    total: '600.000',
    duedate: '2024-01-15',
    paytype: 'Cash',
  },
  // Add more sample invoices here
];

function App() {
  return (
    <div>
      <AgentInvoiceList invoices={sampleInvoices} />
    </div>
  );
}

export default App;
