import { useEffect, useState, type ReactNode } from 'react';
import ReactDOM from 'react-dom';

interface Props {
  children: ReactNode;
  disableBodyOverflow?: boolean;
}

const Portal = (props: Props) => {
  const { children, disableBodyOverflow = true } = props;

  const [container] = useState(() => document.createElement('div'));

  useEffect(() => {
    if (disableBodyOverflow) document.body.style.overflow = 'hidden';

    document.body.appendChild(container);

    return () => {
      if (disableBodyOverflow) document.body.style.removeProperty('overflow');

      document.body.removeChild(container);
    };
  }, [container, disableBodyOverflow]);

  return ReactDOM.createPortal(children, container);
};

export { Portal };
