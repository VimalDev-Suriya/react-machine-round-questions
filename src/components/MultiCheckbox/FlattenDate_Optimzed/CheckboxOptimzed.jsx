const CheckboxOptimzed = (props) => {
    const {checkboxes, handleCheck} = props;

    return Object.keys(checkboxes).map(checkbox => {
        const {id, name, isChecked} = checkboxes[checkbox];

        return <div key={id}>
            <label>
                <input type="checkbox" checked={isChecked} onChange={(e) => handleCheck(e.target.checked, id)}/>
                {name}
            </label>
        </div>
    })
}

export default CheckboxOptimzed;