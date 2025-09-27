import { generalSettingsStore } from '@/app';
import {
  Currency,
  calculateEndOfWordIdxByNumber,
  currencyFormatterHelper,
  type EntityCategory,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
`;

const Label = styled.span`
  color: var(--button-text-graphite-primary-text);
`;

const Text = styled.span`
  color: var(--button-text-graphite-priory-text);
`;

const TextDelimiter = styled.hr`
  height: 12px;

  margin-top: 2px;
  border-radius: 2px;
  border-right: 1px solid var(--button-text-graphite-priory-text);
`;

interface Props {
  totalCount?: number;
  totalPrice?: number;
  etCategory?: EntityCategory;
}

const CardsTotalBlock = observer((props: Props) => {
  const { totalCount, totalPrice, etCategory } = props;

  const { t } = useTranslation('component.section', {
    keyPrefix: 'section.common.cards_total',
  });

  const label = useMemo<string>(() => {
    if (totalCount === undefined) return '';

    const idx = calculateEndOfWordIdxByNumber(totalCount);

    return etCategory ? t(`${etCategory}.${idx}`) : t(`deal.${idx}`);
  }, [totalCount, etCategory, t]);

  if (totalCount === undefined && totalPrice === undefined) return null;

  return (
    <Root>
      {totalPrice !== undefined && (
        <>
          <Text>
            {currencyFormatterHelper.format({
              value: totalPrice,
              currency: generalSettingsStore.accountSettings?.currency || Currency.USD,
            })}
          </Text>
          <TextDelimiter />
        </>
      )}

      {totalCount !== undefined && (
        <>
          <Text>{totalCount}</Text>

          <Label>{label}</Label>
        </>
      )}
    </Root>
  );
});

CardsTotalBlock.displayName = 'CardsTotalBlock';
export { CardsTotalBlock };
