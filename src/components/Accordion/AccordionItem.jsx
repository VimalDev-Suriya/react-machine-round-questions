const AccordionItem = (props) => {
    const {children, title, expanded, disabled} = props;

    return <div title={title} expanded={expanded}>
        {children}
    </div>
}

export default AccordionItem;