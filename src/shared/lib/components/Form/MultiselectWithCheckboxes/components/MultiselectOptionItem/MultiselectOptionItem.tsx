import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { TruncateMixin } from '../../../../../mixins';
import type { MySelectTitleRootVariant, Option } from '../../../../../models';
import type { Nullable } from '../../../../../types';
import { TextHighlighter } from '../../../../TextHighlighter/TextHighlighter';
import { MyCheckbox } from '../../../MyCheckbox/MyCheckbox';
import { MultiselectCheckIcon } from '../MultiselectCheckIcon/MultiselectCheckIcon';

interface RootProps {
  $variant?: MySelectTitleRootVariant;
  $focused?: boolean;
}

const Root = styled.label<RootProps>`
  height: 36px;

  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: ${p => (p.$variant === 'filled' ? '8px' : '4px')};

  padding: 8px;
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    background-color: #f3fded;
  }

  &:active {
    background-color: #e6fbda;
  }

  & {
    background-color: ${p => (p.$focused ? '#e6fbda' : 'inherit')};
  }
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin}
`;

interface Props<O extends Option> {
  option: O;
  active: boolean;
  focused?: boolean;
  variant?: MySelectTitleRootVariant;
  highlight?: Nullable<string>;
  onSelect: (value: O['value']) => void;
  onCancel: (value: O['value']) => void;
}

export const DATA_ACTIVE = 'data-active';

const MultiselectOptionItem = observer(<O extends Option>(props: Props<O>) => {
  const {
    option,
    active,
    focused,
    variant = 'primary',
    highlight = null,
    onSelect,
    onCancel,
  } = props;

  const handleClick = () => {
    if (active) {
      onCancel(option.value);
    } else {
      onSelect(option.value);
    }
  };

  const { label } = option;

  return variant === 'filled' ? (
    <Root $variant="filled" $focused={focused} {...{ [DATA_ACTIVE]: focused }}>
      <MyCheckbox checked={active} onClick={handleClick} />

      <Title title={label}>
        <TextHighlighter truncate str={label} filter={highlight} />
      </Title>
    </Root>
  ) : (
    <Root $variant="empty" onClick={handleClick} $focused={focused} {...{ [DATA_ACTIVE]: focused }}>
      <MultiselectCheckIcon visible={active} />

      <Title title={label}>
        <TextHighlighter truncate str={label} filter={highlight} />
      </Title>
    </Root>
  );
});

MultiselectOptionItem.displayName = 'MultiselectOptionItem';
export { MultiselectOptionItem };
