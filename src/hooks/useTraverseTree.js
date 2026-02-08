export const useTraverseTree = () => {
  const insertNode = (tree, { nodeId, name, isFolder }) => {
    // * base case for the recursive function
    if (tree.id === nodeId && tree.isFolder) {
      tree.items.unshift({
        id: new Date().getTime(),
        isFolder,
        name,
        items: [],
      });

      return tree;
    }

    const updatedTreeItems = tree.items.map((item) =>
      insertNode(item, { nodeId, name, isFolder }),
    );

    return {
      ...tree,
      items: updatedTreeItems,
    };
  };

  return {
    insertNode,
  };
};
