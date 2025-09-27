import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TruncateMixin } from '../../../../../mixins';
import { CheckIcon } from '../CheckIcon/CheckIcon';

const Root = styled.div<{ $height: CSSProperties['height'] }>`
  position: relative;

  height: ${p => p.$height};

  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 8px;

  padding: 0 8px 0 28px;
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    background-color: #f3fded;
  }

  &:active {
    background-color: #e6fbda;
  }
`;

const Text = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin}
`;

interface Props {
  allSelected: boolean;
  height: CSSProperties['height'];
  toggleSelectAll: () => void;
}

const SelectAllBlock = (props: Props) => {
  const { allSelected, height, toggleSelectAll } = props;

  const { t } = useTranslation('common', {
    keyPrefix: 'form.my_select',
  });

  return (
    <Root $height={height} onClick={toggleSelectAll}>
      <CheckIcon active={allSelected} />

      <Text>{allSelected ? t('clear_selection') : t('select_all')}</Text>
    </Root>
  );
};

export { SelectAllBlock };
