import { BlossomComponent, BlossomRegister } from 'blossom-js-custom-element';

class GetComponent extends BlossomComponent {
  render() {
    let result = '';
    Object.keys(this.props).forEach((name) => {
      result += ` ${this.ctx[name]}`;
    });

    return result;
  }
}

BlossomRegister({
  name: 'l-get',
  element: GetComponent,
});
