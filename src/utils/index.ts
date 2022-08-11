export function filterOutNull<A extends any[]>(arr: A): any[] {
  return arr.filter((item) => item !== null);
}
