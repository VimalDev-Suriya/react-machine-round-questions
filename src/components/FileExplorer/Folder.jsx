import { useState } from 'react';
import {
  VscFolder,
  VscFolderOpened,
  VscFile,
  VscNewFile,
  VscNewFolder,
  VscRemove
} from 'react-icons/vsc';

const Folder = (props) => {
  const { id, name, isFolder, items, updateNode, remove } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [inputField, setInputFeild] = useState({
    visible: false,
    isFolder: null,
  });
  const [inputFieldValue, setInputFeildValue] = useState('');

  const addNewFolder = (e, type) => {
    e.stopPropagation();

    setInputFeild({
      visible: true,
      isFolder: type === 'folder',
    });
    setIsOpen(true);
  };

  const onEnter = (e) => {
    if (e.keyCode === 13 && e.target.value) {
      updateNode({
        nodeId: id,
        name: e.target.value,
        isFolder: inputField.isFolder,
      });

      setInputFeild({
        visible: false,
        isFolder: null,
      });

      setInputFeildValue('');
    }
  };

  const removeNode = (id) => {
    remove(id)
  }

  return (
    <>
      {isFolder ? (
        <div className="folder" onClick={() => setIsOpen((prev) => !prev)}>
          {isOpen ? (
            <VscFolderOpened className="margin-right" />
          ) : (
            <VscFolder className="margin-right" />
          )}

          <span>{name}</span>

          {/* Additional functionalities [Add files & folders] */}
          <VscNewFile
            className="margin-left margin-right"
            onClick={(e) => addNewFolder(e, 'file')}
          />
          <VscNewFolder
            className="margin-right"
            onClick={(e) => addNewFolder(e, 'folder')}
          />
          <VscRemove className='margin-right' onClick={() => removeNode(id)} />
        </div>
      ) : (
        <div>
          <VscFile color="grey" className="margin-right" />
          <span>{name}</span>
          <VscRemove className='margin-left' onClick={() => removeNode(id)} />
        </div>
      )}

      <div className="margin-left">
        {inputField.visible ? (
          <div>
            {inputField.isFolder ? (
              <VscFolder className="margin-right" />
            ) : (
              <VscFile className="margin-right" />
            )}

            <input
              autoFocus={true}
              onBlur={() => {
                setInputFeild({
                  visible: false,
                  isFolder: null,
                });
              }}
              value={inputFieldValue}
              onKeyDown={(e) => onEnter(e)}
              onInput={(e) => setInputFeildValue(e.target.value)}
            />
          </div>
        ) : null}

        {/* Iterating over the list of subdocuments */}
        {items.length && isOpen
          ? items.map((item) => (
            <div key={item.id}>
              <Folder {...item} updateNode={updateNode} remove={remove} />
            </div>
          ))
          : null}
      </div>
    </>
  );
};

export default Folder;
