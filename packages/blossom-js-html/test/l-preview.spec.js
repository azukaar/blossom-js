require('blossom-js-server-side');
require('../src/l-preview');


describe('L-preview component', () => {
    test('Is able to change text to preview', () => {
        template = `
            <l-preview>
                I am a preview
            </l-preview>
        `;

        const rendered = BlossomRender(template);

        expect(rendered.textContent).toMatch(/▌ ▌▌ ▌ ▌▌▌▌▌▌▌/);
    })
});