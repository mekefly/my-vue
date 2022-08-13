import { AnyObject } from "./utils/index";
export function log(text: string, type?: string) {
  if (__DEV__) {
    if (!type) {
      return;
    }

    if (logConfig[type] || logConfig["all"]) console.log(type, text);
  }
}
export function logStart(type: string) {
  if (__DEV__) {
    if (logConfig["all"] || logConfig[type]) console.group(type);
  }
}
export function logEnd(type: string) {
  if (__DEV__) {
    if (logConfig["all"] || logConfig[type]) {
      console.groupEnd();
    }
  }
}

export const logConfig: AnyObject = {};
export function setLogConfig(key: string, value: Boolean = true) {}
