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
    this.watchers.forEach((watcher) => {
      watcher.refresh();
      watcher.deps.delete(this);
    });
    this.watchers.clear();
  }
}
