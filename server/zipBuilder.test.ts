import test from 'node:test';
import assert from 'node:assert/strict';
import { buildProjectZip, createZipBuffer } from './zipBuilder';

test('createZipBuffer generates valid PKZIP signatures', () => {
  const zip = createZipBuffer([
    { name: 'hello.txt', content: Buffer.from('Hello Nabila Events Celebration!') },
  ]);
  assert.equal(zip.readUInt32LE(0), 0x04034b50);
  assert.ok(zip.includes(Buffer.from('hello.txt')));
  assert.equal(zip.readUInt32LE(zip.length - 22), 0x06054b50);
});

test('buildProjectZip packages workspace files without node_modules', () => {
  const zip = buildProjectZip(process.cwd());
  assert.ok(zip.length > 10000);
  assert.ok(zip.includes(Buffer.from('package.json')));
  assert.ok(zip.includes(Buffer.from('server.ts')));
  assert.equal(zip.includes(Buffer.from('node_modules/')), false);
});
