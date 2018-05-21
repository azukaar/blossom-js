import 'blossom-js-server-side';
import '../modules/l-ctx';
import '../modules/l-js';
import '../modules/l-set';


describe('L-set component', () => {
  test('set the proper scope', () => {
    const template = `
            <div>
              <l-set test="tested"></l-set>
            </div>
        `;

    const rendered = BlossomRender(template);

    expect(rendered.querySelector('div').getAttribute('l-ctx')).toMatch(/tested/);
  });
});
