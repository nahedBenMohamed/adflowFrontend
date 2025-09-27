import { Account } from '@/modules/settings';
import { Nullable, Optional, Subscription } from '@/shared';
import styled from 'styled-components';

const Root = styled.div`
  width: 640px;
  min-height: 150px;

  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: 16px;
  background: var(--primary-statuses-white-0);
  border-radius: var(--border-radius-block);
  box-shadow:
    0px 1px 2px 0px #d0daeb,
    0px 0px 2px 0px #eef4fe;
`;

const Title = styled.h2`
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: var(--graphite-graphite-840);
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Delimiter = styled.hr`
  width: 100%;
  height: 1px;
  background: var(--graphite-graphite-120);
`;

const EmptyBlock = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: var(--graphite-graphite-840);
`;

const Text = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

interface Props {
  account: Nullable<Account>;
  subscription: Optional<Subscription>;
}

const AccountBlock = (props: Props) => {
  const { account, subscription } = props;

  if (!account)
    return (
      <Root>
        <EmptyBlock>{'Аккаунт не выбран. Найдите аккаунт по поддомену через поиск.'}</EmptyBlock>
      </Root>
    );

  return (
    <Root>
      <Title>{account.companyName}</Title>

      <InfoWrapper>
        <Text>{`ID: ${account.id}`}</Text>
        <Text>{`Поддомен: ${account.subdomain}`}</Text>
        <Text>{`Создан ${account.createdAt.displayLong()}`}</Text>
      </InfoWrapper>

      {subscription && (
        <>
          <Delimiter />

          <InfoWrapper>
            <Text>{`Подписка: ${subscription.planName}`}</Text>
            <Text>{`Лимит пользователей: ${subscription.userLimit}`}</Text>
            <Text>{`Действует до: ${subscription.expiredAt?.displayLong()}`}</Text>
          </InfoWrapper>
        </>
      )}
    </Root>
  );
};

export { AccountBlock };
