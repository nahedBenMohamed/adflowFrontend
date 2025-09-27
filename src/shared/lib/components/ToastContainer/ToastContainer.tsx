import { ToastContainer as Root } from 'react-toastify';

const toastContainerStyles = {
  width: 330,
  zIndex: 998,
  marginTop: 51,
  padding: 0,
};

const ToastContainer = () => {
  return (
    <Root
      limit={4}
      position="top-right"
      draggable={false}
      style={toastContainerStyles}
      className="workspace__ToastContainer"
    />
  );
};

export { ToastContainer };
