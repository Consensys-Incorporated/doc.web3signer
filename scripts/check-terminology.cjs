// Check editorial terminology in both development and published documentation.
// URLs, code, and direct quotations are not prose and are intentionally exempt.
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const docsDirectories = ['docs', 'versioned_docs'];
const invalidProduct = /\bweb3signer\b/gi;
const outdatedEthereum = /\bEthereum\s+2\.0\b/gi;
const historicalContext = /\b(formerly|previously|former name|old name|was known as)\b/i;

function markdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(file);
    return entry.isFile() && /\.mdx?$/.test(entry.name) ? [file] : [];
  });
}

function checkMarkdown(file, content) {
  const errors = [];
  let fence = null;
  let frontMatter = content.startsWith('---');
  const lines = content.replace(/<!--[\s\S]*?-->/g, (comment) => comment.replace(/[^\n]/g, ' ')).split(/\r?\n/);

  lines.forEach((rawLine, i) => {
    const lineNumber = i + 1;
    if (frontMatter && i > 0 && rawLine.trim() === '---') {
      frontMatter = false;
      return;
    }

    const delimiter = rawLine.match(/^\s*(`{3,}|~{3,})/);
    if (fence) {
      if (delimiter && delimiter[1][0] === fence.char && delimiter[1].length >= fence.length) fence = null;
      return;
    }
    if (delimiter) {
      fence = { char: delimiter[1][0], length: delimiter[1].length };
      return;
    }
    if (!frontMatter && (/^\s*>/.test(rawLine) || /^ {4,}\S/.test(rawLine))) return;

    let line = rawLine.replace(/`+[^`]*`+/g, ' ');
    // Preserve link text while excluding destinations, including relative paths and anchors.
    line = line.replace(/\]\([^)]*\)/g, ']');
    line = line.replace(/^(\s*\[[^\]]+\]:)\s+\S+/, '$1');
    line = line.replace(/https?:\/\/[^\s)>\]]+/g, ' ');
    line = line.replace(/<[^>]*>/g, ' ');
    if (!frontMatter) line = line.replace(/“[^”]*”|"[^"]*"/g, ' ');

    for (const match of line.matchAll(invalidProduct)) {
      if (match[0] !== 'Web3Signer') {
        errors.push(`${file}:${lineNumber}: use Web3Signer, not ${match[0]}`);
      }
    }
    if (!historicalContext.test(line)) {
      for (const match of line.matchAll(outdatedEthereum)) {
        errors.push(`${file}:${lineNumber}: use consensus layer instead of ${match[0]}`);
      }
    }

    if (/\breference\/security-disclosure\.md$/.test(file) && /\bdon’t\b/i.test(line)) {
      errors.push(`${file}:${lineNumber}: use straight apostrophe in don't`);
    }
  });
  return errors;
}

function main() {
  const files = docsDirectories.flatMap((dir) => markdownFiles(path.join(root, dir)));
  const errors = files.flatMap((file) => checkMarkdown(path.relative(root, file), fs.readFileSync(file, 'utf8')));
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
  } else {
    console.log(`Terminology check passed for ${files.length} documentation files.`);
  }
}

if (require.main === module) main();
module.exports = { checkMarkdown, markdownFiles };
