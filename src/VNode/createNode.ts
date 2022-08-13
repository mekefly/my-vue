import { ComponentVNode, ElementVNode, TextVNode, setEl } from "./vnode";

/**
 * 创建text节点
 *
 * @param {TextVNode} textVNode
 * @return {*}  {Text}
 */
export function createText(textVNode: TextVNode): Text {
  const textNode = document.createTextNode(textVNode.text);
  setEl(textVNode, textNode);
  return textNode;
}
/**
 * 创建element节点
 *
 * @param {(ElementVNode | ComponentVNode)} vnode
 * @return {*}  {(HTMLElement | null)}
 */
export function createElement(
  vnode: ElementVNode | ComponentVNode
): HTMLElement | null {
  const type = vnode.type;
  if (typeof type === "string") {
    const el = document.createElement(type);
    setAttributes(vnode, el);

    setEl(vnode, el);
    return el;
  }
  return null;
}

/**
 * 设置标签属性
 *
 * @param {(ElementVNode | ComponentVNode)} vnode
 * @param {HTMLElement} el
 * @return {*}
 */
function setAttributes(vnode: ElementVNode | ComponentVNode, el: HTMLElement) {
  const props = vnode.props;
  if (!props) {
    return;
  }
  const propsKeys = Object.keys(props);
  propsKeys.forEach((propsKey) => {
    const value = props[propsKey];
    if (propsKey === "class") {
      renderClass(value, el);
    }
    if (typeof value === "string") {
      el.setAttribute(propsKey, value);
      return;
    }
  });
}
/**
 * 生成class
 *
 * @param {*} value
 * @param {Element} el
 */
function renderClass(value: any, el: Element) {
  if (typeof value === "object") {
    let classList;
    if (Array.isArray(value)) {
      classList = value;
    } else {
      const classNames = Object.keys(value);
      classList = classNames.map((className) => {
        if (value[className]) {
          return className;
        }
      });
    }

    el.setAttribute("class", classList.join(" "));
  }
}
