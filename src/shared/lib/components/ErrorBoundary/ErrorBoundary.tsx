import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorPage } from '../../../pages';
import type { Nullable } from '../../types';

interface Props {
  children: ReactNode;
}

interface State {
  error: Nullable<Error>;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch = (error: Error, errorInfo: ErrorInfo): void => {
    console.group('Error boundary');
    console.error('Error: ', error);
    console.error('Error info: ', errorInfo);
    console.groupEnd();
  };

  render = (): ReactNode => {
    const { error } = this.state;
    const { children } = this.props;

    if (error) {
      return <ErrorPage error={error} />;
    }

    return children;
  };
}
