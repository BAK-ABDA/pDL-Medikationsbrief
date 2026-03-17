const isSafari = navigator.vendor && navigator.vendor.includes('Apple') &&
                 navigator.userAgent && !navigator.userAgent.includes('CriOS') &&
                 !navigator.userAgent.includes('FxiOS');

async function downloadPDF() {
    const pdf = await generatePDF('final');

    if (pdf) {
        const patientInput = document.getElementById("patient-name");
        const patientName = patientInput?.value || "";

        const safeName = patientName.trim()
                                    .replace(/\s+/g, '_')
                                    .replace(/[^\wäöüÄÖÜß_-]/g, '');

        pdf.save(`Medikationsbrief_${safeName}.pdf`);
    }
}

async function printDocument() {
  const pdf = await generatePDF('final');
  if (!pdf) return;

  const isSafari = navigator.vendor && navigator.vendor.includes('Apple') &&
                   navigator.userAgent && !navigator.userAgent.includes('CriOS') &&
                   !navigator.userAgent.includes('FxiOS');

  let pdfUrl;
  if (isSafari) {
    pdfUrl = pdf.output('datauristring');
  } else {
    const pdfBlob = pdf.output('blob');
    pdfUrl = URL.createObjectURL(pdfBlob);
  }

  const patientInput = document.getElementById("patient-name");
  const patientName = patientInput?.value || "";
  const safeName = patientName.trim()
    .replace(/\s+/g, '_')
    .replace(/[^\wäöüÄÖÜß_-]/g, '');

  const title = safeName
    ? `Druckansicht: Medikationsbrief_${safeName}`
    : `Druckansicht: Medikationsbrief`;

  const faviconHref = `./assets/favicon.ico?v=${Date.now()}`;

  const printWin = window.open('about:blank', '_blank');
  if (!printWin) {
    alert("Popup wurde blockiert. Bitte Popups für diese Seite erlauben.");
    return;
  }

  printWin.document.write(`
    <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <link rel="icon" type="image/png" sizes="32x32" href="${faviconHref}">
      </head>
      <body style="margin:0">
        <iframe id="printFrame"
                src="${pdfUrl}"
                style="width:100%;height:100%;border:none"></iframe>

        <script>
          const iframe = document.getElementById('printFrame');
          iframe.onload = function() {
            setTimeout(() => {
              iframe.contentWindow.focus();
              iframe.contentWindow.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `);

  printWin.document.close();
  printWin.focus();
}

async function viewDocument() {
  const pdf = await generatePDF('preview');
  if (!pdf) return;

  const isSafari = navigator.vendor && navigator.vendor.includes('Apple') &&
                   navigator.userAgent && !navigator.userAgent.includes('CriOS') &&
                   !navigator.userAgent.includes('FxiOS');

  let pdfUrl;
  if (isSafari) {
    pdfUrl = pdf.output('datauristring');
  } else {
    const pdfBlob = pdf.output('blob');
    pdfUrl = URL.createObjectURL(pdfBlob);
  }

  const patientInput = document.getElementById("patient-name");
  const patientName = patientInput?.value || "";
  const safeName = patientName.trim()
    .replace(/\s+/g, '_')
    .replace(/[^\wäöüÄÖÜß_-]/g, '');

  const title = safeName
    ? `Vorschau: Medikationsbrief_${safeName}`
    : `Vorschau: Medikationsbrief`;

  const faviconHref = "./assets/favicon.ico";

  const viewWin = window.open('', '_blank');
  viewWin.document.write(`
    <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <link rel="icon" type="image/png" sizes="32x32" href="${faviconHref}">
      </head>
      <body style="margin:0">
        <iframe src="${pdfUrl}" style="width:100%;height:100%;border:none"></iframe>
      </body>
    </html>
  `);
  viewWin.document.close();
  viewWin.focus();
}

document.addEventListener("DOMContentLoaded", () => {
    const pdfButton = document.getElementById('downloadPdfBtn');
    if (pdfButton) {
        pdfButton.addEventListener('click', downloadPDF);
    }
});