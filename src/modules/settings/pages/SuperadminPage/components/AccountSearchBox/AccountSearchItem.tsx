import { SEARCH_ITEM_DATA_ACTIVE } from '@/modules/section/shared/lib/components/SearchBlock/components/SearchBox/components';
import { Account } from '@/modules/settings';
import { SpanWithEllipsis, TextHighlighter, TruncateMixin } from '@/shared';
import styled from 'styled-components';

const Root = styled.button<{ $focused: boolean }>`
  width: 100%;

  display: flex;

  color: var(--button-text-graphite-priory-text);

  padding: 6px 32px;
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    color: var(--button-text-graphite-priory-text);

    background-color: #f3fded;
  }

  &:active {
    color: var(--button-text-graphite-priory-text);

    background-color: #e6fbda;
  }

  ${p => p.$focused && `background-color: #e6fbda`};

  ${TruncateMixin}
`;

const TitleWrapper = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;

  div,
  span {
    width: fit-content;
  }

  ${TruncateMixin}
`;

interface Props {
  filter: string;
  isFocused: boolean;
  account: Account;
  onSelect: (account: Account) => void;
}

const AccountSearchItem = (props: Props) => {
  const { filter, isFocused, account, onSelect } = props;

  return (
    <li>
      <Root
        $focused={isFocused}
        {...{ [SEARCH_ITEM_DATA_ACTIVE]: isFocused }}
        onClick={() => onSelect(account)}
      >
        <TitleWrapper>
          <TextHighlighter truncate filter={filter} str={account.subdomain} />

          <SpanWithEllipsis text={account.companyName} />
        </TitleWrapper>
      </Root>
    </li>
  );
};

export { AccountSearchItem };
