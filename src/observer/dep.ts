import { watcher, Watcher, getWatcher } from "./watcher";
import { nextTick } from "../utils/index";
import { logStart, logEnd } from "../config";
let idx = 0;
export class Dep {
  constructor() {}

  id: number = idx++;
  watchers: Set<Watcher> = new Set();

  rely() {
    if (__DEV__) {
      logStart("Dep>rely");
    }
    const watcher = getWatcher();

    if (!watcher) {
      if (__DEV__) {
        logEnd("Dep>rely");
      }
      return;
    }

    watcher.deps.add(this);
    this.watchers.add(watcher);

    if (__DEV__) {
      logEnd("Dep>rely");
    }
  }
  refresh() {
    nextTick().then(() => {
      const watchers = this.watchers;

      this.watchers = new Set();

      watchers.forEach((watcher) => {
        watcher.deps.delete(this);
        watcher.refresh();
      });
    });
  }
}
