import { DialogModalSecondary, MyCheckbox } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import type { Table } from '@tanstack/react-table';
import { useCallback, type ChangeEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { SectionTableRow } from '../../../../models';
import { ActionModalBlock } from '../BatchActions/components';

const Root = styled.div`
  padding: 24px 0;
`;

interface Props {
  disabled: boolean;
  totalCount: number;
  withoutModal: boolean;
  table: Table<SectionTableRow>;
  areAllEntitiesSelected: boolean;
  selectAllEntities: () => void;
  deselectAllEntities: () => void;
}

const SelectAllCheckbox = (props: Props) => {
  const {
    table,
    disabled,
    totalCount,
    withoutModal,
    areAllEntitiesSelected,
    selectAllEntities,
    deselectAllEntities,
  } = props;

  const { t } = useTranslation('component.section', {
    keyPrefix: 'section.section_table.select_all',
  });

  const {
    getIsAllRowsSelected,
    getIsSomeRowsSelected,
    toggleAllPageRowsSelected,
    toggleAllRowsSelected,
    resetRowSelection,
  } = table;

  const [opened, { open, close }] = useDisclosure(false);

  const handleSelectAllPages = useCallback(() => {
    toggleAllRowsSelected();
    selectAllEntities();

    close();
  }, [close, selectAllEntities, toggleAllRowsSelected]);

  const handleSelectOnePage = useCallback(() => {
    toggleAllPageRowsSelected();
    close();
  }, [close, toggleAllPageRowsSelected]);

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(() => {
    if (withoutModal) return handleSelectOnePage();

    if (getIsAllRowsSelected() || getIsSomeRowsSelected()) {
      resetRowSelection();

      if (areAllEntitiesSelected) deselectAllEntities();
    } else {
      open();
    }
  }, [
    withoutModal,
    handleSelectOnePage,
    areAllEntitiesSelected,
    open,
    resetRowSelection,
    deselectAllEntities,
    getIsAllRowsSelected,
    getIsSomeRowsSelected,
  ]);

  return (
    <>
      <MyCheckbox
        disabled={disabled}
        indeterminate={getIsSomeRowsSelected()}
        checked={areAllEntitiesSelected || getIsAllRowsSelected()}
        onChange={handleChange}
      />

      {opened && !withoutModal && (
        <DialogModalSecondary
          isOpened={opened}
          width="fit-content"
          height="fit-content"
          Header={t('title')}
          cancelTitle={t('for_page')}
          approveTitle={t('all_elements')}
          onClose={close}
          onCancel={handleSelectOnePage}
          onApprove={handleSelectAllPages}
        >
          <Root>
            <ActionModalBlock>{t('description', { count: totalCount })}</ActionModalBlock>
          </Root>
        </DialogModalSecondary>
      )}
    </>
  );
};

export { SelectAllCheckbox };
