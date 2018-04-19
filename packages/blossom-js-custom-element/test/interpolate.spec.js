/**
 * @jest-environment node
 */

import 'blossom-js-server-side';
import { BlossomInterpolate } from '../modules/utils';

describe('Interpolate String', () => {
  test('Allow strings', () => {
    expect(BlossomInterpolate('"red"')).toBe('red');
    expect(BlossomInterpolate("'red'")).toBe('red');
  });
  test('Allow scoped var', () => {
    expect(BlossomInterpolate('this.foo', { foo: 'bar' })).toBe('bar');
  });
  test('Allow operations', () => {
    expect(BlossomInterpolate('this.foo + 123', { foo: 123 })).toBe(123 * 2);
  });
  test('Allow URL', () => {
    expect(BlossomInterpolate('"/foo"')).toBe('/foo');
  });
  test('Allow JS lib', () => {
    expect(BlossomInterpolate('new Date(0)+""')).toBe('Thu Jan 01 1970 00:00:00 GMT+0000 (BST)');
  });
  test('Allow function call', () => {
    expect(BlossomInterpolate('this.foo.match("123")', { foo: '123' })).toContain('123');
    expect(BlossomInterpolate('this.foo.match(/123/)', { foo: '123' })).toContain('123');
  });
});
