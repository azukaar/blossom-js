import { BlossomComponent, BlossomRegister, BlossomInterpolate } from 'blossom-js-custom-element';

class ScriptComponent extends BlossomComponent {
  updateChildren(children) {
    if (!this.props.children) {
      this.props.children = children;
    }
  }

  render() {
    BlossomInterpolate(this.props.children, this.props.scope, this);
    return '';
  }
}

BlossomRegister({
  name: 'l-script',
  element: ScriptComponent,
});
