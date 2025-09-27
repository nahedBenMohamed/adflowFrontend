import { currencyFormatterHelper, type Currency, type Nullable } from '@/shared';
import { observer } from 'mobx-react-lite';
import { BudgetRoot } from './BudgetRoot';

interface Props {
  currency: Currency;
  budget?: Nullable<number>;
}

const CommonBudgetBlock = observer((props: Props) => {
  const { budget, currency } = props;

  if (!budget) return null;

  const formattedBudget = currencyFormatterHelper.format({ value: budget, currency });

  return <BudgetRoot title={formattedBudget}>{formattedBudget}</BudgetRoot>;
});

CommonBudgetBlock.displayName = 'CommonBudgetBlock';
export { CommonBudgetBlock };
