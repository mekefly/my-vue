import { isObject, isString } from "@wormery/utils";

export function filterOutNull<A extends any[]>(arr: A): any[] {
  return arr.filter((item) => item !== null);
}
export function isText(v: any): v is Text {
  return isObject(v) && isString(v.wholeText);
}
