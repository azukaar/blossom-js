import 'blossom-js-server-side';
import '../modules/l-get';


describe('L-get component', () => {
  test('Displays context', () => {
    const template = `
            <l-ctx ctx='{"foo":"bar"}'>
              <l-get foo></l-get>
            </l-ctx>
        `;

    const rendered = BlossomRender(template);

    expect(rendered.textContent).toMatch(/bar/);
  });
});
