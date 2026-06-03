const fs = require('fs');
let pdf = require('pdf-parse');
if (typeof pdf !== 'function' && pdf && typeof pdf.default === 'function') {
  pdf = pdf.default;
}

const pdfPath = process.argv[2];
if (!pdfPath) {
  console.error('Usage: node extract_pdf.js <pdf-path>');
  process.exit(2);
}
try {
  const dataBuffer = fs.readFileSync(pdfPath);
  pdf(dataBuffer).then(function(data) {
    console.log(data.text || '');
  }).catch(err => {
    console.error('ERROR_PDF_PARSE', err);
    process.exit(1);
  });
} catch (err) {
  console.error('ERROR_READ', err && err.message);
  process.exit(1);
}
