import {
  CustomIntervalInputGroup,
  MySelectCustomTemplate,
  type Nullable,
  type NumberModel,
  SelectOptionItem,
  SelectOptionItemRoot,
  SelectOptionsList,
  useDropdownWidth,
  useGetDHMDateStringFromSeconds,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetDeferStartOptions } from '../../../../hooks';

interface Props {
  model: NumberModel;
}

const DeferStartSelect = observer((props: Props) => {
  const { model } = props;

  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.modals.common.defer_start_select',
  });

  const [isOpened, { close, open }] = useDisclosure(false);

  const [dropdownWidth, titleRef] = useDropdownWidth();

  const handleSelect = useCallback(
    (value: Nullable<number>) => {
      model.setValue(value);

      close();
    },
    [close, model]
  );

  const getSelectHandler = useCallback(
    (value: Nullable<number>) => () => handleSelect(value),
    [handleSelect]
  );

  const options = useGetDeferStartOptions();

  const selectedOption = options.find(o => o.value === model.value);

  const formattedDeadlineTime = useGetDHMDateStringFromSeconds({ value: model.value ?? 0 });

  const label = selectedOption ? selectedOption.label : formattedDeadlineTime;

  return (
    <MySelectCustomTemplate
      label={label}
      ref={titleRef}
      opened={isOpened}
      titleWidth="100%"
      variant="outlined"
      dropdownPadding={0}
      placeholder={t('defer_start')}
      dropdownWidth={dropdownWidth}
      hide={close}
      show={open}
    >
      <SelectOptionsList padding="8px">
        {options.map(o => (
          <SelectOptionItem
            key={o.value}
            label={o.label}
            active={model.value === o.value}
            onSelect={getSelectHandler(o.value)}
          />
        ))}

        <SelectOptionItemRoot $disableStates>
          <CustomIntervalInputGroup value={model.value} onChange={handleSelect} />
        </SelectOptionItemRoot>
      </SelectOptionsList>
    </MySelectCustomTemplate>
  );
});

DeferStartSelect.displayName = 'DeferStartSelect';
export { DeferStartSelect };
