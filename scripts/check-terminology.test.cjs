const { test } = require('node:test');
const assert = require('node:assert/strict');
const { checkMarkdown } = require('./check-terminology.cjs');

const file = 'docs/reference/security-disclosure.md';

test('checks frontmatter and ordinary prose for incorrect product casing', () => {
  const content = '---\ndescription: Report bugs in Web3signer.\n---\n\nUse web3Signer or web3signer for validation.\n';
  const errors = checkMarkdown(file, content);
  assert.equal(errors.length, 3);
  assert.ok(errors[0].includes(':2:'));
  assert.ok(errors[1].includes(':5:'));
});

test('allows canonical casing and deprecated-name explanations', () => {
  assert.deepEqual(
    checkMarkdown('docs/index.md', 'Web3Signer is used on the consensus layer, formerly called Ethereum 2.0.'),
    [],
  );
});

test('ignores URLs, inline code, fenced code blocks, and quotations', () => {
  const content = [
    'See [Web3Signer](https://example.com/web3signer).',
    'Run `web3signer` or read `Web3signer`.',
    '```sh',
    'web3signer --help',
    '```',
    '> The upstream text says Web3signer.',
    'A reviewer quoted “Web3signer” from the old guide.',
  ].join('\n');
  assert.deepEqual(checkMarkdown('docs/index.md', content), []);
});

test('ignores relative Markdown links and reference targets while checking labels', () => {
  assert.deepEqual(
    checkMarkdown('docs/index.md', '[Start Web3Signer](#start-web3signer)\n[Reference]: ../start-web3signer.md'),
    [],
  );
  const errors = checkMarkdown('docs/index.md', '[Start Web3signer](../start-web3signer.md)');
  assert.equal(errors.length, 1);
});

test('flags deprecated Ethereum terminology in current guidance', () => {
  const errors = checkMarkdown('docs/get-started/key-best-practices.md', 'Web3Signer manages keys for Ethereum 2.0 staking.');
  assert.equal(errors.length, 1);
  assert.match(errors[0], /consensus layer/);
});

test('flags curly apostrophe in security disclosure but not unrelated pages', () => {
  assert.equal(checkMarkdown(file, 'Please don’t disclose secrets here.').length, 1);
  assert.deepEqual(checkMarkdown('docs/index.md', 'Users don’t need extra setup.'), []);
});
