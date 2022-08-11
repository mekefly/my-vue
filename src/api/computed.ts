import { Ref, ref } from "./ref";
import { observer } from "../observer/observer";
import { watchEffect } from "./watchEffect";

export function computed<T>(callback: () => T) {
  let isFirstGet = true;
  function firstGet() {
    isFirstGet = false;
    watchEffect(() => {
      cache.value = callback();
    });
  }

  const cache: Ref<T | undefined> = observer(
    { value: undefined },
    {
      deep: false,
      get: firstGet,
    }
  );
  return cache;
}
