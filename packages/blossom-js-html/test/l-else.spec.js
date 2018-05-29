import 'blossom-js-server-side';
import '../modules/l-elif';
import '../modules/l-else';
import '../modules/l-if';

describe('L-else component', () => {
  test('Is able to hide/display content based on condition if parent `if` is false', () => {
    const template = `
              <l-if l-cond="false">
                  I am not displayed
              </l-if>
              <l-else>
                  I am displayed
              </l-elif>
          `;

    const rendered = BlossomRender(template);

    expect(rendered.textContent).toMatch(/I am displayed/);
    expect(rendered.textContent).not.toMatch(/I am not displayed/);
  });

  test('doesnt show if parent `if` is true', () => {
    const template = `
              <l-if l-cond="true">
                  I am displayed
              </l-if>
              <l-else>
                  I am not displayed
              </l-else>
          `;

    const rendered = BlossomRender(template);

    expect(rendered.textContent).toMatch(/I am displayed/);
    expect(rendered.textContent).not.toMatch(/I am not displayed/);
  });

  test('doesnt show if neighboor `elif` is true', () => {
    const template = `
              <l-if l-cond="false">
                  I am not displayed
              </l-if>
              <l-elif l-cond="true">
                  I am displayed
              </l-elif>
              <l-else>
                  I am not displayed
              </l-else>
          `;

    const rendered = BlossomRender(template);

    expect(rendered.textContent).toMatch(/I am displayed/);
    expect(rendered.textContent).not.toMatch(/I am not displayed/);
  });

  test('Can show if neighboor `elif` is false', () => {
    const template = `
              <l-if l-cond="false">
                  I am not displayed
              </l-if>
              <l-elif l-cond="false">
                  I am not displayed
              </l-elif>
              <l-else>
                  I am displayed
              </l-else>
          `;

    const rendered = BlossomRender(template);

    expect(rendered.textContent).toMatch(/I am displayed/);
    expect(rendered.textContent).not.toMatch(/I am not displayed/);
  });

  test('Throw if no if is found', () => {
    const template = `
              <a>some test</a>
              <l-else>
                  I am not displayed
              </l-else>
          `;

    expect(() => {
      BlossomRender(template);
    }).toThrow();
  });
});
