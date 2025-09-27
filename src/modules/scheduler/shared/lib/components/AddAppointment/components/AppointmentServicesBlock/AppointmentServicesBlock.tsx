import { ProductsOrderTotalBlock } from '@/modules/products';
import { PlusIconButton, TableSkeleton } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { RefObject, useEffect, useRef, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useOnClickOutside } from 'usehooks-ts';
import { type AppointmentOrderStore } from '../../../../../../store';
import { AppointmentBlock } from '../AppointmentBlock/AppointmentBlock';
import { AppointmentServicesBlockItem } from '../AppointmentServicesBlockItem/AppointmentServicesBlockItem';
import { AppointmentServicesSearchBlock } from '../AppointmentServicesSearchBlock/AppointmentServicesSearchBlock';

const List = styled.ul`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 16px;
`;

// to prevent flickering when showing AppointmentServicesSearchBlock
const SearchBlockWrapper = styled.div`
  height: 27px;
  width: 100%;

  display: flex;
  align-items: center;
`;

const TotalBlockWrapper = styled.div`
  margin-left: auto;
`;

interface Props {
  orderStore: AppointmentOrderStore;
  styles?: CSSProperties;
  openedFromCard?: boolean;
}

const AppointmentServicesBlock = observer((props: Props) => {
  const { orderStore, styles, openedFromCard } = props;

  const { t } = useTranslation('module.scheduler', {
    keyPrefix: 'scheduler.pages.scheduler_schedule_view_page.ui.add_appointment_modal',
  });

  const blockRef = useRef<HTMLDivElement>(null);

  const { orderItemRows, rowsInitialized, initializeOrderItemRows } = orderStore;

  const [servicesSearchShown, { close: hideServicesSearch, open: showServicesSearch }] =
    useDisclosure(false);

  useEffect(() => {
    initializeOrderItemRows();
  }, [initializeOrderItemRows]);

  useOnClickOutside(blockRef as RefObject<HTMLDivElement>, e => {
    const target = e.target as HTMLElement;

    if (
      target.closest('.workspace__MyDropdown--StyledDropdown') ||
      target.closest('.workspace__MyPopover--StyledDropdown')
    )
      return;

    hideServicesSearch();
  });

  return (
    <AppointmentBlock
      ref={blockRef}
      styles={styles}
      openedFromCard={openedFromCard}
      headerTitle={t('addition_of_services')}
    >
      <List>
        {rowsInitialized ? (
          <>
            <SearchBlockWrapper>
              {servicesSearchShown ? (
                <AppointmentServicesSearchBlock orderStore={orderStore} />
              ) : (
                <PlusIconButton text={t('add_service')} onClick={showServicesSearch} />
              )}
            </SearchBlockWrapper>

            {orderItemRows.map(r => (
              <AppointmentServicesBlockItem key={r.id} orderItemRow={r} orderStore={orderStore} />
            ))}

            {orderItemRows.length > 0 && (
              <TotalBlockWrapper>
                <ProductsOrderTotalBlock
                  totalAmount={orderStore.totalAmount}
                  currentCurrency={orderStore.currentCurrency.value}
                />
              </TotalBlockWrapper>
            )}
          </>
        ) : (
          <TableSkeleton small />
        )}
      </List>
    </AppointmentBlock>
  );
});

AppointmentServicesBlock.displayName = 'AppointmentServicesBlock';
export { AppointmentServicesBlock };
