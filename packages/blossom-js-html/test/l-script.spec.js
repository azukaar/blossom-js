import 'blossom-js-server-side';
import '../modules/l-script';


describe('L-script component', () => {
  test('Execute properly the content', () => {
    global.tester = jest.fn();

    const template = `
            <l-script>tester()</l-script>
        `;

    BlossomRender(template);

    expect(global.tester.mock.calls.length).toBe(1);

    delete global.tester;
  });
});
