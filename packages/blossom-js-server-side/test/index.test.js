/**
 * @jest-environment node
 */

const {document} = require('../src/index');

describe('Create virtual dom', () => {
    test('dom should exists', () => {
        expect(document.createElement).not.toBeUndefined();
    });
});