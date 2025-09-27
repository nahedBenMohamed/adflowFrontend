import {
  MiniLoader,
  MyDropdown,
  PickerButton,
  SelectOptionItem,
  SelectOptionsList,
  type Nullable,
  type Option,
  type Time,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TimerIcon } from '../../../../../assets';

interface Props {
  selected: Nullable<Time>;
  times: Time[];
  loading?: boolean;
  onSelect: (time: Time) => void;
}

const TimePicker = observer((props: Props) => {
  const { selected, times, loading, onSelect } = props;

  const { t } = useTranslation();

  const [opened, { close: hide, open: show }] = useDisclosure(false);

  const options = useMemo<Option<string>[]>(
    () =>
      times.map<Option<string>>(i => ({
        label: i.label,
        value: i.label,
      })),
    [times]
  );

  const handleSelect = useCallback(
    (option: Option<string>) => {
      const time = times.find(i => i.label === option.label);

      if (!time) return;

      onSelect(time);
      hide();
    },
    [times, onSelect, hide]
  );

  const selectedLabel = loading ? t('loading') : selected ? selected.label : t('select');

  return (
    <MyDropdown
      withinPortal
      position="bottom-start"
      opened={opened}
      disabled={loading}
      Button={
        <PickerButton
          Icon={loading ? <MiniLoader color="var(--primary-statuses-green-520)" /> : <TimerIcon />}
          iconOutlined={false}
          value={selectedLabel}
          active={opened || !!selectedLabel}
        />
      }
      hide={hide}
      show={show}
    >
      <SelectOptionsList padding="8px">
        {options.map(o => (
          <SelectOptionItem
            monoDigits
            key={o.value}
            label={o.label}
            active={o.label === selectedLabel}
            focused={o.label === selectedLabel}
            onSelect={() => handleSelect(o)}
          />
        ))}
      </SelectOptionsList>
    </MyDropdown>
  );
});

TimePicker.displayName = 'TimePicker';
export { TimePicker };
