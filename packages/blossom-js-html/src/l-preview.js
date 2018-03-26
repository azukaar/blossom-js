const {BlossomComponent, BlossomRegister} = require('blossom-js-custom-element');

class PreviewComponent extends BlossomComponent {
  onMount() {
    const toPreview = (node) => {
      for (let i = 0; i < node.childNodes.length; i++) {
        const n = node.childNodes[i];
        toPreview(n);

        if(n.nodeType === 3) {
            node.childNodes[i].textContent = node.childNodes[i].textContent.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\w]/g, '▌');
        }
        else if(n.tagName && n.tagName === 'IMG') {
            n.setAttribute('src', '../assets/placeholder.jpg');
        }
        else if(n.tagName && n.tagName.indexOf('L-') == 0) {
            node.removeChild(node.childNodes[i]);
            // replaceChild // node.childNodes[i].tagName = 'STRONG';
            // node.childNodes[i].textContent = node.childNodes[i].textContent.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\w]/g, '▌');
            // console.log(node.childNodes[i])
        }
      }
      return node;
    }

    const _temp = document.createElement('div');
    _temp.innerHTML = this.state.children;
    this.state.children = toPreview(_temp).innerHTML;
  }
  render() {
      return this.state.children;
  }
};

BlossomRegister({
    name : "l-preview",
    element: PreviewComponent,
    attributes : [
    ]
});

if(typeof module !== 'undefined' && module.exports) {
    module.exports = PreviewComponent;
}