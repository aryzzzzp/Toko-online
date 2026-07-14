const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeProductImages, serializeProductImages, getPrimaryProductImage } = require('./productImages');

test('normalizeProductImages parses JSON array and fallback URLs', () => {
  assert.deepEqual(normalizeProductImages('["https://a.com/1.jpg","https://a.com/2.jpg"]'), [
    'https://a.com/1.jpg',
    'https://a.com/2.jpg',
  ]);

  assert.deepEqual(normalizeProductImages('https://a.com/1.jpg'), ['https://a.com/1.jpg']);
  assert.deepEqual(normalizeProductImages(''), []);
});

test('serializeProductImages preserves unique URLs', () => {
  assert.equal(serializeProductImages(['https://a.com/1.jpg', 'https://a.com/1.jpg', 'https://a.com/2.jpg']), '["https://a.com/1.jpg","https://a.com/2.jpg"]');
});

test('getPrimaryProductImage returns first available image', () => {
  assert.equal(getPrimaryProductImage(['https://a.com/1.jpg', 'https://a.com/2.jpg']), 'https://a.com/1.jpg');
  assert.equal(getPrimaryProductImage([]), '');
});
