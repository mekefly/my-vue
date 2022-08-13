import { isNumber, isObject, isString, isSymbol } from "@wormery/utils";
import { Setup, createInstance, isSetup, Props } from "../component/component";
import { createText } from "./createNode";
import {
  VNode,
  isVNode,
  createElementVNode,
  createComponentVNode,
  createTextVNode,
  createFragmentVNode,
} from "./vnode";
export type HChildren = Array<VNode | string>;
export function h(
  type: string | VNode | Setup | null | undefined | number | object,
  props?: Props | null,
  ...children: HChildren
): VNode {
  //创建string节点
  const vnodeChildren = children
    .map((child) => {
      if (isVNode(child)) {
        return child;
      }
      if (child === null || child === undefined) {
        return;
      }
      return createTextVNode(child.toString());
    })
    .filter((item) => {
      return !!item;
    }) as any[];

  //片段节点
  if (!type) {
    return createFragmentVNode(vnodeChildren);
  }
  //如果川入vnode,就返回原有的vnode
  if (isVNode(type)) {
    return type;
  }
  //type是一个string就创建Element
  if (typeof type === "string") {
    return createElementVNode(type, props, vnodeChildren);
  }
  //如果传入一个setup函数
  if (isSetup(type)) {
    return createComponentVNode(type, props, vnodeChildren);
  }

  //这里理论不应该被调用，只是兜底
  //片段节点
  return createFragmentVNode(vnodeChildren);
}

function mergeVNode(newVnode: VNode, oldVnode: VNode) {}
