import { isObject } from "@wormery/utils";
import { VNode } from "../VNode";
import { watchEffectBind } from "../api/watchEffect";
import { mount } from "../VNode/mount";
import { AnyObject } from "../utils/index";
import { observer } from "../observer/observer";
import {
  triggerBeforeUpdate,
  triggerUpdated,
  triggerBeforeUnmount,
  triggerUnmounted,
} from "../api/apiLifecycle";
import { triggerBeforeMount, triggerMounted } from "../api/apiLifecycle";
import { removeEl } from "../VNode/vnode";
export interface ComponentInstance {
  vnode: VNode | null;
  props: AnyObject;
  setup: Setup;
  render: Render;
  parentEl: null | Element;
  update(): void;
  unmount(): void;
  $el: Array<Element | Text>;
  ____isComponentInstance: true;
}
export function isComponentInstance(v: any): v is ComponentInstance {
  return isObject(v) && v.____isComponentInstance;
}

export let currentInstance: ComponentInstance | null = null;
export function getCurrentInstance(): ComponentInstance | null {
  return currentInstance;
}
export function setupInstance(setup: Setup, props: Props) {
  const observerProps = observer({ ...props });
  const _instance = {
    vnode: null,
    setup: setup,
    props: observerProps,
    ____isComponentInstance: true,
  } as any;

  currentInstance = _instance;
  _instance.render = setup(observerProps);
  currentInstance = null;

  return _instance;
}
function setupUpdate(instance: ComponentInstance) {
  const update = () => {
    triggerBeforeUpdate(instance);
    const oldVNode = instance.vnode;
    instance.vnode = instance.render?.();
    instance.$el = mount(
      instance.parentEl,
      instance.vnode,
      instance.$el,
      oldVNode
    );

    triggerUpdated(instance);
  };
  instance.update = watchEffectBind(update);
}
export function createInstance(
  setup: Setup,
  props: Props,
  children: Array<string | VNode>,
  parentEl: Element | null = null
): ComponentInstance {
  const _instance = setupInstance(setup, props);

  setupUpdate(_instance);
  setupUnmount(_instance);

  _instance.parentEl = parentEl;

  triggerBeforeMount(_instance);
  _instance.update();
  triggerMounted(_instance);

  return _instance;
}
function setupUnmount(com: ComponentInstance) {
  com.unmount = () => {
    triggerBeforeUnmount(com);
    if (!com.vnode) return;

    removeEl(com.vnode);
    triggerUnmounted(com);
  };
}
export type Setup = (props: Props) => Render;
export function isSetup(v: any): v is Setup {
  return typeof v === "function";
}

export type Props = { [key: string]: any };
export type Render = () => VNode | null;
