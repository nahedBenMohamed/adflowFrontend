import { type ReactNode, type RefObject } from 'react';
import styled from 'styled-components';
import { MyDrawer, OutlinedSearchInput, type OutlinedSearchInputProps } from '../../lib';
import { FilterControls, type FilterDrawerControlsProps } from './components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;

interface Props {
  buttonRef: RefObject<HTMLButtonElement | null>;
  opened: boolean;
  children: ReactNode;
  searchProps: OutlinedSearchInputProps;
  controlsProps: FilterDrawerControlsProps;
  hide: () => void;
}

const FilterDrawerTemplate = (props: Props) => {
  const { buttonRef, opened, children, searchProps, controlsProps, hide } = props;

  return (
    <MyDrawer
      buttonRef={buttonRef}
      opened={opened}
      ensurePageSubheader
      Header={<OutlinedSearchInput {...searchProps} />}
      Controls={<FilterControls {...controlsProps} />}
      hide={hide}
    >
      <Root>{children}</Root>
    </MyDrawer>
  );
};

export { FilterDrawerTemplate };
