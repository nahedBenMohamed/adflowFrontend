import { BigPlusIcon, HideScrollbarMixin, TruncateMixin, type Nullable } from '@/shared';
import styled, { css } from 'styled-components';
import type { MailboxSignature } from '../../../../../../shared';
import { ControlButton } from '../../../Buttons/ControlButton/ControlButton';
import { MailboxSignaturesSidebarSkeleton } from '../MailboxSignaturesSidebarSkeleton/MailboxSignaturesSidebarSkeleton';

const Root = styled.div`
  width: 100%;
  max-width: 288px;
  max-height: 520px;

  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;

  overflow-x: hidden;

  ${HideScrollbarMixin}
`;

const SignatureItem = styled.li<{ $active: boolean }>`
  flex-shrink: 0;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  padding: 14px 16px;
  background-color: transparent;
  border-radius: var(--border-radius-block);
  border: 1px solid var(--graphite-graphite-120);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    color: var(--button-text-green-hover);

    border-color: var(--button-text-green-hover);
  }

  &:active {
    color: var(--button-text-green-active);

    border-color: var(--button-text-green-active);
  }

  ${p =>
    p.$active &&
    css`
      color: var(--button-text-green-active);

      border-color: var(--button-text-green-active);
    `}

  ${TruncateMixin}
`;

interface Props {
  loading: boolean;
  isAddMode: boolean;
  signatures: MailboxSignature[];
  activeSignatureId: Nullable<number>;
  handleAddButtonClick: () => void;
  handleSelectSignature: (id: number) => void;
}

const MailboxSignatureSidebar = (props: Props) => {
  const {
    loading,
    isAddMode,
    signatures,
    activeSignatureId,
    handleAddButtonClick,
    handleSelectSignature,
  } = props;

  return (
    <Root>
      <ControlButton
        active={isAddMode}
        Icon={<BigPlusIcon />}
        borderColor="var(--button-text-graphite-secondary-text)"
        onClick={handleAddButtonClick}
      />

      {loading ? (
        <MailboxSignaturesSidebarSkeleton />
      ) : (
        <List>
          {signatures.map(s => (
            <SignatureItem
              key={s.id}
              title={s.name}
              $active={activeSignatureId === s.id}
              onClick={() => handleSelectSignature(s.id)}
            >
              {s.name}
            </SignatureItem>
          ))}
        </List>
      )}
    </Root>
  );
};

export { MailboxSignatureSidebar };
