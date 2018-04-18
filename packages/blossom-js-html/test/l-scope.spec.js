import 'blossom-js-server-side';
import '../modules/l-if';
import '../modules/l-js';
import '../modules/l-scope';

describe('L-scope component', () => {
  test('Is able to set scope', () => {
    const template = `
        <div>
          <l-scope hello="world">
          </l-scope>
        </div>
      `;

    const rendered = BlossomRender(template);

    expect(rendered.children[0].getAttribute('l-scope')).toMatch('{"hello":"world"}');
  });

  test('Is able to set interpolate scope', () => {
    const template = `
        <div>
          <l-scope l-hello="1+1"></l-scope>
        </div>
      `;

    const rendered = BlossomRender(template);

    expect(rendered.children[0].getAttribute('l-scope')).toMatch('{"hello":2}');
  });

  test('Refresh parent', () => {
    const template = `
        <div>
          <l-scope message="hello world"></l-scope>
          <l-js>message</l-js>
        </div>
      `;

    const rendered = BlossomRender(template);

    expect(rendered.children[0].getAttribute('l-scope')).toMatch('{"message":"hello world"}');
    expect(rendered.querySelector('l-js').innerHTML).toMatch('hello world');
  });

  test('Can set scope function', () => {
    const template = `
        <div>
          <l-scope l-message="() => 'hello world'"></l-scope>
          <l-js>message()</l-js>
        </div>
      `;

    const rendered = BlossomRender(template);

    expect(rendered.querySelector('l-js').innerHTML).toBe('hello world');
  });

  test('Set Evenet listeners', () => {
    const template = `
          <l-if l-scope="{&quot;message&quot;:&quot;Hello World&quot;}" cond='true'>
            <l-scope l-changemessage='() => {message += " and the universe"}'></l-scope>
            <l-js>message</l-js>
            <button l-onclick='changemessage()'>change</button>
          </l-if>
        `;

    const rendered = BlossomRender(template);

    const evt = document.createEvent('MouseEvents');
    evt.initMouseEvent('click');
    rendered.querySelector('button').dispatchEvent(evt);

    expect(rendered.children[0].getAttribute('l-scope')).toMatch('Hello World and the universe');
  });
});
