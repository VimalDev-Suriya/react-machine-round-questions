import { useState } from "react";
import Modal from "./Modal";

const Container = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Model</button>
      <Modal isOpen={isOpen} onClose={handleClose} title="Modal Header">
        <Modal.Header>
          <h2>MyHeader</h2>
        </Modal.Header>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates,
          necessitatibus.
        </p>
      </Modal>
    </div>
  );
};

export default Container;
