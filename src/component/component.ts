import { VNode } from "../vnode/vnode";
export interface ComponentInstance {
  VNode: VNode;
  setup: Component;
  render: Render;
}
export type Component = () => Render;

export type Props = {};
export type Render = (props: {}) => VNode | null | undefined;
