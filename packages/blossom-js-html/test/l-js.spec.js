require('blossom-js-server-side');
require('../src/index')['l-js'];


describe('L-js component', () => {
    test('Is able to hide/display content based on condition', () => {
        template = `
            <l-js>Math.sin(1)</l-js>
        `;

        const rendered = BlossomRender(template);

        expect(rendered.textContent).toMatch(/0.8414709848078965/);
    })
});