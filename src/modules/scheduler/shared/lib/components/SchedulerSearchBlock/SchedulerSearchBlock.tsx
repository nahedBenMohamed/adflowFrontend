import { ClearCrossIcon, MyInput, SearchIcon, type InputModel } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div`
  position: relative;

  width: 264px;

  flex-shrink: 0;

  input {
    padding-left: 24px;
    padding-right: 24px;
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 6px;
  top: 4px;

  width: 16px;
  height: 18px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 6px;
  top: 6px;

  width: 16px;
  height: 18px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg path {
      fill: var(--button-text-red-hover);
    }
  }

  &:active {
    svg path {
      fill: var(--button-text-red-active);
    }
  }
`;

export interface SchedulerSearchBlockProps {
  searchModel: InputModel;
  onChange: (value: string) => void;
  onClear: () => void;
}

const SchedulerSearchBlock = observer((props: SchedulerSearchBlockProps) => {
  const { searchModel, onChange, onClear } = props;

  const { t } = useTranslation('module.scheduler', {
    keyPrefix: 'scheduler.pages.scheduler_schedule_view_page',
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onClear();

    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <Root>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>

      <MyInput
        ref={inputRef}
        height="28px"
        variant="outlined"
        model={searchModel}
        placeholder={t('placeholders.search_visits')}
        handleChange={onChange}
      />

      {searchModel.trimmedValue.length > 0 && (
        <ClearButton onClick={handleClear}>
          <ClearCrossIcon />
        </ClearButton>
      )}
    </Root>
  );
});

SchedulerSearchBlock.displayName = 'SchedulerSearchBlock';
export { SchedulerSearchBlock };
