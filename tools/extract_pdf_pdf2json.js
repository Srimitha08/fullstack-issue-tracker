const fs = require('fs');
const PDFParser = require('pdf2json');
const path = require('path');

const pdfPath = process.argv[2];
if (!pdfPath) {
  console.error('Usage: node extract_pdf_pdf2json.js <pdf-path>');
  process.exit(2);
}

const pdfParser = new PDFParser();
pdfParser.on('pdfParser_dataError', errData => console.error(errData.parserError));
pdfParser.on('pdfParser_dataReady', pdfData => {
  const pages = pdfData.formImage.Pages || [];
  const out = [];
  pages.forEach((pg, idx) => {
    const texts = (pg.Texts || []).map(t => t.R.map(r => decodeURIComponent(r.T)).join('')).join(' ');
    out.push(`--- PAGE ${idx+1} ---`);
    out.push(texts);
  });
  const outPath = path.join(__dirname, 'Expected_SET_B.txt');
  fs.writeFileSync(outPath, out.join('\n'), 'utf8');
  console.log('WROTE', outPath);
});

pdfParser.loadPDF(pdfPath);
