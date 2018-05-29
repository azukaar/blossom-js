/**
 * @jest-environment node
 */

import 'blossom-js-server-side';
import { interpolate } from '../modules/utils';

describe('Interpolate String', () => {
  test('Allow strings', () => {
    expect(interpolate('"red"')).toBe('red');
    expect(interpolate("'red'")).toBe('red');
  });
  test('Allow ctxd var', () => {
    expect(interpolate('this.foo', { foo: 'bar' })).toBe('bar');
  });
  test('Allow operations', () => {
    expect(interpolate('this.foo + 123', { foo: 123 })).toBe(123 * 2);
  });
  test('Allow URL', () => {
    expect(interpolate('"/foo"')).toBe('/foo');
  });
  test('Allow JS lib', () => {
    expect(interpolate('new Date(0)+""')).toBe('Thu Jan 01 1970 00:00:00 GMT+0000 (BST)');
  });
  test('Allow function call', () => {
    expect(interpolate('this.foo.match("123")', { foo: '123' })).toContain('123');
    expect(interpolate('this.foo.match(/123/)', { foo: '123' })).toContain('123');
  });
});
