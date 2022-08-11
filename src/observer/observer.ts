import { Dep } from "./dep";

export const isObserver = Symbol();

export function observer<T extends object>(
  v: T,
  config: {
    deep?: boolean;
    set?: ProxyHandler<T>["set"];
    get?: ProxyHandler<T>["get"];
  } = {}
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
    get(target, p, receiver) {
      dep.rely();

      config.get?.(target, p, receiver);
      return _v[p];
    },
    set(target, p, value, receiver) {
      //对传入的新值响应化
      if (config?.deep && typeof value === "object") {
        _v[p] = observer(value);
      } else {
        _v[p] = value;
      }

      dep.refresh();

      config.set?.(target, p, value, receiver);
      return true;
    },
  });
}
