import 'blossom-js-server-side';
import '../modules/l-if';
import '../modules/l-js';
import '../modules/l-ctx';

describe('L-ctx component', () => {
  test('Is able to set ctx', () => {
    const template = `
        <l-ctx hello="world">
        </l-ctx>
      `;

    const rendered = BlossomRender(template);

    expect(rendered.children[0].getAttribute('ctx')).toMatch('{"hello":"world"}');
  });

  test('Is able to set interpolate ctx', () => {
    const template = `
        <l-ctx l-hello="1+1"></l-ctx>
      `;

    const rendered = BlossomRender(template);

    expect(rendered.children[0].getAttribute('ctx')).toMatch('{"hello":2}');
  });

  test('Propagate ctx', () => {
    const template = `
        <l-ctx message="hello world">
          <l-js>this.ctx.message</l-js>
        </l-ctx>
      `;

    const rendered = BlossomRender(template);

    expect(rendered.children[0].getAttribute('ctx')).toMatch('{"message":"hello world"}');
    expect(rendered.querySelector('l-js').innerHTML).toMatch('hello world');
  });

  test('Can set ctx function', () => {
    const template = `
        <l-ctx message="() => 'hello world'">
          <l-js>this.ctx.message()</l-js>
        </l-ctx>
      `;

    const rendered = BlossomRender(template);

    expect(rendered.querySelector('l-js').innerHTML).toBe('hello world');
  });

  test('Set Evenet listeners', () => {
    const template = `
          <l-ctx message="Hello world"
                 changemessage="() => this.ctx.message += ' and the universe'">
            <l-js>this.ctx.message</l-js>
            <button l-onclick="() => this.ctx.changemessage()">change</button>
          </l-ctx>
        `;

    const rendered = BlossomRender(template);

    const evt = document.createEvent('MouseEvents');
    evt.initMouseEvent('click');
    rendered.querySelector('button').dispatchEvent(evt);

    expect(rendered.children[0].getAttribute('ctx')).toMatch('Hello world and the universe');
  });
});
