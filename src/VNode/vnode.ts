import { isArray, isObject, isString } from "@wormery/utils";
import { createInstance, isSetup } from "../component/component";
import { AnyObject } from "../utils/index";
import { observer } from "../observer/observer";
import {
  ComponentInstance,
  Props,
  Setup,
  isComponentInstance,
} from "../component/component";

const textVNode = Symbol();
export interface VNode {
  type: string | Setup | null | symbol;
  parentEl?: Element | null;
  el: Element | Text | null | Array<Element | Text>;
  ____VNODE: true;
}

export interface FragmentVNode extends VNode {
  type: null;
  el: Array<Element | Text> | null;
  children: Array<VNode>;
  ____FragmentVNode: true;
}
export function createFragmentVNode(children: Array<VNode>): FragmentVNode {
  return {
    type: null,
    el: null,
    children,
    ____VNODE: true,
    ____FragmentVNode: true,
  };
}
export function isFragmentVNode(v: AnyObject): v is FragmentVNode {
  return Boolean(v.____FragmentVNode);
}
export function isElementVNode(v: AnyObject): v is ElementVNode {
  return Boolean(v.____ElementVNode);
}

export interface ElementVNode extends VNode {
  type: string;
  el: Element | null;
  children: Array<VNode>;
  props: Props | null;
  ____ElementVNode: true;
}

export function createElementVNode(
  type: string,
  props: Props | null = null,
  children: Array<VNode>
): ElementVNode {
  return {
    type,
    el: null,
    ____VNODE: true,
    children,
    props,
    ____ElementVNode: true,
  };
}
export function isTextVNode(v: AnyObject): v is TextVNode {
  return v.type === textVNode;
}
export interface TextVNode extends VNode {
  type: symbol;
  text: string;
  el: Text | null;
}
export function createTextVNode(text: string): TextVNode {
  return { type: textVNode, text, el: null, ____VNODE: true };
}
export interface ComponentVNode extends VNode {
  type: Setup;
  props: Props;
  children: VNode[];
  instance?: null | ComponentInstance;
  ____ComponentVNode: true;
}
export function isComponentVNode(v: AnyObject): v is ComponentVNode {
  return !!v.____ComponentVNode;
}
export function createComponentVNode(
  setup: Setup,
  props: Props | null | undefined,
  children: VNode[]
): ComponentVNode {
  return {
    type: setup,
    props: props ?? {},
    children,
    el: null,
    instance: null,
    ____VNODE: true,
    ____ComponentVNode: true,
  };
}
export function isVNode(v: any): v is VNode {
  if (typeof v === "object" && v.____VNODE) {
    return true;
  }
  return false;
}
export function setEl(
  v: any,
  el: Node | Text | Element | Array<Element | Text>
): void {
  v.el = el;
}
export function replaceWithEl(
  v: VNode,
  addEl: Array<Element | Text> | Element | Text | null
) {
  if (!addEl) {
    removeEl(v);
    return;
  }
  let addElList: Array<Element | Text>;
  if (isArray(addEl)) {
    addElList = addEl;
  } else {
    addElList = [addEl];
  }
  const { el } = v;
  if (!el) {
    return;
  }
  if (isArray(el)) {
    if (el.length <= 0) {
      return;
    }
    el[0].replaceWith(...addElList);
    el.forEach((el) => el.remove());
    v.el = null;
    return;
  }
  el.replaceWith(...addElList);
  v.el = null;
}
export function removeEl(v: VNode) {
  const { el } = v;
  if (!el) {
    return;
  }
  if (isArray(el)) {
    el.forEach((el) => el.remove());
    v.el = null;
    return;
  }
  el.remove();
  v.el = null;
}
enum VNodeType {
  TextVNode,
  ElementVNode,
  ComponentInstance,
  FragmentVNode,
}
export function vnodeTypeof(vnode: VNode): VNodeType | null {
  if (isTextVNode(vnode)) {
    return VNodeType.TextVNode;
  }
  if (isElementVNode(vnode)) {
    return VNodeType.ElementVNode;
  }
  if (isComponentVNode(vnode)) {
    return VNodeType.ComponentInstance;
  }
  if (isFragmentVNode(vnode)) {
    return VNodeType.FragmentVNode;
  }
  return null;
}
export function isSameType(v1: any, v2: any) {
  return vnodeTypeof(v1) == vnodeTypeof(v2);
}
