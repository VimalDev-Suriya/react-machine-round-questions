import { useEffect, useState } from 'react';
import AccordionItem from './AccordionItem';

const AccordionContainer = (props) => {
    const {children, allowMultiple } = props ?? {};
    const [isOpenIndices, setIsOpenIndices] = useState({});
    
    if(!children) return <p>No Items to render</p>
    
    const accordionItem = Array.isArray(children) ? children : [children];

    // * Used for the defacult open
    useEffect(() => {
        const openedAccordion = accordionItem.findIndex(accordion => {
            return accordion.props.expanded;
        })

        if(openedAccordion !== -1) setIsOpenIndices(
            {
                [openedAccordion]: true
            }
        )
    }, [])

    // * handling the active idex
    const handleClick = (idx) => {
        setIsOpenIndices(prev => {
            return {
               ...(allowMultiple ? prev : {}), // beacuse we need to maintain the data of already opened or existed node.
               [idx]: prev[idx] ? !prev[idx] : true // for single active accordion
            }
        })
    }
    
    return <div className="accordion-container">
        {
            accordionItem.map((item, idx) => {
                const {children, title, disabled} = item.props;

                return <div className="accordion-item" key={`${idx}-${title}`}>
                    <h3>
                        <button disabled={disabled} onClick={() => handleClick(idx)}>{title}</button>
                    </h3>

                    <div hidden={!isOpenIndices[idx]}>{children}</div>
                </div>
            })
        }
    </div>;
}

const Accordion = () => {
    return <div>
        <AccordionContainer allowMultiple >
            <AccordionItem title="title 1">
                <p>Content in Accordion 1</p>
            </AccordionItem>
            <AccordionItem title="title 2" disabled>
                <p>Content in Accordion 2</p>
            </AccordionItem>
            <AccordionItem title="title 3" expanded>
                <p>Content in Accordion 3</p>
            </AccordionItem>
        </AccordionContainer>
    </div>
}

export default Accordion;