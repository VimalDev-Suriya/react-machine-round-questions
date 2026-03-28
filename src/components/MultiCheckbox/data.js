export const checkboxData = [
    {
        id: '1',
        name: "Fruits",
        children: [
            {
                id: "1-1",
                name: "Citrus",
                children: [
                    {
                        id: "1-1-1",
                        name: 'Lemon',
                        children: []
                    }, 
                    {
                        id: "1-1-2",
                        name: "Orange",
                        children: []
                    }
                ]
            },
            {
                id: '1-2',
                name: 'Berries',
                children: [
                    {
                        id: '1-2-1',
                        name: "Strawberry",
                        children: []
                    },
                    {
                        id: "1-2-2",
                        name: "BlueBerry",
                        children: []
                    }
                ]
            }
        ]
    }
]

export const flattenNodes = (nodes, parentId = null, map={}) => {
    nodes.forEach((node) => {
        // getting all direct child id's
        const childIds = node.children?.map(n => n.id);

        map[node.id] = {
            id: node.id,
            name: node.name,
            childIds: childIds,
            parentIds: parentId,
            isChecked: false,
        }

        if(node.children.length > 0) {
            flattenNodes(node.children, node.id, map);
        }
    })

    return map;
}