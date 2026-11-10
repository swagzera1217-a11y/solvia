import test from 'node:test';
import assert from 'node:assert/strict';
import { positionMath, validateDraft } from '../dist/math.js';
import balance from '../dist/api/balance.js';

test('long and short returns follow direction', () => {
  assert.equal(positionMath({ entry: 100, mark: 110, margin: 100, leverage: 3 }).pnl, 30);
  assert.equal(positionMath({ entry: 100, mark: 90, margin: 100, leverage: 3, side: 'short' }).pnl, 30);
});
test('adverse moves cannot display negative equity', () => {
  const p = positionMath({ entry: 100, mark: 1, margin: 100, leverage: 5 });
  assert.equal(p.liquidated, true);
  assert.equal(p.equity, 0);
  assert.equal(p.pnl, -100);
});
test('invalid risk inputs are refused', () => {
  const valid = { entry: 100, mark: 100, margin: 100, leverage: 3 };
  for (const changes of [{ margin: 0 }, { margin: -1 }, { leverage: 0 }, { leverage: 21 }, { mark: NaN }, { entry: Infinity }, { side: 'other' }]) {
    assert.equal(positionMath({ ...valid, ...changes }), null);
  }
});
test('drafts normalize ticker and whitespace', () => {
  const d = validateDraft({ name: '  My token  ', symbol: 'coin', website: 'https://example.com' });
  assert.equal(d.value.name, 'My token');
  assert.equal(d.value.symbol, 'COIN');
  assert.equal(d.value.website, 'https://example.com/');
});
test('drafts reject executable URLs and oversized descriptions', () => {
  for (const website of ['javascript:alert(1)', 'data:text/html,test', 'http://example.com']) {
    assert.ok(validateDraft({ name: 'Token', symbol: 'TEST', website }).error);
  }
  assert.ok(validateDraft({ name: 'Token', symbol: 'TEST', description: 'a'.repeat(501) }).error);
});
test('drafts accept only bounded image data', () => {
  assert.ok(validateDraft({ name: 'Token', symbol: 'TEST', image: 'https://example.com/image.svg' }).error);
  assert.ok(validateDraft({ name: 'Token', symbol: 'TEST', image: 'data:image/svg+xml;base64,PHN2Zz4=' }).error);
  assert.ok(validateDraft({ name: 'Token', symbol: 'TEST', image: 'data:image/png;base64,' + 'a'.repeat(1800001) }).error);
});
test('invalid public addresses fail before any RPC query', async () => {
  const res = { statusCode: 200, setHeader() {}, end(body) { this.body = JSON.parse(body); } };
  await balance({ method: 'GET', url: '/api/balance?address=not-a-wallet' }, res);
  assert.equal(res.statusCode, 400);
});
test('balance endpoint is read-only', async () => {
  const res = { statusCode: 200, setHeader() {}, end(body) { this.body = JSON.parse(body); } };
  await balance({ method: 'POST', url: '/api/balance' }, res);
  assert.equal(res.statusCode, 405);
});
