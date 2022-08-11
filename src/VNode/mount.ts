import { isString } from "@wormery/utils";
import { filterOutNull, isText } from "../utils";
import { patchVNode } from "./patchVNode";
import { VNode } from "./vnode";

export function mount(
  parent: HTMLElement,
  vnode: VNode,
  oldEls?: Array<HTMLElement | Text>
): Array<HTMLElement | string> {
  if (!parent) {
    return [];
  }

  if (oldEls) {
    oldEls.forEach((el) => {
      if (isText(el)) {
        parent.removeChild(el);
      } else {
        el.remove();
      }
    });
  }
  const els = patchVNode(vnode, parent);
  parent.append(...els);

  return els;
}
