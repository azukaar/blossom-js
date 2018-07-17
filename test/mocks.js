import {
  Component,
  register,
} from '../modules/index';

/* eslint-disable class-methods-use-this */

class IfComponent extends Component {
  render() {
    if (this.props.cond) {
      return this.props.children;
    }
    return '';
  }
}

register({
  name: 'l-if',
  element: IfComponent,
});

const WithOnMountLifeCycleMock = jest.fn();
const WithOnUnMountLifeCycleMock = jest.fn();
const WithUpdateLifeCycleMock = jest.fn();
class WithLifeCycle extends Component {
  onMount() {
    WithOnMountLifeCycleMock();
  }
  onUnmount() {
    WithOnUnMountLifeCycleMock();
  }
  onUpdate() {
    WithUpdateLifeCycleMock();
  }
}

register({
  name: 'test-onmount',
  element: WithLifeCycle,
});

class NoLifeCycle extends Component {};

register({
  name: 'test-no-onmount',
  element: NoLifeCycle,
});

const mockSetAttribute = jest.fn();
const mockRemoveAttribute = jest.fn();

class MockAttributeAccessor extends Component {
  setAttribute() {
    mockSetAttribute();
  }
  removeAttribute() {
    mockRemoveAttribute();
  }
}

register({
  name: 'test-attributes',
  element: MockAttributeAccessor,
});

class MockAttributeRremove extends Component {
  removeAttribute() {
    mockRemoveAttribute();
  }
}

register({
  name: 'test-attributes-remove',
  element: MockAttributeRremove,
});

const mockRefresh = jest.fn();
class MockRefresh extends Component {
  refresh() {
    mockRefresh();
  }
}

register({
  name: 'test-refresh',
  element: MockRefresh,
});

export {
  IfComponent,
  WithOnMountLifeCycleMock,
  WithOnUnMountLifeCycleMock,
  WithUpdateLifeCycleMock,
  WithLifeCycle,
  NoLifeCycle,
  MockAttributeAccessor,
  mockSetAttribute,
  mockRemoveAttribute,
  MockRefresh,
  mockRefresh,
};
