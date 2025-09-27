import { SpanWithEllipsis, truncateNumber } from '@/shared';
import styled, { css } from 'styled-components';
import type { MailboxFolderType } from '../../../../shared';
import { getIconByFolderType } from '../../../../shared';

const Root = styled.li<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 12px 16px;
  padding-left: 32px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
  transition: var(--transition-200);

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    background-color: var(--graphite-graphite-20);
  }

  &:active {
    color: var(--button-text-green-active);

    svg path {
      fill: var(--button-text-green-active);
    }
  }

  ${p =>
    p.$active &&
    css`
      color: var(--button-text-green-active);

      svg path {
        fill: var(--button-text-green-active);
      }
    `}
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;
`;

const TitleWrapper = styled.div`
  max-width: 172px;

  display: flex;
  align-items: center;
  gap: 8px;
`;

interface Props {
  name: string;
  total: number;
  unread: number;
  active: boolean;
  folderType?: MailboxFolderType;
  onClick?: () => void;
}

const CollapsibleListItem = (props: Props) => {
  const { name, unread, active, folderType, onClick } = props;

  return (
    <Root onClick={onClick} $active={active}>
      <TitleWrapper>
        <IconWrapper>{getIconByFolderType(folderType)}</IconWrapper>
        <SpanWithEllipsis text={name} />
      </TitleWrapper>

      {unread > 0 && (
        <span title={String(unread)}>{truncateNumber({ num: unread, precision: 4 })}</span>
      )}
    </Root>
  );
};

export { CollapsibleListItem };
