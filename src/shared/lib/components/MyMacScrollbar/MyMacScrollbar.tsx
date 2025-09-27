import { MacScrollbar, type MacScrollbarProps } from 'mac-scrollbar';
import type { ReactNode } from 'react';

interface Props extends MacScrollbarProps {
  children: ReactNode;
}

const MyMacScrollbar = (props: Props) => {
  const { children, ...rest } = props;

  return <MacScrollbar {...rest}>{children}</MacScrollbar>;
};

export { MyMacScrollbar };
