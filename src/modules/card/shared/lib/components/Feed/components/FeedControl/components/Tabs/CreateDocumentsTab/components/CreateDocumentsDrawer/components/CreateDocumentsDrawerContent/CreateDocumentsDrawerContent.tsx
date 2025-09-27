import { authStore } from '@/modules/auth';
import { generateOrderName, useGetEntityProductOrders } from '@/modules/products';
import { MiniLoader, MySelect, type Option, type SelectModel } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { AddTemplatePlaceholder } from '../../../AddTemplatePlaceholder/AddTemplatePlaceholder';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SelectsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

interface Props {
  entityId: number;
  orderId: SelectModel;
  templateInfo: SelectModel;
  templateOptions: Option<number>[];
  getHint: () => ReactNode;
  handleClearTemplateCheckData: () => void;
}

const CreateDocumentsDrawerContent = observer((props: Props) => {
  const {
    entityId,
    orderId,
    templateInfo,
    templateOptions,
    getHint,
    handleClearTemplateCheckData,
  } = props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.ui.feed.create_documents',
  });

  const { data: productOrders, isLoading: areEntityProductOrdersLoading } =
    useGetEntityProductOrders(entityId);

  const productOrdersOptions = useMemo<Option<number>[]>(
    () =>
      productOrders?.map<Option<number>>(o => ({
        value: o.id,
        label: generateOrderName({ orderNumber: o.orderNumber, t }),
      })) ?? [],
    [productOrders, t]
  );

  return (
    <Content>
      <SelectsWrapper>
        <MySelect
          withinPortal
          variant="empty"
          titleMinWidth={0}
          model={templateInfo}
          dropdownMinWidth="240px"
          options={templateOptions}
          placeholder={t('placeholders.select_template')}
          noOptionsLabel={authStore.isAdmin() ? <AddTemplatePlaceholder /> : undefined}
          handleChange={handleClearTemplateCheckData}
        />

        {productOrdersOptions.length > 0 && areEntityProductOrdersLoading ? (
          <MiniLoader color="var(--button-text-graphite-secondary-text)" size="small" />
        ) : (
          <MySelect
            withinPortal
            variant="empty"
            model={orderId}
            titleMinWidth={0}
            options={productOrdersOptions}
            placeholder={t('placeholders.select_order')}
            handleChange={handleClearTemplateCheckData}
          />
        )}
      </SelectsWrapper>

      {getHint()}
    </Content>
  );
});

CreateDocumentsDrawerContent.displayName = 'CreateDocumentsDrawerContent';
export { CreateDocumentsDrawerContent };
