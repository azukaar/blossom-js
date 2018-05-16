import { BlossomComponent, BlossomRegister } from 'blossom-js-custom-element';

class LoopComponent extends BlossomComponent {
  render() {
    return this.props.from && this.props.from.map((value) => `<span ${this.alisableCtxString(value, 'loop')}>${this.props.children}</span>`).join('');
  }
}

BlossomRegister({
  name: 'l-loop',
  element: LoopComponent,
});
