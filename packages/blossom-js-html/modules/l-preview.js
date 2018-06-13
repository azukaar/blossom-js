import { Component, register } from 'blossom-js-custom-element';

class PreviewComponent extends Component {
  render() {
    const toPreview = (node) => {
      for (let i = 0; i < node.childNodes.length; i += 1) {
        const n = node.childNodes[i];
        toPreview(n);

        if (n.nodeType === 3) {
          node.childNodes[i].textContent = node.childNodes[i].textContent.replace(/[.,/)(#!$%^&*;:[\]{}=\-_`~()\w]/g, '▌');
        } else if (n.tagName && n.tagName === 'IMG') {
          n.setAttribute('src', '../assets/placeholder.jpg');
        } else if (n.tagName && n.tagName.indexOf('L-') === 0) {
          const newDoc = document.createElement('span');

          if (n.tagName === 'L-LOOP') {
            for (let ind = 0; ind < 4; ind += 1) newDoc.innerHTML += node.childNodes[i].innerHTML;
          } else {
            newDoc.innerHTML = node.childNodes[i].innerHTML;
          }

          node.replaceChild(newDoc, node.childNodes[i]);
        }

        if (n.tagName) {
          // eslint-disable-next-line no-loop-func
          Array.from(n.attributes).forEach((att) => {
            if (att.name !== 'class') {
              n.removeAttribute(att.name);
            }
          });
        }
      }
      return node;
    };

    const temp = document.createElement('div');
    temp.innerHTML = this.props.children;
    return toPreview(temp).innerHTML;
  }
}

register({
  name: 'l-preview',
  element: PreviewComponent,
});
