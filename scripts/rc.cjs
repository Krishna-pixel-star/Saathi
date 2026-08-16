const fs = require('fs');
const path = require('path');

const TARGET_EXTENSIONS = ['.js', '.jsx'];

// Directories to skip
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', 'build']);

function removeComments(code) {
  let result = '';
  let i = 0;
  const len = code.length;

  while (i < len) {
    // String: single quote
    if (code[i] === "'" && (i === 0 || code[i - 1] !== '\\')) {
      result += code[i++];
      while (i < len) {
        result += code[i];
        if (code[i] === '\\') { i++; if (i < len) result += code[i]; }
        else if (code[i] === "'") { i++; break; }
        i++;
      }
      continue;
    }

    // String: double quote
    if (code[i] === '"' && (i === 0 || code[i - 1] !== '\\')) {
      result += code[i++];
      while (i < len) {
        result += code[i];
        if (code[i] === '\\') { i++; if (i < len) result += code[i]; }
        else if (code[i] === '"') { i++; break; }
        i++;
      }
      continue;
    }

    // Template literal
    if (code[i] === '`') {
      result += code[i++];
      let depth = 0;
      while (i < len) {
        if (code[i] === '\\') {
          result += code[i++];
          if (i < len) result += code[i++];
          continue;
        }
        if (code[i] === '$' && code[i + 1] === '{') {
          depth++;
          result += code[i++];
          result += code[i++];
          continue;
        }
        if (code[i] === '}' && depth > 0) {
          depth--;
          result += code[i++];
          continue;
        }
        if (code[i] === '`' && depth === 0) {
          result += code[i++];
          break;
        }
        result += code[i++];
      }
      continue;
    }

    // Line comment: //
    if (code[i] === '/' && code[i + 1] === '/') {
      i += 2;
      while (i < len && code[i] !== '\n') i++;
      // preserve the newline
      continue;
    }

    // Block comment: /* */
    if (code[i] === '/' && code[i + 1] === '*') {
      i += 2;
      while (i < len) {
        if (code[i] === '*' && code[i + 1] === '/') { i += 2; break; }
        if (code[i] === '\n') result += '\n'; // preserve line structure
        i++;
      }
      continue;
    }

    // JSX comment: {/* */}  — handled by block comment above when inside JSX braces
    result += code[i++];
  }

  // Collapse 3+ consecutive blank lines to 2, and remove lines that are only whitespace
  return result
    .split('\n')
    .map(line => (line.trim() === '' ? '' : line))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (TARGET_EXTENSIONS.includes(path.extname(entry.name))) {
      const original = fs.readFileSync(full, 'utf8');
      const cleaned = removeComments(original);
      if (cleaned !== original) {
        fs.writeFileSync(full, cleaned, 'utf8');
        console.log('Cleaned:', full);
      } else {
        console.log('No change:', full);
      }
    }
  }
}

const rootDir = path.resolve(__dirname, '..', 'src');
console.log('Removing all comments from:', rootDir);
walk(rootDir);

// Also clean api/*.js at project root
const apiDir = path.resolve(__dirname, '..', 'api');
if (fs.existsSync(apiDir)) {
  console.log('Also cleaning api/...');
  walk(apiDir);
}

console.log('\nDone! All comments removed.');
