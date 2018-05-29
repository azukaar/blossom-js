import { Component, register } from 'blossom-js-custom-element';

class ValidationComponent extends Component {
  findParentForm() {
    let parentForm = this.parentElement;

    while (parentForm.parentElement) {
      if (parentForm.tagName === 'L-FORM') {
        return parentForm;
      }

      parentForm = parentForm.parentElement;
    }

    return parentForm;
  }

  onMount() {
    this.parentForm = this.findParentForm();
    const element = this.parentForm.querySelector(`#${this.props.for}`);
    element.addEventListener('change', () => this.refresh());
    element.addEventListener('input', () => this.refresh());
  }

  onUpdate() {
    if (this.parentForm.checkChildren) {
      this.parentForm.checkChildren();
    }
  }

  render() {
    const element = this.parentForm.querySelector(`#${this.props.for}`);
    if (this.props.test(element.value || '')) {
      return '';
    }
    return `<l-error>${this.props.children}</l-error>`;
  }
}

register({
  name: 'l-validation',
  element: ValidationComponent,
});
