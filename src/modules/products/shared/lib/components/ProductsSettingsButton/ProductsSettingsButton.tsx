import { routes } from '@/app';
import { authStore } from '@/modules/auth';
import {
  DropdownListItem,
  DropdownScrollbarMixin,
  ListItemLink,
  MyDropdown,
  SubheaderButton,
  SubheaderSettingsIcon,
  TableSettingsIcon,
  useModalControl,
  type ToggleControl,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, type ReactNode, type Ref } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { SettingsIcon } from '../../../assets';
import type { ProductsSectionType } from '../../models';

const List = styled.div`
  max-height: 320px;

  display: flex;
  flex-direction: column;

  ${DropdownScrollbarMixin}
`;

const IconWrapper = styled.div`
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

interface Props {
  ref?: Ref<HTMLButtonElement>;
  sectionId: number;
  sectionType: ProductsSectionType;
  ExtraSettings?: ReactNode;
  tableSettingsControl?: ToggleControl;
  showReportsSettingsDrawer?: () => void;
}

const ProductsSettingsButton = observer((props: Props) => {
  const {
    ref,
    sectionId,
    sectionType,
    ExtraSettings,
    tableSettingsControl,
    showReportsSettingsDrawer,
  } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.components.common.products_settings_button',
  });

  const isAdmin = authStore.isAdmin();

  const dropdownControl = useModalControl(false);

  const handleOpenTableSettings = useCallback(() => {
    tableSettingsControl?.open();
    dropdownControl.close();
  }, [dropdownControl, tableSettingsControl]);

  const handleShowReportsSettingsDrawer = useCallback(() => {
    showReportsSettingsDrawer?.();
    dropdownControl.close();
  }, [dropdownControl, showReportsSettingsDrawer]);

  return isAdmin || tableSettingsControl || showReportsSettingsDrawer ? (
    <MyDropdown
      withinPortal
      position="bottom-end"
      opened={dropdownControl.opened}
      Button={
        <SubheaderButton
          ref={ref}
          iconChangeState
          text={t('settings')}
          active={dropdownControl.opened}
          Icon={<SubheaderSettingsIcon />}
        />
      }
      hide={dropdownControl.close}
      show={dropdownControl.open}
    >
      <List>
        {isAdmin && (
          <ListItemLink
            $justify="flex-start"
            to={routes.builderUpdateProductsSection({
              moduleId: sectionId,
              moduleType: sectionType,
            })}
          >
            <IconWrapper>
              <SettingsIcon />
            </IconWrapper>

            {t('module_settings')}
          </ListItemLink>
        )}

        {tableSettingsControl && (
          <DropdownListItem $justify="flex-start" onClick={handleOpenTableSettings}>
            <IconWrapper>
              <TableSettingsIcon />
            </IconWrapper>

            {t('table_settings')}
          </DropdownListItem>
        )}

        {showReportsSettingsDrawer && (
          <DropdownListItem $justify="flex-start" onClick={handleShowReportsSettingsDrawer}>
            <IconWrapper>
              <TableSettingsIcon />
            </IconWrapper>

            {t('report_settings')}
          </DropdownListItem>
        )}

        {ExtraSettings}
      </List>
    </MyDropdown>
  ) : null;
});

export { ProductsSettingsButton };
