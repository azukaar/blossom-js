/**
 * @jest-environment node
 */

import 'blossom-js-server-side';
import {
  Component,
  register,
  registerAs,
  defaultName,
} from '../modules/index';
import {
  IfComponent,
  WithLifeCycleMock,
  WithOnMountLifeCycleMock,
  WithOnUnMountLifeCycleMock,
  NoLifeCycle,
  MockAttributeAccessor,
  mockSetAttribute,
  mockRemoveAttribute,
  WithUpdateLifeCycleMock,
  mockRefresh,
} from './mocks';

describe('Blossom JS', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Create component', () => {
    test('Component should exist', () => {
      const ifComponent = document.createElement('l-if');

      expect(ifComponent.innerHTML).not.toBeUndefined();
      expect(ifComponent.refresh).not.toBeUndefined();
      expect(ifComponent.connectedCallback).not.toBeUndefined();
    });

    test('Component inherit from HTMLElement', () => {
      expect(Component.prototype instanceof HTMLElement).toBe(true);
    });

    test('has registration management', () => {

      // no name
      class test1 extends Component {}
      expect(test1.register()).toBe('no-name');

      // override
      class test2 extends Component {
      }
      test2.defaultName = 'test-name';
      expect(test2.register()).toBe('test-name');
      
      // default
      class test3 extends Component {
      }
      test3.defaultName = 'test-name';
      expect(test3.register('another-name')).toBe('another-name');

      // decorators
      @defaultName('test-decorator') 
      class test4 extends Component {
      }
      expect(test4.register()).toBe('test-decorator');
      
      // decorators
      @registerAs('test-decorator') 
      class test5 extends Component {
      }
      expect(test5.defaultName).toBe('test-decorator');
      expect(test5.register()).toBe('test-decorator');
      expect(test5.register('test-decorator-2')).toBe('test-decorator-2');
    });

    test('Component should register', () => {
      const element = document.createElement('l-if');
      element.setAttribute('l-cond', 'true');
      element.innerHTML = 'I am displayed';
      document.body.appendChild(element);
      element.connectedCallback();

      expect(element.innerHTML).toBe('I am displayed');
    });
  });

  describe('Render component', () => {
    test('Component should render recursively', () => {
      const template = `
              <l-if l-cond="true">
                  I am displayed
                  <l-if l-cond="false">
                      not me
                  </l-if>
              </l-if>
          `;

      const rendered = BlossomRender(template);

      expect(rendered.children[0].textContent).toMatch(/I am displayed/);
      expect(rendered.children[0].textContent).not.toMatch(/not me/);
    });

    test('Component should update class names', () => {
      const template = `
            <l-if l-class='"blue"' l-cond="true">
                <div l-class='"red"'>I am displayed</div>
            </l-if>
        `;

      const rendered = BlossomRender(template);

      expect(rendered.children[0].className).toMatch(/^blue$/);
      expect(rendered.querySelector('div').className).toMatch(/^red$/);
    });

    test('Component should use XPath', () => {
      const template = `
            <l-if l-class='"blue"' l-cond="true">
                <div l-value='"red"'>I am displayed</div>
                <div>I am displayed</div>
                <div blossom-component="true">
                  <div l-value='"blue"'>
                  </div>
                </div>
            </l-if>
        `;

      const rendered = BlossomRender(template);

      expect(rendered.children[0].className).toBe('blue');
      expect(rendered.querySelector('div').getAttribute('value')).toBe('red');
      // TODO
      // expect(rendered.querySelector('div[blossom-component]')
      // .querySelector('div').getAttribute('value')).not.toBe('blue');
    });
  });

  describe('Context', () => {
    test('set ctx', () => {
      const element = document.createElement('l-if');
      element.setCtx('test', 123);
      expect(element.ctx).toEqual({
        test: 123,
      });
    });

    it('doesn\'t update if no changes is made', () => {
      const result = BlossomRender('<test-refresh></test-refresh>');
      const element = result.querySelector('*');
      element.refresh = () => {
        mockRefresh();
      };
      element.setCtx('test', 1);
      expect(mockRefresh).toHaveBeenCalled();
      mockRefresh.mockReset();
      element.setCtx('test', 1);
      expect(mockRefresh).not.toHaveBeenCalled();
    });

    test('set ctx without overwritting it', () => {
      const element = document.createElement('l-if');
      element.setCtx('test', 123);
      element.setCtx('test2', 456);
      expect(element.ctx).toEqual({
        test: 123,
        test2: 456,
      });
    });

    test('set ctx  in the DOM', () => {
      const element = document.createElement('l-if');
      element.setCtx('test', 123);
      expect(element.getAttribute('ctx')).toEqual('{"test":123}');
    });

    test('set ctx in the DOM without overwritting it', () => {
      const element = document.createElement('l-if');
      element.setCtx('test', 123);
      element.setCtx('test2', 456);
      expect(element.getAttribute('ctx')).toEqual('{"test":123,"test2":456}');
    });

    test('Component should read upper ctx', () => {
      const template = `
              <div ctx='{"someBool": false, "someBool2": true}'>
                  <l-if l-cond="this.ctx.someBool">
                      I am not displayed
                  </l-if>
                  <l-if l-cond="this.ctx.someBool2">
                      I am displayed
                  </l-if>
              </l-if>
          `;

      const rendered = BlossomRender(template);

      expect(rendered.children[0].textContent).toMatch(/I am displayed/);
      expect(rendered.children[0].textContent).not.toMatch(/I am not displayed/);
    });
  });

  describe('Life cycle', () => {
    it('call onmount uppon mounting if available', () => {
      expect(() => BlossomRender('<test-no-onmount></test-no-onmount>')).not.toThrow();
      BlossomRender('<test-onmount></test-onmount>');
      expect(WithOnMountLifeCycleMock).toBeCalled();
    });

    it('call onunmount uppon unmounting if available', () => {
      expect(() => BlossomRender('<test-no-onmount></test-no-onmount>')).not.toThrow();
      const testElement = BlossomRender('<test-onmount></test-onmount>');
      testElement.querySelector('*').disconnectedCallback();
      expect(WithOnUnMountLifeCycleMock).toBeCalled();
    });

    it('call onUpdate uppon rendering if available', () => {
      expect(() => BlossomRender('<test-no-onmount></test-no-onmount>')).not.toThrow();
      BlossomRender('<test-onmount></test-onmount>');
      expect(WithUpdateLifeCycleMock).toBeCalled();
    });
  });

  describe('props', () => {
    test('Allow listing props', () => {
      const template = `
              <l-if l-cond="true">
                  <div>I am displayed</div>
              </l-if>
          `;

      const rendered = BlossomRender(template);

      expect(rendered.children[0].props).toEqual({
        cond: true,
      });
    });

    it('set props', () => {
      const element = document.createElement('l-if');
      element.setAttribute('test', 1);
      expect(element.getAttribute('test')).toBe('1');
    });

    it('removes props', () => {
      const element = document.createElement('l-if');
      element.setAttribute('test', 1);
      element.removeAttribute('test');
      expect(element.getAttribute('test')).toBe(null);
    });

    it('patches setAttribute', () => {
      const result = BlossomRender('<test-attributes></test-attributes>');
      const element = result.querySelector('*');
      const patchedSet = element.setAttribute.toString();
      expect(patchedSet).toContain('this.nativeSetAttribute(');
    });

    it('patches removeAttribute', () => {
      const result = BlossomRender('<test-attributes></test-attributes>');
      const element = result.querySelector('*');
      const patchedRemove = element.removeAttribute.toString();
      expect(patchedRemove).toContain('this.nativeRemoveAttribute(');
    });

    it('patched setAttribute calls native', () => {
      const result = BlossomRender('<test-attributes></test-attributes>');
      const element = result.querySelector('*');
      element.setAttribute('test', 1);
      expect(mockSetAttribute).toHaveBeenCalled();
    });

    it('patches removeAttribute calls native', () => {
      const result = BlossomRender('<test-attributes-remove test="1"></test-attributes-remove>');
      const element = result.querySelector('*');
      element.removeAttribute('test');
      expect(mockRemoveAttribute).toHaveBeenCalled();
    });

    it('patched setAttribute does not calls native if nothing changed', () => {
      const result = BlossomRender('<test-refresh></test-refresh>');
      const element = result.querySelector('*');
      element.refresh = () => {
        mockRefresh();
      };
      element.setAttribute('test', '1');
      expect(mockRefresh).toHaveBeenCalled();
      mockRefresh.mockReset();
      element.setAttribute('test', '1');
      expect(mockRefresh).not.toHaveBeenCalled();
    });

    it('patched removeAttribute does not calls native if doesnt exists', () => {
      const result = BlossomRender('<test-refresh></test-refresh>');
      const element = result.querySelector('*');
      element.refresh = () => {
        mockRefresh();
      };
      element.removeAttribute('test');
      expect(mockRefresh).not.toHaveBeenCalled();
      mockRefresh.mockReset();
      element.setAttribute('test', '1');
      element.removeAttribute('test');
      expect(mockRefresh).toHaveBeenCalled();
    });
  });
});
