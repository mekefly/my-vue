import { Component } from "../component/component";
import { VNode } from "./vnode";

export function h(
  type: string | VNode | Component,
  props: { [key: string]: any },
  ...children: Array<string | VNode>
): VNode {
  return { type, props, children };
}
