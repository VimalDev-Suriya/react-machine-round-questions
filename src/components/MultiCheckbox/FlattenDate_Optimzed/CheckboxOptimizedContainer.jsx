import { useState } from "react";
import { flattenNodes, checkboxData } from "../data";
import CheckboxOptimzed from "./CheckboxOptimzed";

const CheckboxOptimzedContainer = () => {
    const [checkboxes, setCheckboxes] = useState(flattenNodes(checkboxData));

    const handleCheck = (checked, id) => {
        setCheckboxes(prev => {
            const newState = {
                ...prev,
                [id]: {
                    ...prev[id],
                    isChecked: checked
                }
            }

            const topDown = (nodeClicked) => {
                if(!nodeClicked.childIds.length) return; 

                nodeClicked.childIds.forEach(id => {
                    const childrenNode = newState[id];

                    childrenNode['isChecked'] = checked;

                    if(childrenNode.childIds.length > 0) {
                        topDown(childrenNode);
                    }
                })
            }

            const bottomUp = (nodeChecked) => {
                const parentId = nodeChecked['parentIds'];

                const isAllChildChecked = newState[parentId]?.childIds.every(child => newState[child].isChecked);

                if(parentId){
                    newState[parentId].isChecked = isAllChildChecked;
                    bottomUp(newState[parentId])
                }
            }

            topDown(newState[id]);
            bottomUp(newState[id])

            return newState
        })
    }

    return <CheckboxOptimzed checkboxes={checkboxes} handleCheck={handleCheck} />
}

export default CheckboxOptimzedContainer;