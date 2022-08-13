import { Watcher } from "../observer/watcher";

export function watchEffect(callback: () => void) {
  const watcher = new Watcher(work);
  function work() {
    watcher.survey();
    callback();
    watcher.leave();
  }
  work();
}
export function watchEffectBind(callback: () => void) {
  const watcher = new Watcher(work);
  function work() {
    watcher.survey();
    callback();
    watcher.leave();
  }
  return work;
}
