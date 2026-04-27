import { createPortal } from 'react-dom';
import './Modal.scss';
import { useEffect } from 'react';

const Modal = (props) => {
  const {
    isOpen,
    children,
    onClose,
    title,
    initialFocus,
    backdropClose = true,
    modalClosable = true,
  } = props;

  const modalContents = Array.isArray(children) ? children : [children];

  // * Like below can find the the Child component
  const hasHeaderComp = modalContents.some(
    (child) => child.type === Modal.Header,
  );

  // * This useEFfect will execute even if isOpen is false.
  // If you enable this, there will be the runtime error. because react will holds 2 different set of useEffect hooks presnet in it queue if isOpen is true.
  // 1. below one (by default)
  // 2. bigger code useEffect
  // Why there is 2 useEFfcet conditionally, because i have added the guard code for isOpen
  // useEffect(() => {
  //   console.log("Modal Mounted even if the isOpen is actually false");
  // }, []);

  // * Why this useEffect has 'isOpen' in its dependency array?
  useEffect(() => {
    // * To get the current focusable element and focuing the focus back to them once modal was closed
    const currentActiveElement = document.activeElement;

    const handleKeydown = (e, firstElement, lastElement) => {
      if (e.key === 'Tab') {
        // Shift + Tab
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault(); // if we are not providing this, though we are forcing the browser - but browser will still have the capability to overcome our code, because browser will execute its functionality after our code.
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    if (isOpen) {
      initialFocus
        ? document.querySelector(initialFocus)?.focus()
        : document.querySelector('.modal-wrapper')?.focus();

      // * not selector is like a function and attributes can be selected by [attribute-name="attribute-value"]
      const focusableItems = document
        .querySelector('.modal-wrapper')
        .querySelectorAll("button, a[href], [tabIndex]:not([tabIndex='-1'])");

      const firstElement = focusableItems[0];
      const lastElement = focusableItems[focusableItems.length - 1];

      console.log('code executed under isOpen useEffect');
      document
        .querySelector('.modal-wrapper')
        .addEventListener('keydown', (e) => {
          handleKeydown(e, firstElement, lastElement);
        });
    }

    return () => {
      currentActiveElement.focus();

      // Cleaning the event Listener, because they memory leak will happen since they are actually clousered
      document
        .querySelector('.modal-wrapper')
        ?.removeEventListener('keydown', handleKeydown);
    };
  }, [isOpen]);

  // * Why can't we have the below line before the actual JSX or why dont we move this to below useEffect
  // Ans:
  // because we know we are exceuting the component at parent level, we are returning null only inside the component, so from react standpoint component if we move this line below useEffect, we can see the useEffect will be registered and it will execute post painting the DOM. In that case I should add the isOpen as the dependency for useEffect (which i have done)
  // If the below line was implemented above useEffect we dont need to add isOpen to its dependecy array
  if (!isOpen) return null;

  return createPortal(
    <>
      <div
        className="modal-backdrop"
        onClick={() => backdropClose && modalClosable && onClose()}
      />
      <div className="modal-wrapper" tabIndex={-1}>
        {title && !hasHeaderComp ? (
          <div className="modal-header">
            <h2 className="modal-title">{title}</h2>
            {modalClosable ? (
              <button
                className="modal-close"
                onClick={() => modalClosable && onClose()}
              >
                X
              </button>
            ) : null}
          </div>
        ) : null}
        {children}
        <div className="modal-footer"></div>
      </div>
    </>,
    document.getElementById('modal-root'),
  );
};

// Modal.Header = (props) => {
//   const { children } = props;

//   return (
//     <div className="modal-header">
//       <div className="modal-title">{children}</div>
//     </div>
//   );
// };

export default Modal;
