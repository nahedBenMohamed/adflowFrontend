import { generalSettingsStore, userStore } from '@/app';
import { Currency, SpanWithEllipsis, TruncateMixin, currencyFormatterHelper } from '@/shared';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import type { TopSellersUser } from '../../../../../../shared';

const Root = styled.div<{ $best: boolean }>`
  display: flex;
  align-items: flex-end;
  gap: 4px;

  font-weight: ${p => (p.$best ? 600 : 400)};
  font-size: ${p => (p.$best ? '16px' : '14px')};
  line-height: ${p => (p.$best ? '23px' : '20px')};
  color: ${p =>
    p.$best
      ? 'var(--button-text-graphite-priory-text)'
      : 'var(--button-text-graphite-primary-text)'};

  padding: 8px 12px;
`;

const IndexNumber = styled.div`
  min-width: 24px;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex: 1;
`;

const Name = styled.div`
  max-width: 394px;

  ${TruncateMixin}
`;

const DashedLine = styled.div<{ $best: boolean }>`
  flex-grow: 1;

  margin: ${p => (p.$best ? '0 16px 6px' : '0 16px 4px')};
  border-bottom: 1px dotted var(--button-text-graphite-secondary-text);
`;

const Stats = styled.div`
  max-width: 394px;

  display: flex;
  align-items: center;
  gap: 8px;

  ${TruncateMixin}
`;

const Delimiter = styled.hr<{ $best: boolean }>`
  height: 16px;

  border-radius: 2px;
  border: ${p =>
    p.$best ? '1px solid #616C82' : '1px solid var(--button-text-graphite-primary-text)'};
`;

interface Props {
  topSeller: TopSellersUser;
  place: number;
}

const RatingItem = observer((props: Props) => {
  const { topSeller, place } = props;

  const isBest = place === 1;

  const { accountSettings } = generalSettingsStore;

  const user = userStore.getById(topSeller.userId);

  return (
    <Root $best={isBest}>
      <IndexNumber>{place}</IndexNumber>

      <Wrapper>
        <Name>
          <SpanWithEllipsis text={user.fullName} showTitle={false} />
        </Name>

        <DashedLine $best={isBest} />

        <Stats>
          {topSeller.quantity}

          <Delimiter $best={isBest} />

          <SpanWithEllipsis
            showTitle={false}
            text={currencyFormatterHelper.format({
              value: topSeller.amount,
              currency: accountSettings?.currency ?? Currency.USD,
            })}
          />
        </Stats>
      </Wrapper>
    </Root>
  );
});

RatingItem.displayName = 'RatingItem';
export { RatingItem };
