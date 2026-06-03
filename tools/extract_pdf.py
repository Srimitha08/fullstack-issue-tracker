import sys
from pathlib import Path
try:
    import PyPDF2
except Exception as e:
    print('MISSING_PYPDF2')
    raise

if len(sys.argv) < 2:
    print('Usage: extract_pdf.py <pdf-path>')
    sys.exit(2)

pdf_path = Path(sys.argv[1])
if not pdf_path.exists():
    print(f'ERROR: file not found: {pdf_path}')
    sys.exit(3)

out_lines = []
with open(pdf_path, 'rb') as f:
    reader = PyPDF2.PdfReader(f)
    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        out_lines.append(f'--- PAGE {i+1} ---')
        out_lines.append(text or '')

print('\n'.join(out_lines))
