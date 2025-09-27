/* eslint-disable react/function-component-definition */

import { type ComponentType } from 'react';
import { useLocation } from 'react-router-dom';

const withPage =
  <P extends object>(Component: ComponentType<P>) =>
  (props: P) => {
    const { pathname } = useLocation();

    return <Component key={pathname} {...props} />;
  };

export { withPage };
