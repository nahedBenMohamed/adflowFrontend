import type { MouseEvent, ReactNode, Ref } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ClearIcon, FilterIcon } from '../../assets';
import { MiniLoader, MyIndicator, SubheaderButton } from '../../lib';

const ClearIconWrapper = styled.div`
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg path {
    fill: var(--graphite-graphite-840);
  }
`;

interface Props {
  ref?: Ref<HTMLButtonElement>;
  opened: boolean;
  isFilterApplied: boolean;
  children: ReactNode;
  loading: boolean;
  toggle: () => void;
  handleClear: () => void;
}

const FilterButtonWithClearIconTemplate = (props: Props) => {
  const { ref, opened, isFilterApplied, children, loading, toggle, handleClear } = props;

  const { t } = useTranslation();

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    handleClear?.();
  };

  const showClearIcon = opened && isFilterApplied;

  return (
    <>
      <SubheaderButton
        ref={ref}
        text={t('filter')}
        active={opened}
        iconChangeState
        Icon={
          loading ? (
            <MiniLoader size="small" color="var(--graphite-graphite-840)" />
          ) : showClearIcon ? (
            <ClearIconWrapper onClick={handleClick}>
              <ClearIcon />
            </ClearIconWrapper>
          ) : (
            <MyIndicator
              size={8}
              offset={1}
              rootWidth="16px"
              rootHeight="16px"
              position="bottom-end"
              disabled={!isFilterApplied}
            >
              <FilterIcon />
            </MyIndicator>
          )
        }
        onClick={toggle}
      />

      {children}
    </>
  );
};

export { FilterButtonWithClearIconTemplate };
