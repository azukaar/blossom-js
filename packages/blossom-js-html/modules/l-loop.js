import { BlossomComponent, BlossomRegister } from 'blossom-js-custom-element';

class LoopComponent extends BlossomComponent {
  updateChildren(children) {
    if (!this.props.children) {
      this.props.children = children;
    }
  }
  render() {
    return this.props.from && this.props.from.map((value) => `<span ${this.alisableScopeString(value, 'loop')}>${this.props.children}</span>`).join('');
  }
}

BlossomRegister({
  name: 'l-loop',
  element: LoopComponent,
});
