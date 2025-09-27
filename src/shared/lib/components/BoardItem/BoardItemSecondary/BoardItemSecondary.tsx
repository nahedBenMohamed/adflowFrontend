import { memo, useCallback, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { areRoutesPathnamesEqual } from '../../../helpers';
import { BoardNameStyle } from '../../BoardList/components';
import { SpanWithEllipsis } from '../../SpanWithEllipsis/SpanWithEllipsis';

const IconWrapper = styled.div`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  transition: var(--transition-200);

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const BoardName = styled.div`
  ${BoardNameStyle}
`;

const Root = styled.div<{ $active: boolean }>`
  height: 25px;

  font-weight: 400;
  font-size: 12px;
  line-height: 16px;

  display: flex;
  align-items: center;
  gap: 8px;

  border-radius: var(--border-radius-element);
  padding: 4px 12px 4px 8px;
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;
  }

  ${p =>
    !p.$active &&
    css`
      &:hover {
        color: var(--button-text-green-active);

        background-color: #f3fded;

        ${BoardName} {
          color: var(--button-text-green-active);
        }

        ${IconWrapper} {
          svg path {
            fill: var(--button-text-green-active);
          }
        }
      }

      &:active {
        color: var(--button-text-green-hover);

        background-color: #e6fbda;

        ${BoardName} {
          color: var(--button-text-green-hover);
        }

        svg path {
          fill: var(--button-text-green-hover);
        }
      }
    `}

  ${p =>
    p.$active &&
    css`
      color: var(--button-text-green-active);

      background-color: #f3fded;

      ${BoardName} {
        color: var(--button-text-green-active);
      }

      ${IconWrapper} {
        svg path {
          fill: var(--button-text-green-active);
        }
      }
    `}
`;

interface Props {
  name: string;
  link: string;
  Icon?: ReactNode;
  active?: boolean;
}

const BoardItemSecondary = memo((props: Props) => {
  const { name, link, Icon, active } = props;

  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const isBoardActive =
    active ??
    areRoutesPathnamesEqual({
      p1: pathname,
      p2: link,
    });

  const handleItemClick = useCallback(() => navigate(link), [navigate, link]);

  return (
    <Root $active={isBoardActive} onClick={handleItemClick}>
      <IconWrapper>{Icon}</IconWrapper>

      <BoardName>
        <SpanWithEllipsis text={name} />
      </BoardName>
    </Root>
  );
});

BoardItemSecondary.displayName = 'BoardItemSecondary';
export { BoardItemSecondary };
