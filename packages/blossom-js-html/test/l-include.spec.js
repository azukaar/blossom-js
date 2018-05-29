import 'blossom-js-server-side';
import '../modules/l-include';

describe('L-include component', () => {
  test('Correctly display content after loading', () => {
    const template = `
            <l-include l-url='"./"'></l-include>
        `;

    global.fetch = () => ({
      // eslint-disable-next-line no-unused-vars
      then: resolve => ({
        then: (cb) => {
          cb('Hello World');
        },
      }),
    });

    const rendered = BlossomRender(template);

    expect(rendered.innerHTML).toMatch(/Hello World/);
  });
});
