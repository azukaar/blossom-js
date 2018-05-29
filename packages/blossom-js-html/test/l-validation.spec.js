import 'blossom-js-server-side';
import '../modules/l-form';
import '../modules/l-validation';


describe('L-validation component', () => {
  test('Displays errors', () => {
    const template = `
            <l-form>
              <input type="text" id="test" />
              <l-validation for="test" test="() => false"></l-validation>
            </l-form>
        `;

    const rendered = BlossomRender(template);

    expect(rendered.querySelectorAll('l-error').length).toBe(1);
  });

  test('Discards valid inputs', () => {
    const template = `
            <l-form>
              <input type="text" id="test" />
              <l-validation for="test" test="() => true"></l-validation>
            </l-form>
        `;

    const rendered = BlossomRender(template);

    expect(rendered.querySelector('l-validation').innerHTML.length).toBe(0);
  });

  test('Works out of a form', () => {
    const template = `
      <div>
        <input type="text" id="test" />
        <l-validation for="test" test="() => false"></l-validation>
      </div>
    `;

    const rendered = BlossomRender(template);

    expect(rendered.querySelectorAll('l-error').length).toBe(1);
  });
});
