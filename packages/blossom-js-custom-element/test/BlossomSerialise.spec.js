/**
 * @jest-environment node
 */

import 'blossom-js-server-side';
import { serialise, deserialise } from '../modules/serialise';

describe('serialise', () => {
  test('Strings', () => {
    expect(deserialise(serialise('red'))).toBe('red');
    expect(deserialise(serialise('"red"'))).toBe('"red"');
  });

  test.only('Empty', () => {
    expect(deserialise(serialise(''))).toBe('');
  });

  test('Numbers', () => {
    expect(deserialise(serialise(1))).toBe(1);
    expect(deserialise(serialise(1 + 1))).toBe(2);
  });

  test('Bool', () => {
    expect(deserialise(serialise(true))).toEqual(true);
  });

  test('Arrays', () => {
    expect(deserialise(serialise([1, 'hey', 2]))).toEqual([1, 'hey', 2]);
  });

  test('Object', () => {
    expect(deserialise(serialise({ abc: 123, def: 456 })))
      .toEqual({ abc: 123, def: 456 });
  });

  test('Function', () => {
    expect(deserialise(serialise(() => 'foo')).toString()).toEqual((() => 'foo').toString());
    expect(deserialise(serialise(foo => foo)).toString())
      .toEqual((foo => foo).toString());
    expect(deserialise(serialise((foo) => { Math.random(); return foo; })).toString())
      .toEqual(((foo) => { Math.random(); return foo; }).toString());
  });

  test('Recursive', () => {
    expect(deserialise(serialise({ abc: { a: 1 + 1 }, def: [1, 2, 3], boo: true })))
      .toEqual({ abc: { a: 2 }, def: [1, 2, 3], boo: true });
  });
});
