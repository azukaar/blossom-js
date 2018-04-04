import 'blossom-js-server-side';
import '../modules/l-js';
import '../modules/l-loop';


describe('L-loop component', () => {
  test('Is able to repeat from an array', () => {
    const template = `
            <div l-scope='{"test": [1,2,3]}'>
                <l-loop l-from="test">
                    hey
                </l-loop>
            </div>
        `;

    const rendered = BlossomRender(template);

    expect(rendered.textContent.split('hey').length).toBe(4);
  });

  test('Is able to repeat a value', () => {
    const template = `
            <div l-scope='{"test": [1,2,3]}'>
                <l-loop l-from="test">
                    hey <l-js>loop</l-js>
                </l-loop>
            </div>
        `;

    const rendered = BlossomRender(template);

    expect(rendered.textContent).toMatch(/1/);
    expect(rendered.textContent).toMatch(/2/);
    expect(rendered.textContent).toMatch(/3/);
  });
});
