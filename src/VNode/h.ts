import { Setup, createInstance, isSetup } from "../component/component";
import { VNode, isVNode } from "./vnode";

export function h(
  type: string | VNode | Setup | null | undefined,
  props?: { [key: string]: any } | null,
  ...children: Array<string | VNode>
): VNode {
  if (typeof type === "string") {
    return { type, props, children, elm: null, ____VNODE: true };
  }

  if (isVNode(type)) {
    return type;
  }
  if (isSetup(type)) {
    const instance = createInstance(type, props ?? {}, children);

    return { type: instance, props, children, elm: null, ____VNODE: true };
  }
  return { type, props, children, elm: null, ____VNODE: true };
}

function mergeVNode(newVnode: VNode, oldVnode: VNode) {}
