/**
 * @jest-environment node
 */

require('../src/index');

describe('Create virtual dom', () => {
  test('dom should exists', () => {
    expect(document.createElement).not.toBeUndefined();
  });
});
