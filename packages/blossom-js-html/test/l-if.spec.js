require('blossom-js-server-side');
require('../src/l-if');


describe('L-if component', () => {
    test('Is able to hide/display content based on condition', () => {
        template = `
            <l-if l-cond="false">
                I am not displayed
            </l-if>
            <l-if l-cond="true">
                I am displayed
            </l-if>
        `;

        const rendered = BlossomRender(template);

        expect(rendered.textContent).toMatch(/I am displayed/);
        expect(rendered.textContent).not.toMatch(/I am not displayed/);
    })
});