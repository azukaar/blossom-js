import createElement from '../modules/jsx';
import Component from '../modules/Component';
import { willRegisterAs } from '../modules/utils';

describe('JSX', () => {
  it('can create a div', () => {
    expect(createElement('div')).toBe('<div ></div>');
  });

  it('can add a prop', () => {
    expect(createElement('div', { name: 'test' })).toBe('<div name="test" ></div>');
  });

  it('can add props', () => {
    expect(createElement('div', { name: 'test', someWeirdString: '<"smtg">' })).toBe('<div name="test" someweirdstring="&lt;&quot;smtg&quot;&gt;" ></div>');
  });

  it('can add children', () => {
    const name = 'test';
    const result = createElement(
      'div',
      { name: 'test' },
      createElement(
        'hello',
        null,
        'hey',
      ),
      createElement(
        'world',
        null,
        'hey 2',
      ),
    );

    expect(result).toBe('<div name="test" ><hello >hey</hello><world >hey 2</world></div>');
  });

  it('can use class and for', () => {
    expect(createElement('div', { cssFor: 'test', className: 'smtg' })).toBe('<div for="test" class="smtg" ></div>');
  });

  it('can use styles', () => {
    expect(createElement('div', { style: { marginLeft: '1px' } })).toBe('<div style="margin-left: 1px;" ></div>');
  });

  it.skip('rebind functions', () => {
    expect(createElement('div', { onClick: () => console.log(123) })).toBe('<div ></div>');
  });

  it('can render unregistered', () => {
    class test extends Component {
      render() {
        return '123';
      }
    }
    expect(createElement(test)).toMatch(/^<no-name/);
  });

  it('can render clashing names', () => {
    @willRegisterAs('test-element')
    class test extends Component {
      render() {
        return '123';
      }
    }
    @willRegisterAs('test-element')
    class test2 extends Component {
      render() {
        return '456';
      }
    }
    expect(createElement(test)).toMatch(/^<test-element >/);
    expect(createElement(test2)).toMatch(/^<test-element-/);
  });
});
