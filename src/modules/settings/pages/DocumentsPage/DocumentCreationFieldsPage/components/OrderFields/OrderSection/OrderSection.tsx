import { useCallback, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  generateOrderItemsFields,
  generateOrderSpecificItemFields,
  generateOrderSystemFields,
  type OrderField,
} from '../../../../../../shared';
import { OrderFieldBlock } from '../../FieldBlock/OrderFieldBlock';
import { FieldsGroupWrapper } from '../../FieldsGroupWrapper/FieldsGroupWrapper';
import { SectionTemplate } from '../../SectionTemplate/SectionTemplate';
import { OrderSectionExampleWrapper } from '../OrderSectionExampleWrapper/OrderSectionExampleWrapper';
import { OrderSectionTableExample } from '../OrderSectionTableExample/OrderSectionTableExample';
import { OrderSectionTextParagraph } from '../OrderSectionTextParagraph/OrderSectionTextParagraph';

const sanitizeTextFromHTMLNodes = (text: string): string => text.replace(/<(\/?b|strong)>/g, '');

const OrderSection = () => {
  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.templates.document_templates_page.order_fields',
  });

  const generateOrderFieldCode = useCallback(
    ({ defaultCode, numberToWord }: { defaultCode: string; numberToWord?: string }): string => {
      const suffix = numberToWord ? ` | words:'${numberToWord}'` : '';

      return `{${defaultCode}${suffix}}`;
    },
    []
  );

  const orderSystemFields = useMemo<OrderField[]>(() => generateOrderSystemFields(t), [t]);
  const orderItemsFields = useMemo<OrderField[]>(() => generateOrderItemsFields(t), [t]);
  const orderSpecificItemFields = useMemo<OrderField[]>(
    () => generateOrderSpecificItemFields(t),
    [t]
  );

  const textExample = `{#order.products}

${sanitizeTextFromHTMLNodes(t('text_block_4'))}
			
{/}
`;

  return (
    <>
      <SectionTemplate
        name={t('order')}
        SystemFields={orderSystemFields.map(f => (
          <OrderFieldBlock
            key={f.name}
            name={f.name}
            defaultCode={f.defaultCode}
            showNumberToWordSelector={f.showNumberToWordSelector}
            generateFieldCode={generateOrderFieldCode}
          />
        ))}
        Fields={
          <>
            <FieldsGroupWrapper>
              <OrderFieldBlock boldName name={t('order_items')} />

              <OrderFieldBlock
                defaultCode="#order.products"
                generateFieldCode={generateOrderFieldCode}
              />

              {orderItemsFields.map(f => (
                <OrderFieldBlock
                  key={f.name}
                  name={f.name}
                  defaultCode={f.defaultCode}
                  showNumberToWordSelector={f.showNumberToWordSelector}
                  generateFieldCode={generateOrderFieldCode}
                />
              ))}

              <OrderFieldBlock defaultCode="/" generateFieldCode={generateOrderFieldCode} />
            </FieldsGroupWrapper>

            <FieldsGroupWrapper $gap="12px">
              <OrderSectionTextParagraph>{t('text_block_1')}</OrderSectionTextParagraph>

              <OrderSectionTextParagraph>{t('text_block_2')}</OrderSectionTextParagraph>

              <OrderSectionTextParagraph>
                <Trans
                  t={t}
                  i18nKey={'text_block_3'}
                  components={{
                    b: <b />,
                    strong: <strong />,
                  }}
                />
              </OrderSectionTextParagraph>

              <OrderSectionExampleWrapper
                copyText={textExample}
                Title={<OrderSectionTextParagraph>{t('text_example')}:</OrderSectionTextParagraph>}
              >
                <OrderSectionTextParagraph>{'{#order.products}'}</OrderSectionTextParagraph>

                <OrderSectionTextParagraph>
                  <Trans
                    t={t}
                    i18nKey={'text_block_4'}
                    components={{
                      b: <b />,
                    }}
                  />
                </OrderSectionTextParagraph>

                <OrderSectionTextParagraph>{'{/}'}</OrderSectionTextParagraph>
              </OrderSectionExampleWrapper>
            </FieldsGroupWrapper>

            <FieldsGroupWrapper $gap="12px">
              <OrderSectionTextParagraph>{t('text_block_5')}</OrderSectionTextParagraph>

              <OrderSectionTextParagraph>
                <Trans
                  t={t}
                  i18nKey={'text_block_6'}
                  components={{
                    b: <b />,
                    strong: <strong />,
                  }}
                />
              </OrderSectionTextParagraph>

              <OrderSectionTableExample />

              <OrderSectionTextParagraph>{t('text_block_7')}</OrderSectionTextParagraph>

              <FieldsGroupWrapper $hideDelimiter>
                <OrderFieldBlock boldName name={t('specific_order_item')} />

                {orderSpecificItemFields.map(f => (
                  <OrderFieldBlock
                    key={f.name}
                    name={f.name}
                    defaultCode={f.defaultCode}
                    showNumberToWordSelector={f.showNumberToWordSelector}
                    generateFieldCode={generateOrderFieldCode}
                  />
                ))}
              </FieldsGroupWrapper>

              <OrderSectionTextParagraph>
                <Trans
                  t={t}
                  i18nKey={'text_block_8'}
                  components={{
                    b: <b />,
                  }}
                />
              </OrderSectionTextParagraph>
            </FieldsGroupWrapper>
          </>
        }
      />
    </>
  );
};

export { OrderSection };
