import 'blossom-js-server-side';
import '../modules/l-preview';

describe('L-preview component', () => {
  test('Is able to change text to preview', () => {
    const template = `
            <l-preview>
                I am a preview
            </l-preview>
        `;

    const rendered = BlossomRender(template);

    expect(rendered.textContent).toMatch(/▌ ▌▌ ▌ ▌▌▌▌▌▌▌/);
  });
});
