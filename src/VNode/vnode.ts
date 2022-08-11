import { ComponentInstance, Setup } from "../component/component";

export interface VNode {
  type: string | ComponentInstance | null | undefined;
  props?: { [key: string]: any } | null;
  children: Array<string | VNode>;
  elm?: Element | null;
  ____VNODE: true;
}
export function isVNode(v: any): v is VNode {
  if (typeof v === "object" && v.____VNODE) {
    return true;
  }
  return false;
}
