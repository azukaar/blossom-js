import 'blossom-js-server-side';
import '../modules/l-form';
import '../modules/l-error';
import '../modules/l-validation';

describe('L-form component', () => {
  test('Render a form element', () => {
    const template = `
            <l-form>
                <input type="text" value="foo"/>
            </l-form>
        `;

    const rendered = BlossomRender(template);

    expect(rendered.querySelector('form').length).toBe(1);
  });

  test('Blocks if error is found', () => {
    const template = `
            <l-form>
                <input type="text" value="foo"/>
                <l-error>test</l-error>
                <input type="submit"/>
            </l-form>
        `;

    const rendered = BlossomRender(template);

    expect(rendered.querySelector('input[type="submit"]').getAttribute('disabled')).toBe('true');
  });

  test('Blocks if error is found after update', () => {
    const template = `
            <l-form>
                <input id="testing" type="text" value="foo"/>
                <l-validation test="() => false" for="testing">this is an error</l-validation>
                <input type="submit"/>
            </l-form>
        `;

    const rendered = BlossomRender(template);

    expect(rendered.querySelector('input[type="submit"]').getAttribute('disabled')).toBe('true');
  });
});
