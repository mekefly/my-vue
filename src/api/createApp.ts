import { Setup } from "../component/component";
import { VNode } from "../VNode/vnode";
import { h } from "../VNode/h";
import { mount } from "../VNode/mount";
export function createApp(app: Setup | VNode) {
  const vnode = h(app);

  const elm = vnode?.elm;
  return {
    mount(el: HTMLElement | string) {
      if (!el) {
        return;
      }
      console.log(el);

      if (typeof el === "string") {
        const appContainer = document.querySelector(el);
        if (!appContainer) {
          return;
        }
        mount(appContainer as any, vnode);
      } else {
        mount(el, vnode);
      }
    },
  };
}
