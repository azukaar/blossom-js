import 'blossom-js-server-side';
import '../modules/l-interval';


describe('L-interval component', () => {
  test('Displays content', () => {
    const template = `
            <l-interval timer="100">
              hello world
            </l-interval>
        `;

    const rendered = BlossomRender(template);

    expect(rendered.textContent).toMatch(/hello world/);
  });

  test('Trigger ontick', () => {
    expect.assertions(1);
    const promise = new Promise((resolve) => {
      global.tester = resolve;
    });

    const template = `
            <l-interval ontick="() => tester()" timer="100">
              hello world
            </l-interval>
        `;

    const rendered = BlossomRender(template);

    promise.then(() => {
      delete global.tester;
      expect(rendered.innerHTML).toMatch(/hello world/);
    });

    return promise;
  });
});
