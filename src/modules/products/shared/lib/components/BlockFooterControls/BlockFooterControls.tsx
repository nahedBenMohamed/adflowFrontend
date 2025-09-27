import { PrimaryButton } from '@/shared';
import type { ReactNode } from 'react';
import styled from 'styled-components';

const Root = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const ControlsWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export interface BlockFooterApproveProps {
  title: string;
  visible?: boolean;
  loading?: boolean;
  disabled?: boolean;
  handler: () => void;
}

export interface BlockFooterCancelProps {
  title: string;
  disabled?: boolean;
  handler: () => void;
}

interface Props {
  approveProps: BlockFooterApproveProps;
  cancelProps: BlockFooterCancelProps;
  children?: ReactNode;
}

const BlockFooterControls = (props: Props) => {
  const {
    approveProps: {
      title: approveTitle,
      loading: approveLoading,
      visible: approveVisible,
      disabled: approveDisabled,
      handler: approveHandler,
    },
    cancelProps: { disabled: cancelDisabled, title: cancelTitle, handler: cancelHandler },
    children,
  } = props;

  const showApprove = approveVisible !== undefined ? approveVisible : true;

  return (
    <Root>
      {children}

      <ControlsWrapper>
        <PrimaryButton variant="empty" disabled={cancelDisabled} onClick={cancelHandler}>
          {cancelTitle}
        </PrimaryButton>

        {showApprove && (
          <PrimaryButton
            loading={approveLoading}
            disabled={approveDisabled}
            onClick={approveHandler}
          >
            {approveTitle}
          </PrimaryButton>
        )}
      </ControlsWrapper>
    </Root>
  );
};

export { BlockFooterControls };
