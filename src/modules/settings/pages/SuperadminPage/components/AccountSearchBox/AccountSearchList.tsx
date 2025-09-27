import { Account } from '@/modules/settings';
import { DropdownScrollbarMixin } from '@/shared';
import type { Ref } from 'react';
import styled from 'styled-components';
import { AccountSearchItem } from './AccountSearchItem';

const Root = styled.ul`
  max-height: 400px;

  display: flex;
  flex-direction: column;

  background: var(--primary-statuses-white-0);

  ${DropdownScrollbarMixin}
`;

interface Props {
  ref?: Ref<HTMLUListElement>;
  filter: string;
  current: number;
  accounts: Account[];
  onSelect: (account: Account) => void;
}

const AccountSearchList = (props: Props) => {
  const { ref, filter, current, accounts, onSelect } = props;

  return (
    <Root ref={ref}>
      {accounts.map((a, idx) => (
        <AccountSearchItem
          key={a.id}
          account={a}
          filter={filter}
          isFocused={idx === current}
          onSelect={onSelect}
        />
      ))}
    </Root>
  );
};

export { AccountSearchList };
