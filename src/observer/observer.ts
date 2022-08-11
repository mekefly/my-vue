import { Dep } from "./dep";

export const isObserver = Symbol();

export function observer<T extends object>(
  v: T,
  config?: { deep?: boolean }
): T {
  const _v: any = v;
  _v[isObserver] = true as any;
  //深度
  if (config?.deep) {
    const keys = Object.keys(v);
    keys.forEach((key) => {
      const item = _v[key];
      //防循环 并 判断为object
      if (typeof item === "object" && !item[isObserver]) {
        _v[key] = observer(item, config);
      }
    });
  }

  const dep = new Dep();
  return new Proxy(v, {
    get(target, p) {
      dep.rely();
      return _v[p];
    },
    set(target, p, value, receiver) {
      dep.refresh();
      //对传入的新值响应化
      if (config?.deep && typeof value === "object") {
        observer(value);
      }
      _v[p] = value;
      return true;
    },
  });
}
