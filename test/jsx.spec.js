import createElement from '../modules/jsx';

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
});
