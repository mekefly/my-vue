import { Component } from "../component/component";

export interface VNode {
  type: string | VNode | Component;
  props: { [key: string]: any };
  children: Array<string | VNode>;
}
