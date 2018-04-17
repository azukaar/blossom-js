import { BlossomComponent, BlossomRegister } from 'blossom-js-custom-element';

class PreviewComponent extends BlossomComponent {
  onMount() {
    /* eslint-disable no-param-reassign */
    const toPreview = (node) => {
      for (let i = 0; i < node.childNodes.length; i += 1) {
        const n = node.childNodes[i];
        toPreview(n);

        if (n.nodeType === 3) {
          // eslint-disable-next-line no-useless-escape
          node.childNodes[i].textContent = node.childNodes[i].textContent.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\w]/g, '▌');
        } else if (n.tagName && n.tagName === 'IMG') {
          n.setAttribute('src', '../assets/placeholder.jpg');
        } else if (n.tagName && n.tagName.indexOf('L-') === 0) {
          node.removeChild(node.childNodes[i]);
          // replaceChild // node.childNodes[i].tagName = 'STRONG';
          // node.childNodes[i].textContent =
          // node.childNodes[i].textContent.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\w]/g, '▌');
          // console.log(node.childNodes[i])
        }
      }
      return node;
    };

    const _temp = document.createElement('div');
    _temp.innerHTML = this.props.children;
    this.props.children = toPreview(_temp).innerHTML;
    /* eslint-enable no-param-reassign */
  }
  render() {
    return this.props.children;
  }
}

BlossomRegister({
  name: 'l-preview',
  element: PreviewComponent,
});
