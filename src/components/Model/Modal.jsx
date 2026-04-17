import { createPortal } from "react-dom";
import "./Modal.scss";

const Modal = (props) => {
  const { isOpen, children, onClose, title } = props;

  console.log(children);

  if (!isOpen) return null;

  return createPortal(
    <>
      <div className="modal-backdrop" onClick={() => onClose()} />
      <div className="modal-wrapper">
        <div className="modal-header">
          <Modal.Header />
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer"></div>
      </div>
    </>,
    document.getElementById("modal-root"),
  );
};

Modal.Header = (props) => {
  const { title, onClose, children } = props;

  if (children) return <>{children}</>;

  return (
    <>
      <h2 className="modal-title">{title}</h2>
      <button className="modal-close" onClick={onClose}>
        X
      </button>
    </>
  );
};

export default Modal;
