import type { CSSProperties } from 'react';
import styled from 'styled-components';
import { TruncateMixin } from '../../../../mixins';
import { TextHighlighter } from '../../../TextHighlighter/TextHighlighter';
import { MyDropdownTitleWrapper } from '../MyDropdownTitleWrapper/MyDropdownTitleWrapper';

interface RootProps {
  $active?: boolean;
  $padding?: CSSProperties['padding'];
}

export const MyDropdownItemRoot = styled.li<RootProps>`
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  gap: 16px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  padding: ${p => (p.$padding ? p.$padding : '6px 16px')};
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    background-color: ${p => (p.$active ? '#e6fbda' : '#f3fded')};
  }

  &:active {
    background-color: #e6fbda;
  }

  ${p => p.$active && `background-color: #e6fbda`};
`;

const OptionMeta = styled.span`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: var(--button-text-graphite-secondary-text);

  ${TruncateMixin}
`;

interface Props {
  title: string;
  active: boolean;
  padding?: CSSProperties['padding'];
  highlight?: string;
  optionMeta?: string;
  onClick: () => void;
}

const MyDropdownItem = (props: Props) => {
  const { title, active, padding, highlight, optionMeta, onClick } = props;

  return (
    <MyDropdownItemRoot $active={active} $padding={padding} onClick={onClick}>
      <MyDropdownTitleWrapper title={title}>
        {highlight ? <TextHighlighter truncate filter={highlight} str={title} /> : title}
      </MyDropdownTitleWrapper>

      {optionMeta && <OptionMeta>{optionMeta}</OptionMeta>}
    </MyDropdownItemRoot>
  );
};

export { MyDropdownItem };
