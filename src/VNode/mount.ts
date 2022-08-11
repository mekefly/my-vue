import { filterOutNull } from "../utils";
import { patchVNode } from "./patchVNode";
import { VNode } from "./vnode";

export function mount(
  parent: HTMLElement,
  vnode: VNode,
  oldEls?: HTMLElement[]
): Array<HTMLElement | string> {
  if (!parent) {
    return [];
  }

  if (oldEls) {
    oldEls.forEach((el) => {
      el.remove();
    });
  }
  const els = patchVNode(vnode, parent);
  parent.append(...els);

  return els;
}
