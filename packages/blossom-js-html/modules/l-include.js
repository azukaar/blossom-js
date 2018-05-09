import { BlossomComponent, BlossomRegister } from 'blossom-js-custom-element';

class IncludeComponent extends BlossomComponent {
  onMount() {
    this.props.loading = true;

    fetch(this.props.url)
      .then((res) => res.text())
      .then((res) => {
        this.innerHTML = res;
        this.props.loading = false;
      });
  }

  render() {
    if (this.props.loading) {
      return `Loading...`;
    }

    return this.props.children;
  }
}

BlossomRegister({
  name: 'l-include',
  element: IncludeComponent,
});
