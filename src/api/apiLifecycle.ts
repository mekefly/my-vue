import { AnyObject } from "../utils/index";
import { ComponentInstance, currentInstance } from "../component/component";

//hooks
export const LifecycleHooks = {
  BEFORE_MOUNT: Symbol("onBeforeMount"),
  MOUNTED: Symbol("onMounted"),
  BEFORE_UPDATE: Symbol("onBeforeUpdate"),
  UPDATED: Symbol("onUpdated"),
  BEFORE_UNMOUNT: Symbol("onBeforeUnmount"),
  UNMOUNTED: Symbol("onUnmounted"),
};

export const onBeforeMount = createHook(LifecycleHooks.BEFORE_MOUNT);
export const onMounted = createHook(LifecycleHooks.MOUNTED);
export const onBeforeUpdate = createHook(LifecycleHooks.BEFORE_UPDATE);
export const onUpdated = createHook(LifecycleHooks.UPDATED);
export const onBeforeUnmount = createHook(LifecycleHooks.BEFORE_UNMOUNT);
export const onUnmounted = createHook(LifecycleHooks.UNMOUNTED);

export const triggerBeforeMount = createTriggerHook(
  LifecycleHooks.BEFORE_MOUNT
);
export const triggerMounted = createTriggerHook(LifecycleHooks.MOUNTED);
export const triggerBeforeUpdate = createTriggerHook(
  LifecycleHooks.BEFORE_UPDATE
);
export const triggerUpdated = createTriggerHook(LifecycleHooks.UPDATED);
export const triggerBeforeUnmount = createTriggerHook(
  LifecycleHooks.BEFORE_UNMOUNT
);
export const triggerUnmounted = createTriggerHook(LifecycleHooks.UNMOUNTED);

export function createHook(type: string | symbol | number) {
  return (hook: () => any) => injectHook(type, hook);
}
export function createTriggerHook(type: string | symbol | number) {
  return (target: ComponentInstance) => triggerHook(type, target);
}

export function injectHook(
  type: symbol | string | number,
  hook: () => any,
  target: AnyObject | null = currentInstance
) {
  if (!target) {
    return;
  }
  const hooks: Function[] = target[type] ?? (target[type] = []);
  hooks.push(hook);
}

export function triggerHook(
  type: symbol | string | number,
  target: AnyObject | null
) {
  if (!target) {
    return;
  }

  const hooks: Function[] = target[type];
  if (!hooks) {
    return;
  }

  hooks.forEach((hook) => hook());
}
