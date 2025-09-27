import { generalSettingsStore } from '@/app';
import { NumberFieldValueComp, type Field, type NumberFieldValue } from '@/modules/fields';
import { Currency } from '@/shared';
import { observer } from 'mobx-react-lite';
import { BudgetRoot } from './BudgetRoot';

interface Props {
  disabled: boolean;
  budgetField: Field;
  budgetFieldValue: NumberFieldValue;
}

const ProjectBudgetBlock = observer((props: Props) => {
  const { disabled, budgetField, budgetFieldValue } = props;

  return (
    <BudgetRoot $disabled={disabled}>
      <NumberFieldValueComp
        maxWidth="240px"
        field={budgetField}
        fieldValue={budgetFieldValue as NumberFieldValue}
        alwaysShowCurrency={generalSettingsStore.accountSettings?.currency ?? Currency.USD}
      />
    </BudgetRoot>
  );
});

ProjectBudgetBlock.displayName = 'ProjectBudgetBlock';
export { ProjectBudgetBlock };
