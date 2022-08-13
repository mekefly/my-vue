import {
  ComponentVNode,
  FragmentVNode,
  ElementVNode,
  VNode,
  setEl,
  removeEl,
  replaceWithEl,
  vnodeTypeof,
  isTextVNode,
  isElementVNode,
  isFragmentVNode,
  isComponentVNode,
  isSameType,
} from "./vnode";
import { sameType, isObjEqual, syncObj } from "../utils/index";
import { createElement, createText } from "./createNode";
import { isArray } from "@wormery/utils";
import { nodeOps } from "./nodeOps";
import { createInstance } from "../component/component";

/**
 * diff算法
 *
 * @export
 * @param {(VNode | null)} nvn
 * @param {(Element | null)} parentEl
 * @param {(VNode | null)} [ovn]
 * @return {*}  {(Array<Element | Text>)}
 */
export function patchVNode(
  nvn: VNode | null,
  parentEl: Element | null,
  ovn?: VNode | null
): Array<Element | Text> {
  const { setText } = nodeOps;
  //分四块
  if (!nvn && !ovn) {
    //新的虚拟dom 不存在 旧的虚拟dom也不存在不存在

    //返回空element树
    return [];
  }
  //新的不存在旧的存在
  if (!nvn && ovn) {
    //删除node树

    if (isComponentVNode(ovn)) {
      ovn.instance?.unmount();
      return [];
    }
    removeEl(ovn);
    return [];
  }

  //如过新旧都存在就要diff查重了
  if (nvn && ovn) {
    //是同一类型的节点,比如当都是text节点，就查看内容是否一样
    if (isSameType(nvn, ovn)) {
      if (isTextVNode(nvn)) {
        const [nv, ov] = sameType(nvn, ovn);
        //当文本一样时不需要处理
        if (ov.text === nv.text) {
          if (!ov.el) {
            return [];
          }
          return [ov.el];
        }
        if (!ov.el) {
          return [];
        }
        const el = (nv.el = ov.el);

        setText(el, nv.text);

        return [el];
      }
      //isElementVNode
      if (isElementVNode(nvn)) {
        const [nv, ov] = sameType(nvn, ovn);
        return reuseCheck(nv, ov, ov.el);
      }
      //isComponentInstanceVNode
      if (isComponentVNode(nvn)) {
        const [nv, ov] = sameType(nvn, ovn);
        if (nv.type === ov.type) {
          const instance = (nv.instance = ov.instance);
          if (!instance) {
            return [];
          }
          syncObj(instance.props, nv.props);

          // return reuseCheck(nv, ov, parentEl);
          return [];
        } else {
          const instance = (nv.instance = createInstance(
            nv.type,
            nv.props,
            nv.children,
            parentEl
          ));
          const { $el: el } = instance;
          return el;
        }
      }

      //isFragmentVNode
      if (isFragmentVNode(nvn)) {
        const [nv, ov] = sameType(nvn, ovn);

        return reuseChildren(nv, ov, parentEl);
      }
      //托底
      return [];
    }
    const els = patchVNode(nvn, parentEl);
    if (isComponentVNode(nvn)) {
      nvn.instance?.unmount();

      removeEl(ovn);

      return els;
    }

    removeEl(ovn);
    if (isFragmentVNode(nvn)) {
      setEl(nvn, els);
    }

    return els;
  }
  //新的存在旧的不存在就是新建节点
  if (nvn && !ovn) {
    //text节点
    if (isTextVNode(nvn)) {
      const textNode = createText(nvn);
      return [textNode];
    }

    //空节点
    if (isFragmentVNode(nvn)) {
      const { children } = nvn;
      const res: any[] = [];

      children.forEach((child) => {
        res.push(...patchVNode(child, parentEl));
      });

      setEl(nvn, res);

      return res;
    }
    //如果type不存在,这里认为是空标签,空标签返回子元素
    if (isElementVNode(nvn)) {
      const { children } = nvn;
      //如果是string，认为需要创建Elm
      const el = createElement(nvn);
      if (!el) {
        return [];
      }
      setEl(nvn, el);

      children.forEach((child) => {
        el.append(...patchVNode(child, el));
      });

      return [el];
    }
    //如果是ComponentInstance的话要执行ComponentMount
    if (isComponentVNode(nvn)) {
      const instance = (nvn.instance = createInstance(
        nvn.type,
        nvn.props,
        nvn.children,
        parentEl
      ));

      const el = instance.$el;
      setEl(nvn, el);
      return el;
    }
  }
  return [];
}
/**
 * 主要通过props进行diff检查
 *
 * @template T
 * @param {T} nv
 * @param {T} ov
 * @param {(Element | null)} parent
 * @return {*}  {(Array<Element | Text>)}
 */
function reuseCheck<T extends ElementVNode | ComponentVNode>(
  nv: T,
  ov: T,
  parent: Element | null
): Array<Element | Text> {
  if (
    nv.props === ov.props ||
    (nv.props && ov.props && isObjEqual(nv.props, ov.props))
  ) {
    reuseChildren(nv, ov, parent);

    nv.el = ov.el;
    if (isArray(ov.el)) {
      return ov.el;
    }
    if (!ov.el) {
      return [];
    }

    return [ov.el];
  } else {
    //在dom树上卸载
    removeEl(ov);

    const el = createElement(nv);
    if (!el) {
      return [];
    }
    setEl(nv, el);
    reuseChildren(nv, ov, el);
    return [el];
  }
}
/**
 * 给子节点进行diff检查
 *
 * @template T
 * @param {T} nv
 * @param {T} ov
 * @param {(Element | null)} [parent=null]
 * @return {*}
 */
function reuseChildren<T extends ElementVNode | ComponentVNode | FragmentVNode>(
  nv: T,
  ov: T,
  parent: Element | null = null
): Array<Element | Text> {
  if (!parent) {
    return [];
  }
  const allEls: any[] = [];

  //props相同就会复用当前的dom，然后会再将子dom进行判断是否复用
  const nvChildren = nv.children;
  const ovChildren = ov.children;
  for (let i = 0; i < Math.max(ov.children.length, nv.children.length); i++) {
    const nvChild = nvChildren[i];
    const ovChild = ovChildren[i];
    const els = patchVNode(nvChild, parent, ovChild);

    parent?.append(...els);
    allEls.push(...els);
  }

  setEl(nv, allEls);
  return allEls;
}
