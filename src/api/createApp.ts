import { Setup } from "../component/component";
import { VNode } from "../VNode/vnode";
import { h } from "../VNode/h";
import { mount } from "../VNode/mount";
export function createApp(app: Setup | VNode) {
  const vnode = h(app);

  return {
    mount(el: HTMLElement | string) {
      if (!el) {
        return;
      }

      if (typeof el === "string") {
        const appContainer = document.querySelector(el);
        if (!appContainer) {
          return;
        }

        create(appContainer, vnode);
      } else {
        create(el, vnode);
      }
    },
  };
}
function create(el: Element, vnode: VNode) {
  mount(el, vnode);
}
