require('blossom-js-server-side');
require('../src/index')['l-json'];

describe('L-json component', () => {
    test('Preview content on loading', () => {
        template = `
            <l-json l-url='"./"'>
                Hello World!
            </l-json>
        `;

        global.fetch = () => new Promise(() => {});
        const rendered = BlossomRender(template);

        expect(rendered.innerHTML).toMatch(/l-preview/);
    });

    test('Replace preview after loading', () => {
        template = `
            <l-json l-url='"./"'>
                Hello World!
            </l-json>
        `;

        global.fetch = () => ({then : (resolve) => ({
            then: (cb) => {
              cb({});  
            }
        })});
        const rendered = BlossomRender(template);

        expect(rendered.innerHTML).not.toMatch(/l-preview/);
    });

    test('Correctly display template after loading', () => {
        template = `
            <l-json l-url='"./"'>
                Hello <l-js>foo</l-js>
            </l-json>
        `;

        global.fetch = () => ({then : (resolve) => ({
            then: (cb) => {
              cb({
                  foo: 'bar'
              });  
            }
        })});
        const rendered = BlossomRender(template);

        expect(rendered.innerHTML).toMatch(/bar/);
    });
});