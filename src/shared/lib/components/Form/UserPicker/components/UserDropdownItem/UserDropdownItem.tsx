import type { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { TruncateMixin } from '../../../../../mixins';
import { Avatar } from '../../../../../models';
import type { Nullable } from '../../../../../types';
import { AvatarCircle } from '../../../../AvatarCircle/AvatarCircle';
import { TextHighlighter } from '../../../../TextHighlighter/TextHighlighter';
import { CheckIcon } from '../CheckIcon/CheckIcon';

interface RootProps {
  $disabled?: boolean;
  $hoverable?: boolean;
  $avatarHidden?: boolean;
  $withBottomBorder?: boolean;
}

const Root = styled.div<RootProps>`
  position: relative;

  height: 44px;

  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 8px;

  padding: 6px 8px 6px ${p => (p.$avatarHidden ? 36 : 28)}px;
  transition: var(--transition-200);

  ${p =>
    p.$hoverable &&
    css`
      &:hover {
        cursor: pointer;

        background-color: #f3fded;
      }

      &:active {
        background-color: #e6fbda;
      }
    `}

  ${p => p.$withBottomBorder && `border-bottom: 1px solid var(--graphite-graphite-80)`};

  ${p =>
    p.$disabled &&
    css`
      pointer-events: none;

      background-color: var(--graphite-graphite-20);
    `};
`;

const Name = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin}
`;

const Annotation = styled.p`
  font-size: 10px;
  font-weight: 400;
  line-height: 10px;
  color: var(--button-text-graphite-secondary-text);
`;

export interface UserDropdownItemMeta {
  id: number;
  canSelect: boolean;
  annotation: string;
}

interface Props {
  active: boolean;
  title: string;
  filter?: Nullable<string>;
  avatar?: Avatar;
  extra?: ReactNode;
  hoverable?: boolean;
  meta?: UserDropdownItemMeta;
  hideAvatar?: boolean;
  withBottomBorder?: boolean;
  onClick: () => void;
  renderExtra?: () => ReactNode;
}

const UserDropdownItem = (props: Props) => {
  const {
    active,
    title,
    filter = null,
    avatar,
    hoverable,
    meta,
    hideAvatar,
    withBottomBorder,
    onClick,
    renderExtra,
  } = props;

  const canSelect = meta ? meta.canSelect : true;
  const itemAnnotation = meta ? meta.annotation : null;

  return (
    <Root
      $hoverable={hoverable}
      $disabled={!canSelect}
      $avatarHidden={hideAvatar}
      $withBottomBorder={withBottomBorder}
      onClick={canSelect ? onClick : undefined}
    >
      <CheckIcon active={active} />

      {!hideAvatar && (
        <AvatarCircle
          size="large"
          avatar={
            avatar ||
            new Avatar({
              avatarUrl: null,
              lastName: title.substring(1),
              firstName: title.substring(0, 1),
            })
          }
        />
      )}

      <Name>
        <TextHighlighter truncate filter={filter} str={title} />

        {itemAnnotation && <Annotation>{itemAnnotation}</Annotation>}
      </Name>

      {renderExtra?.()}
    </Root>
  );
};

export { UserDropdownItem };
