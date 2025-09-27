import { InputModel, type MultiselectModel, type Option } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { AddressMultiInput } from '../AddressMultiInput/AddressMultiInput';
import { PseudoInputLabel } from '../Input/PseudoInputLabel';
import { PseudoInputLabelWrapper } from '../Input/PseudoInputLabelWrapper';
import { PseudoInputWrapper } from '../Input/PseudoInputWrapper';

interface Props {
  label: string;
  model: MultiselectModel<string>;
  recentsOptions: Option<string>[];
  invalid?: boolean;
  fromEntityOptions?: Option<string>[];
}

const MultiAddressMailField = observer((props: Props) => {
  const { label, model, recentsOptions, fromEntityOptions, invalid } = props;

  const [
    recentsPopoverOpened,
    { toggle: toggleRecentsPopover, close: hideRecentsPopover, open: showPopover },
  ] = useDisclosure(false);

  const tagInputModel = useLocalObservable<InputModel>(() => InputModel.create().emailRFC5322());

  return (
    <PseudoInputWrapper $invalid={invalid}>
      <PseudoInputLabelWrapper onClick={toggleRecentsPopover}>
        <PseudoInputLabel>{label}</PseudoInputLabel>

        <AddressMultiInput
          model={model}
          tagInputModel={tagInputModel}
          recentsOptions={recentsOptions}
          popoverOpened={recentsPopoverOpened}
          fromEntityOptions={fromEntityOptions}
          showPopover={showPopover}
          hidePopover={hideRecentsPopover}
        />
      </PseudoInputLabelWrapper>
    </PseudoInputWrapper>
  );
});

MultiAddressMailField.displayName = 'MultiAddressMailField';
export { MultiAddressMailField };
