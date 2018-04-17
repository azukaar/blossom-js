import { BlossomComponent, BlossomRegister, BlossomInterpolate } from 'blossom-js-custom-element';

class ScopeComponent extends BlossomComponent {
  render() {
    let attrName = this.attributes[0].name;
    let value = this.getAttribute(attrName);

    if (attrName.match(/^l-/)) {
      attrName = attrName.slice(2);
      value = BlossomInterpolate(value, this.state.scope, this);
    }

    this.parentElement.state.scope[attrName] = value;
    return '';
  }
}

BlossomRegister({
  name: 'l-scope',
  element: ScopeComponent,
});
