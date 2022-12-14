import { Dep } from "./dep";

export let watcher: Watcher | null | undefined;
const room: Array<null | Watcher | undefined> = [];
export function getWatcher(): Watcher | null | undefined {
  return watcher;
}
let idx = 0;
export class Watcher {
  constructor(callback: () => void) {
    this.callback = callback;
  }
  id: number = idx++;
  callback: () => void;

  deps: Set<Dep> = new Set();

  refresh() {
    this.callback();
  }
  survey() {
    room.push(watcher);

    watcher = this;
  }
  leave() {
    watcher = room.pop();
  }
}
