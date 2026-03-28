import { useState } from 'react';
import {checkboxData as checkboxes, flattenNodes} from './data'
import Checkbox from './Checkbox';

const CheckboxContainer = () => {
    const [checkedObj, setIsChecked] = useState({});

    console.log(flattenNodes(checkboxes));

    const handleChange = (isChecked, item) => {
        setIsChecked(prev => {
            const newState = { ...prev, [item.id]: isChecked};

            const toggleDown = (node) => {
                if(!node.children) return;

                node.children.forEach(child => {
                    newState[child.id] = isChecked;

                    if(child.children) toggleDown(child);
                })
            }
            
            const findParent = (nodes, childId, parent = null) => {
                // For loop here will break once we found the element
                for(const node of nodes){
                    if(node.id === childId) {
                        return parent
                    }
                    
                    if(node.children.length > 0){
                        const found = findParent(node.children, childId, node);

                        if(found) {
                            return found;
                        }
                    }
                }
                
                return null;
            }
            
            const bottomUp = (nodes, id) => {
                const parent = findParent(nodes, id);
                
                if(parent){
                    const isAllChecked = parent?.children.every(c => newState[c.id])

                    newState[parent.id] = isAllChecked;
                    bottomUp(nodes, parent.id);
                }
            }
            
            // If parent checked, all of their child will be checked.
            toggleDown(item);
            // Check all parent
            bottomUp(checkboxes, item.id)

            return newState;
        })
    }

    return <Checkbox checkboxes={checkboxes} checkedObj={checkedObj} handleChange={handleChange} />
}

export default CheckboxContainer;