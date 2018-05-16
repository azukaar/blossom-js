import { BlossomComponent, BlossomRegister } from 'blossom-js-custom-element';

class ValidationComponent extends BlossomComponent {
  onMount() {
    const element = document.getElementById(this.props.for);
    element.addEventListener('change', () => this.refresh());
    element.addEventListener('input', () => this.refresh());
  }

  render() {
    if (this.props.for) {
      const element = document.getElementById(this.props.for);
      if (this.props.test(element.value || '')) {
        return '';
      }
      return `<l-error>${this.props.children}</l-error>`;
    }
    return '';
  }
}

BlossomRegister({
  name: 'l-validation',
  element: ValidationComponent,
});
