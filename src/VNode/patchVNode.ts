import { isString } from "@wormery/utils";
import { isComponentInstance } from "../component/component";
import { VNode } from "./vnode";
export function patchVNode(
  vnode: VNode | string | null
): Array<HTMLElement | string | null> {
  if (!vnode) {
    return [];
  }
  if (isString(vnode)) {
    return [vnode];
  }
  const { type, children } = vnode;
  //如果type不存在,这里认为是空标签,空标签返回子元素
  if (!type) {
    const res: any[] = [];

    children.forEach((child) => {
      res.push(...patchVNode(child));
    });
    return res;
  }
  //如果是string，认为需要创建Elm
  if (isString(type)) {
    const el = createElement(vnode);
    if (!el) {
      return [];
    }

    children.forEach((child) => {
      el.append(
        ...(patchVNode(child).filter((item) => item !== null) as any[])
      );
    });

    return [el];
  }
  //如果是ComponentInstance的话要执行ComponentMount
  if (isComponentInstance(type)) {
    const vnode = type.vnode;
    if (!vnode) {
      return [];
    }
    return patchVNode(vnode);
  }
  return [];
}
function createElement(vnode: VNode): HTMLElement | null {
  const type = vnode.type;
  if (typeof type === "string") {
    const el = document.createElement(type);
    vnode.elm = el;
    setAttributes(vnode, el);
    return el;
  }
  return null;
}
function setAttributes(vnode: VNode, el: HTMLElement) {
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
