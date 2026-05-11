const fs = require('fs');
const filePath = 'c:/Nam4/ThayPhuoc/CK/event-booking-frontend/src/App.jsx';

// Read as buffer first to detect actual encoding
const buf = fs.readFileSync(filePath);
let content = buf.toString('utf8');

// Check if it has BOM
if (buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
  console.log('Has BOM, removing...');
  content = content.slice(1);
}

// The garbled bytes for Vietnamese chars come from reading UTF8 as Latin1 then saving as UTF8 again
// We need to decode the mojibake back to proper UTF8

// The patterns we need to fix - using raw byte replacement
// '\\xc4\\x91' = 'đ' (d with stroke)
// Each garbled sequence is the UTF-8 bytes of Vietnamese chars treated as Latin-1

function fixMojibake(str) {
  // Convert the broken encoding back to proper UTF-8
  // The issue: UTF-8 bytes were read as Latin-1/CP1252, creating mojibake
  try {
    // Try to detect and fix common patterns
    return str
      // đ = \xc4\x91 in UTF8, mojibake = Ä' 
      .replace(/\xc4\x91/g, 'đ')
      // ổ = \xe1\xbb\x95, mojibake = á»•
      .replace(/\xe1\xbb\x95/g, 'ổ')
      // Replace the specific garbled text we see
      .replace(/\xc4'/g, 'đ')
      .replace(/Ä'/g, 'đ');
  } catch(e) {
    return str;
  }
}

// The real fix: just replace the offending lines with pure ASCII-only equivalents
const lines = content.split('\n');

const fixedLines = lines.map((line, i) => {
  const lineNum = i + 1;
  
  // Line 567: zone price
  if (line.includes('.toLocaleString()}') && line.includes('span') && line.includes('opacity')) {
    return line.replace(/\.toLocaleString\(\)}[^<]*/g, '.toLocaleString()}d</span>');
  }
  
  // Line 576: stage label - replace with pure ASCII text
  if (line.includes('SĂ') || line.includes('KHáº') || line.includes('DIá»')) {
    return '          \ud83c\udfa4 SAN KHAU / SAN DIEN';
  }
  if (line.includes('đŸ¤') || (line.includes('S') && line.includes('N KH') && line.includes('N DI'))) {
    return '          \ud83c\udfa4 SAN KHAU / SAN DIEN';  
  }
  
  // Bottom bar: "Ghế đang chọn" and price
  if (line.includes('color:\'var(--primary-color)\'') && line.includes('1.4rem') && line.includes('.toLocaleString()')) {
    return '              {activeZone.price.toLocaleString()} d';
  }
  
  return line;
});

const fixedContent = fixedLines.join('\n');
fs.writeFileSync(filePath, fixedContent, 'utf8');
console.log('Done.');
console.log('Line 567:', fixedLines[566] ? fixedLines[566].substring(0, 100) : 'N/A');
console.log('Line 576:', fixedLines[575] ? fixedLines[575].substring(0, 100) : 'N/A');
