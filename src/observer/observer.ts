import { Dep } from "./dep";
import { logStart, logEnd } from "../config";

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
      if (__DEV__) {
        logStart("observer:get");
      }

      dep.rely();

      config.get?.(target, p, receiver);

      if (__DEV__) {
        logEnd("observer:get");
      }
      return _v[p];
    },
    set(target, p, value, receiver) {
      if (_v[p] === value) {
        return true;
      }

      if (config?.deep && typeof value === "object") {
        //对传入的新值响应化
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
