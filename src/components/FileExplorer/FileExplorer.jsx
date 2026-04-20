import { useState } from 'react';
import Folder from './Folder';
import './Folder.scss';
import { useTraverseTree } from '../../hooks/useTraverseTree';

const fileExplorer = {
  id: '1',
  name: 'root',
  isFolder: true,
  items: [
    {
      id: '2',
      name: 'src',
      isFolder: true,
      items: [
        {
          id: '3',
          name: 'components',
          isFolder: true,
          items: [
            {
              id: '4',
              name: 'main.jsx',
              isFolder: false,
              items: [],
            },
          ],
        },
      ],
    },
    {
      id: '5',
      name: 'index.html',
      isFolder: false,
      items: [],
    },
  ],
};

const FileExplorer = () => {
  const [folderTree, setFolderTree] = useState(fileExplorer);
  const { insertNode, removeNode } = useTraverseTree();

  const updateNode = ({ nodeId, name, isFolder }) => {
    const updatedTree = insertNode(folderTree, {
      nodeId,
      name,
      isFolder,
    });

    setFolderTree(updatedTree);
  };

  const remove = (nodeId) => {
    const updatedTree = removeNode(folderTree, nodeId);

    setFolderTree(updatedTree)
  }

  return <Folder {...folderTree} updateNode={updateNode} remove={remove} />;
};

export default FileExplorer;
