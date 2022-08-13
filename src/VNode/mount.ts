import { patchVNode } from "./patchVNode";
import { VNode } from "./vnode";

export function mount(
  parent: Element | null,
  newVNode: VNode | null,
  oldEls?: Array<Element | Text>,
  oldVNode?: VNode | null
): Array<Element | Text> {
  if (!parent) {
    return [];
  }

  const els = patchVNode(newVNode, parent, oldVNode);

  parent.append(...els);

  return els;
}
