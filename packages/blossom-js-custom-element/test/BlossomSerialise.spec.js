/**
 * @jest-environment node
 */

import { BlossomSerialise, BlossomDeserialise } from '../modules/BlossomSerialise';

describe('BlossomSerialise', () => {
  test('Strings', () => {
    expect(BlossomDeserialise(BlossomSerialise('red'))).toBe('red');
    expect(BlossomDeserialise(BlossomSerialise('"red"'))).toBe('"red"');
  });

  test('Numbers', () => {
    expect(BlossomDeserialise(BlossomSerialise(1))).toBe(1);
    expect(BlossomDeserialise(BlossomSerialise(1 + 1))).toBe(2);
  });

  test('Arrays', () => {
    expect(BlossomDeserialise(BlossomSerialise([1, 'hey', 2]))).toEqual([1, 'hey', 2]);
  });

  test('Object', () => {
    expect(BlossomDeserialise(BlossomSerialise({ abc: 123, def: 456 })))
      .toEqual({ abc: 123, def: 456 });
  });

  test('Function', () => {
    expect(BlossomDeserialise(BlossomSerialise(() => 'foo')).toString()).toEqual((() => 'foo').toString());
    expect(BlossomDeserialise(BlossomSerialise(foo => foo)).toString())
      .toEqual((foo => foo).toString());
    expect(BlossomDeserialise(BlossomSerialise((foo) => { Math.random(); return foo; })).toString())
      .toEqual(((foo) => { Math.random(); return foo; }).toString());
  });

  test('Recursive', () => {
    expect(BlossomDeserialise(BlossomSerialise({ abc: { a: 1 + 1 }, def: [1, 2, 3] })))
      .toEqual({ abc: { a: 2 }, def: [1, 2, 3] });
  });
});
