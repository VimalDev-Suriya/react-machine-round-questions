const Checkbox = (props) => {
    const {checkboxes, checkedObj, handleChange} = props;
    // * we cannot hanlde the state in here, because we cannot track them here, Always keep the presentational component as simple as that

    return checkboxes.map(item => {
        const {id, name, children} = item;

        return <div key={id} className="margin-left">
            <label>
                <input type="checkbox" checked={checkedObj[id] || false} onChange={(e)=>handleChange(e.target.checked, item)} />
                {name}
            </label>
    
            {
                children.length > 0 ? <Checkbox checkboxes={children} checkedObj={checkedObj} handleChange={handleChange}/> : null
            }
        </div>
    })
}

export default Checkbox