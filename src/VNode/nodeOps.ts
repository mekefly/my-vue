export const nodeOps = {
  setText: (node: Node, text: string) => {
    node.nodeValue = text;
  },
};
