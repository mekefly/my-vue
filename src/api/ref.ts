import { observer } from "../observer/observer";

export function ref<T>(value: T): Ref<T> {
  return observer({ value });
}
export interface Ref<T> {
  value: T;
}
