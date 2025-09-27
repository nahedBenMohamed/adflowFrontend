import { TruncateMixin } from '@/shared';
import { memo } from 'react';
import styled from 'styled-components';

const Root = styled.div`
  flex: 1;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  text-align: left;
  color: var(--button-text-graphite-primary-text);

  padding: 3px 8px;
  background-color: var(--graphite-graphite-40);
  border-radius: var(--border-radius-element);

  ${TruncateMixin}
`;

interface Props {
  amount: string | number;
}

const AmountCellRoot = memo((props: Props) => {
  const { amount } = props;

  return <Root title={typeof amount === 'string' ? amount : String(amount)}>{amount}</Root>;
});

AmountCellRoot.displayName = 'AmountCellRoot';
export { AmountCellRoot };
