import { generalSettingsStore } from '@/app';
import { Currency, TruncateMixin, currencyFormatterHelper } from '@/shared';
import { memo, useMemo } from 'react';
import styled from 'styled-components';
import { AnalyticsValueType, CountupComponent } from '../../../../../../shared';

const Delimiter = styled.hr`
  height: 16px;

  border-radius: 2px;
  border: 1px solid var(--button-text-graphite-primary-text);
`;

const Amount = styled.span`
  ${TruncateMixin}
`;

interface Props {
  count?: number;
  amount?: number;
}

const UnitBody = memo((props: Props) => {
  const { count, amount } = props;

  const { accountSettings } = generalSettingsStore;

  const formattedAmount = useMemo(
    () =>
      amount === undefined
        ? undefined
        : currencyFormatterHelper.formatWithLanguage({
            value: amount,
            currency: accountSettings?.currency ?? Currency.USD,
            language: accountSettings?.language,
          }),
    [amount, accountSettings]
  );

  return (
    <>
      {count === undefined ? '...' : <CountupComponent number={count} />}

      {amount !== undefined && (
        <>
          <Delimiter />

          <Amount title={formattedAmount}>
            {formattedAmount && formattedAmount.length > 16 ? (
              currencyFormatterHelper.compactFormat({
                value: amount,
                currency: accountSettings?.currency ?? Currency.USD,
                language: accountSettings?.language,
              })
            ) : (
              <CountupComponent number={amount} type={AnalyticsValueType.AMOUNT} />
            )}
          </Amount>
        </>
      )}
    </>
  );
});

UnitBody.displayName = 'UnitBody';
export { UnitBody };
