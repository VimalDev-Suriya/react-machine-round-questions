import { useContext } from 'react';
import Toast from './Toast';
import { ToastContext } from './ToastContext';

const ToastContainer = () => {
  const { toasts, removeToast } = useContext(ToastContext);
  const position = 'top-right';

  const handleToastClose = (i) => {
    removeToast(i);
  };

  return (
    <div className={`toast-container toast-pos-${position}`}>
      {toasts.map((toast, idx) => (
        <Toast
          key={`toast-id-${idx}-${toast.message}`}
          {...toast}
          handleClick={handleToastClose}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
