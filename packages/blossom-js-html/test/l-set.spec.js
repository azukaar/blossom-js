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

    expect(rendered.querySelector('div').getAttribute('ctx')).toMatch(/tested/);
  });

  test.skip('set the proper scope with case', () => {
    const template = `
            <div>
              <l-set tEsT="tested"></l-set>
            </div>
        `;

    const rendered = BlossomRender(template);

    expect(rendered.querySelector('div').getAttribute('ctx')).toMatch(/tEsT/);
  });

  test('set the proper scope with interpolation', () => {
    const template = `
            <div>
              <l-set l-test="'hey'+1+1"></l-set>
            </div>
        `;

    const rendered = BlossomRender(template);

    expect(rendered.querySelector('div').getAttribute('ctx')).toMatch(/hey11/);
  });
});
