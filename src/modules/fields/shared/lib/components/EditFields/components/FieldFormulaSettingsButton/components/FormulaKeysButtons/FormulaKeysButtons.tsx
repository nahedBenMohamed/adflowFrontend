import { memo } from 'react';
import type { FormulaKey } from '../../../../../../models';
import { FormulaKeyButton } from '../FormulaKeyButton/FormulaKeyButton';

interface Props {
  formulaKeys: FormulaKey[];
}

const FormulaKeysButtons = memo((props: Props) => {
  const { formulaKeys } = props;

  return formulaKeys.map(({ label, smallText, secondary, outlined, danger, handler }, idx) => (
    <FormulaKeyButton
      key={idx}
      $danger={danger}
      $outlined={outlined}
      $secondary={secondary}
      $smallText={smallText}
      onClick={handler}
    >
      {label}
    </FormulaKeyButton>
  ));
});

FormulaKeysButtons.displayName = 'FormulaKeysButtons';
export { FormulaKeysButtons };
