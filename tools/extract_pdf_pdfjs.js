const fs = require('fs');
const path = require('path');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

async function extract(pdfPath) {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await pdfjsLib.getDocument({data}).promise;
  let out = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(s => s.str).join(' ');
    out.push(`--- PAGE ${i} ---`);
    out.push(strings);
  }
  return out.join('\n');
}

const pdfPath = process.argv[2];
if (!pdfPath) {
  console.error('Usage: node extract_pdf_pdfjs.js <pdf-path>');
  process.exit(2);
}

extract(pdfPath).then(text => {
  const outPath = path.join(__dirname, 'Expected_SET_B.txt');
  fs.writeFileSync(outPath, text, 'utf8');
  console.log('WROTE', outPath);
}).catch(err => {
  console.error('ERROR', err && err.message);
  process.exit(1);
});
