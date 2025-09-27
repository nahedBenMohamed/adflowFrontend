import { DropdownListItem, type BooleanModel } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { HideEmptyResourcesIcon, ShowEmptyResourcesIcon } from '../../../../shared';

const IconWrapper = styled.div`
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

interface Props {
  hideEmptyResourcesModel: BooleanModel;
}

const HideEmptyResourcesListItem = observer((props: Props) => {
  const { hideEmptyResourcesModel } = props;

  const { t } = useTranslation('module.products', { keyPrefix: 'products.pages.products_page' });

  return (
    <DropdownListItem $justify="flex-start" onClick={hideEmptyResourcesModel.toggle}>
      <IconWrapper>
        {hideEmptyResourcesModel.value ? <ShowEmptyResourcesIcon /> : <HideEmptyResourcesIcon />}
      </IconWrapper>

      {hideEmptyResourcesModel.value ? t('show_empty_resources') : t('hide_empty_resources')}
    </DropdownListItem>
  );
});

HideEmptyResourcesListItem.displayName = 'HideEmptyResourcesListItem';
export { HideEmptyResourcesListItem };
