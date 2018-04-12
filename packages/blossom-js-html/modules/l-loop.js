import { BlossomComponent, BlossomRegister } from 'blossom-js-custom-element';

class LoopComponent extends BlossomComponent {
  render() {
    return this.state.from && this.state.from.map((value) => `<span ${this.scopeString(value, 'loop')}>${this.state.children}</span>`).join('');
  }
}

BlossomRegister({
  name: 'l-loop',
  element: LoopComponent,
});
