export function printElement(elementId: string, title: string) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const styles = Array.from(document.styleSheets)
    .map(sheet => {
      try {
        return Array.from(sheet.cssRules || []).map(rule => rule.cssText).join('');
      } catch { return ''; }
    })
    .join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>${styles}</style>
      <style>
        body { padding: 20px; font-family: system-ui, sans-serif; }
        @page { margin: 15mm; }
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
        }
        .print-only { display: none; }
      </style>
    </head>
    <body>
      ${el.innerHTML}
      <script>window.print();window.close();<\/script>
    </body>
    </html>
  `);
  printWindow.document.close();
}
