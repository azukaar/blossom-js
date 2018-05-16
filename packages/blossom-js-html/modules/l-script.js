import { BlossomComponent, BlossomRegister, BlossomInterpolate } from 'blossom-js-custom-element';

class ScriptComponent extends BlossomComponent {
  render() {
    BlossomInterpolate(this.props.children, this);
    return '';
  }
}

BlossomRegister({
  name: 'l-script',
  element: ScriptComponent,
});
