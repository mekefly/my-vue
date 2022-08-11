import { isObject } from "@wormery/utils";
import { VNode } from "../VNode";
import { watchEffect } from "../api/watchEffect";
import { mount } from "../VNode/mount";
export interface ComponentInstance {
  vnode: VNode | null;
  setup: Setup;
  render: Render;
  parentEl: null | HTMLElement;
  update(): void;
  $el: Array<HTMLElement | string>;
  ____isComponentInstance: true;
}
export function isComponentInstance(v: any): v is ComponentInstance {
  return isObject(v) && v.____isComponentInstance;
}

let instance: ComponentInstance | null = null;
export function getInstance(): ComponentInstance | null {
  return instance;
}
export function createInstance(
  setup: Setup,
  props: Props,
  children: Array<string | VNode>
): ComponentInstance {
  const _instance = {
    vnode: null,
    setup: setup,
    ____isComponentInstance: true,
  } as any;

  instance = _instance;
  const render = setup(props);
  instance = null;

  _instance.render = render;

  const update = () => {
    _instance.vnode = render?.();
    console.log(_instance.$el);

    _instance.$el = mount(_instance.parentEl, _instance.vnode, _instance.$el);
  };
  _instance.update = update;

  watchEffect(update);
  return _instance;
}
export type Setup = (props: Props) => Render;
export function isSetup(v: any): v is Setup {
  return typeof v === "function";
}

export type Props = { [key: string]: any };
export type Render = () => VNode | null | undefined;
