import { TruncateMixin } from '@/shared';
import type { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { ColorUtil } from '../../../../utils';
import { TextHighlighter } from '../../../TextHighlighter/TextHighlighter';
import { ColoredBlock } from '../../MySelect/components/ColoredBlock/ColoredBlock';

const CommonStyles = css`
  width: 100%;

  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;

  padding: 6px 8px;
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;
  }
`;

interface SelectOptionColoredItemRootProps {
  $active?: boolean;
  $focused?: boolean;
}

export const SelectOptionColoredItemRoot = styled.div<SelectOptionColoredItemRootProps>`
  ${CommonStyles}

  &:hover {
    background-color: ${p => !p.$active && !p.$focused && '#f3fded'};
  }

  ${p => (p.$active || p.$focused) && `background-color: #e6fbda`};
`;

interface SelectOptionItemRootProps {
  $active?: boolean;
  $focused?: boolean;
  $disableStates?: boolean;
  $truncate?: boolean;
  $monoDigits?: boolean;
}

export const SelectOptionItemRoot = styled.div<SelectOptionItemRootProps>`
  ${CommonStyles}

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  border-radius: var(--border-radius-element);

  ${p =>
    !p.$active &&
    !p.$disableStates &&
    css`
      &:hover {
        background-color: #f3fded;
      }

      &:active {
        background-color: #e6fbda;
      }
    `};

  ${p => p.$focused && `background-color: #e6fbda`};

  ${p =>
    p.$active &&
    css`
      color: var(--primary-statuses-white-0);

      background-color: var(--primary-statuses-green-520);
    `};

  ${p =>
    p.$truncate &&
    css`
      max-width: 180px;

      ${TruncateMixin}
    `}

  ${p => p.$monoDigits && `font-variant-numeric: tabular-nums`};
`;

interface Props {
  label: ReactNode;
  active?: boolean;
  focused?: boolean;
  bgColor?: string;
  filter?: string;
  truncate?: boolean;
  monoDigits?: boolean;
  onSelect: () => void;
}

export const SELECT_OPTION_ITEM_DATA_ACTIVE = 'data-active';

const SelectOptionItem = (props: Props) => {
  const { label, bgColor, active, truncate, filter = null, focused, monoDigits, onSelect } = props;

  const commonProps = {
    $active: active,
    onClick: onSelect,
  };

  if (!bgColor)
    return (
      <SelectOptionItemRoot
        {...commonProps}
        $active={active}
        $focused={focused}
        $truncate={truncate}
        $monoDigits={monoDigits}
        {...{ [SELECT_OPTION_ITEM_DATA_ACTIVE]: focused }}
      >
        {typeof label === 'string' ? <TextHighlighter filter={filter} str={label} /> : label}
      </SelectOptionItemRoot>
    );

  const checkedBgColor = ColorUtil.getProcessedBGColor(bgColor);
  const color = ColorUtil.getTextContrastColorByBgColorHex(checkedBgColor);

  return (
    <SelectOptionColoredItemRoot
      {...commonProps}
      $active={active}
      $focused={focused}
      {...{ [SELECT_OPTION_ITEM_DATA_ACTIVE]: focused }}
    >
      <ColoredBlock $color={color} $bgColor={checkedBgColor}>
        {label}
      </ColoredBlock>
    </SelectOptionColoredItemRoot>
  );
};

export { SelectOptionItem };
