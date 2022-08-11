import { watcher, Watcher } from "./watcher";
export class Dep {
  constructor() {}

  watchers: Set<Watcher> = new Set();

  rely() {
    if (!watcher) {
      return;
    }

    watcher.deps.add(this);
    this.watchers.add(watcher);
  }
  refresh() {
    const watchers = this.watchers;
    this.watchers = new Set();
    watchers.forEach((watcher) => {
      watcher.deps.delete(this);
      watcher.refresh();
    });
  }
}
