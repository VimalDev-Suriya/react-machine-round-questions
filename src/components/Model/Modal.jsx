import { createPortal } from "react-dom";
import "./Modal.scss";
import { useEffect } from "react";

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

  const hasHeaderComp = modalContents.some(
    (child) => child.type === Modal.Header,
  );

  useEffect(() => {
    const activeElement = document.activeElement;
    const handleKeydown = (e, firstElement, lastElement) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
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
        : document.querySelector(".modal-wrapper")?.focus();

      const focusableItems = document
        .querySelector(".modal-wrapper")
        .querySelectorAll("button, a[href], [tabIndex]:not([tabIndex='-1'])");

      const firstElement = focusableItems[0];
      const lastElement = focusableItems[focusableItems.length - 1];

      document
        .querySelector(".modal-wrapper")
        .addEventListener("keydown", (e) => {
          handleKeydown(e, firstElement, lastElement);
        });
    }

    return () => {
      activeElement.focus();
      document
        .querySelector(".modal-wrapper")
        ?.removeEventListener("keydown", handleKeydown);
    };
  }, [isOpen]);

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
    document.getElementById("modal-root"),
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
