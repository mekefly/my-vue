import { isObject, isString } from "@wormery/utils";

export function filterOutNull<A extends any[]>(arr: A): any[] {
  return arr.filter((item) => item !== null);
}
export function isText(v: any): v is Text {
  return isObject(v) && isString(v.wholeText);
}
/**
 * 传入n个参数，返回传入的参数，不同的是，返回的值将拥有和第一个参数相同的类型
 *
 * @export
 * @template T
 * @template REST
 * @param {T} target
 * @param {...REST} rest
 * @return {*}  {[T, ...{ [key in keyof REST]: T }]}
 */
export function sameType<T, REST extends any[]>(
  target: T,
  ...rest: REST
): [T, ...{ [key in keyof REST]: T }] {
  return [target, ...rest] as any;
}
export type AnyObject = {
  [key: string | symbol]: any;
};
export function isObjEqual(o1: AnyObject, o2: AnyObject) {
  var props1 = Object.getOwnPropertyNames(o1);
  var props2 = Object.getOwnPropertyNames(o2);
  if (props1.length != props2.length) {
    return false;
  }
  for (var i = 0, max = props1.length; i < max; i++) {
    var propName = props1[i];
    if (o1[propName] !== o2[propName]) {
      return false;
    }
  }
  return true;
}

export function syncObj(target: AnyObject, newValue: AnyObject) {
  const targetKeySet = new Set(Object.keys(target));
  const newValueKeys = Object.keys(newValue);
  //更新
  newValueKeys.forEach((key) => {
    target[key] = newValue[key];
    targetKeySet.delete(key);
  });
  //删除多余
  targetKeySet.forEach((key) => {
    delete target[key];
  });
}
let tickList: Array<() => any> = [];
let ticked = false;
export function nextTick(callback?: () => any): Promise<undefined> {
  const p = new Promise<undefined>((result) => {
    tickList.push(result as any);
    if (callback) {
      tickList.push(callback);
    }
  });

  if (ticked) {
    return p;
  }
  ticked = true;
  setTimeout(() => {
    ticked = false;
    const _tickList = tickList;
    tickList = [];
    _tickList.forEach((cb) => cb());
  }, 0);
  return p;
}
