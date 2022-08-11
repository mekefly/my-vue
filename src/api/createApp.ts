import { Setup, isSetup, isComponentInstance } from "../component/component";
import { VNode } from "../VNode/vnode";
import { h } from "../VNode/h";
import { isString } from "@wormery/utils";
import { patchVNode } from "../VNode/patchVNode";
import { filterOutNull } from "../utils";
export function createApp(app: Setup | VNode) {
  const vnode = h(app);

  const elm = vnode?.elm;
  return {
    mount(el: HTMLDivElement | string) {
      if (!el) {
        return;
      }
      console.log(el);

      if (typeof el === "string") {
        const appContainer = document.querySelector(el);
        if (!appContainer) {
          return;
        }
        mount(appContainer, vnode);
      } else {
        mount(el, vnode);
      }
    },
  };
}

function mount(parent: Element, vnode: VNode) {
  console.log(filterOutNull(patchVNode(vnode)));

  parent.append(...filterOutNull(patchVNode(vnode)));
}
