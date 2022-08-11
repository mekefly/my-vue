import { isObject } from "@wormery/utils";
import { VNode } from "../VNode";
import { watchEffect } from "../api/watchEffect";
export interface ComponentInstance {
  vnode: VNode | null;
  setup: Setup;
  render: Render;
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

  watchEffect(() => {
    _instance.vnode = render?.();
  });
  return _instance;
}
export type Setup = (props: Props) => Render;
export function isSetup(v: any): v is Setup {
  return typeof v === "function";
}

export type Props = { [key: string]: any };
export type Render = () => VNode | null | undefined;
