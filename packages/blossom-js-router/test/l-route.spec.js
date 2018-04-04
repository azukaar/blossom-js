import 'blossom-js-server-side';
import '../modules/index';


describe('L-route component', () => {
  test('Hide content when not matched', () => {
    const template = `
    Are you a <l-a href="'/girl'">girl</l-a> or a <l-a href="'/boy'">boy</l-a> ?
    <l-route l-path="/girl">cute</l-route>
    <l-route l-path="/boy">cool</l-route>`;

    // eslint-disable-next-line no-undef
    const rendered = BlossomRender(template);

    expect(rendered.textContent).not.toMatch(/cute/);
    expect(rendered.textContent).not.toMatch(/cool/);
  });
});
