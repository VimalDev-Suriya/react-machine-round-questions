export const useTraverseTree = () => {
  // * TC - O(nLogN) * logN
  // const insertNode = (tree, { nodeId, name, isFolder }) => {
  //   // * base case for the recursive function
  //   if (tree.id === nodeId && tree.isFolder) {
  //     const newNode = {
  //       id: new Date().getTime(),
  //       isFolder,
  //       name,
  //       items: [],
  //     };


  //     // * TC -> O(nlogN)
  //     // * Sorting the items
  //     // Folder first and Files next
  //     // Alphabetical order
  //     const updatedItems = [...tree.items, newNode].sort((a, b) => {
  //       // * Folders first
  //       if(a.isFolder && !b.isFolder) return -1;

  //       if(!a.isFolder && b.isFolder) return 1;

  //       // * Alphabetical
  //       if(a.name < b.name) return -1;

  //       if(a.name > b.name) return 1;

  //       return 0;
  //     })

  //     return {
  //       ...tree,
  //       items: updatedItems
  //     };
  //   }

  //   const updatedTreeItems = tree.items.map((item) =>
  //     insertNode(item, { nodeId, name, isFolder }),
  //   );

  //   return {
  //     ...tree,
  //     items: updatedTreeItems,
  //   };
  // };

  const insertNode = (tree, { nodeId, name, isFolder }) => {
    if (tree.id === nodeId && tree.isFolder) {
      const newNode = {
        id: new Date().getTime(),
        items: [],
        isFolder,
        name
      }

      const updatedItem = [];
      let inserted = false; // just to track if the element was already inserted

      // I am considering that the array was already sorted, So I am going to push the one single element into the already sorted array
      for (let i = 0; i < tree.items.length; i++) {
        if (!inserted) {
          // * First condition check -> 
          if (
            (isFolder && !tree.items[i].isFolder) ||
            (isFolder === tree.items[i].isFolder && name.localeCompare(tree.items[i].name) < 0)
          ) {
            updatedItem.push(newNode);
            inserted = true
          }
        }

        // Pushing the rest of the items
        updatedItem.push(tree.items[i]);
      }

      if (!inserted) updatedItem.push(newNode);

      return {
        ...tree,
        items: updatedItem
      }
    }

    const updatedTreeItems = tree.items.map(item => insertNode(item, { nodeId, name, isFolder }))

    return {
      ...tree,
      items: updatedTreeItems
    }
  }

  const removeNode = (tree, nodeId) => {
    if (tree.id === nodeId) return null;

    const updatedItems = tree.items.filter((node) => removeNode(node, nodeId))

    return {
      ...tree,
      items: updatedItems
    }
  }

  return {
    insertNode,
    removeNode
  };
};
