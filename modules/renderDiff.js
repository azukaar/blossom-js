import { nativeSetAttribute, nativeRemoveAttribute } from './convertElement';

function renderAttr(newDom, destination) {
  const changes = [];
  const length = Math.max(
    newDom.attributes.length,
    destination.attributes.length,
  );
  const newAttrList = Array.from(newDom.attributes).map(att => att.name);

  for (let i = 0; i < length; i += 1) {
    const newAttr = newDom.attributes[i];
    const destAttr = destination.attributes[i];

    if (typeof destAttr !== 'undefined' && newAttrList.indexOf(destAttr.name) === -1 && destAttr.name !== 'children') {
      changes.push(() => nativeRemoveAttribute(destination, destAttr.name));
    } else if (typeof newAttr !== 'undefined' && destination.getAttribute(newAttr.name) !== newAttr.value) {
      changes.push(() => nativeSetAttribute(destination, newAttr.name, newAttr.value));
    }
  }

  return changes;
}

function renderDiff(newDom, destination) {
  let changes = [];
  const length = Math.max(
    newDom.childNodes.length,
    destination.childNodes.length,
  );

  for (let i = 0; i < length; i += 1) {
    const newNode = newDom.childNodes[i];
    const destNode = destination.childNodes[i];

    if (typeof newNode === 'undefined') {
      changes.push(() => destination.removeChild(destNode));
    } else if (typeof destNode === 'undefined') {
      changes.push(() => destination.appendChild(newNode));
    } else if (
      newNode.tagName !== destNode.tagName ||
      newNode.nodeType !== destNode.nodeType
    ) {
      changes.push(() => destination.replaceChild(newNode, destNode));
    } else if (newNode.nodeType === window.Node.TEXT_NODE) {
      changes.push(() => { destNode.nodeValue = newNode.nodeValue; });
    } else if (newNode.nodeType === window.Node.ELEMENT_NODE) {
      const attrChanges = renderAttr(newNode, destNode);
      changes = changes.concat(attrChanges);

      if (typeof destNode.refresh === 'function' && (destNode.isMounted && attrChanges.length === 0)) {
        changes.push(() => destNode.refresh());
      } else if (typeof destNode.connectedCallback === 'function' && (!destNode.isMounted || attrChanges.length > 0)) {
        changes.push(() => destination.replaceChild(newNode, destNode));
      } else {
        changes = changes.concat(renderDiff(newNode, destNode));
      }
    }
  }

  return changes;
}

export {
  renderAttr,
  renderDiff,
};
