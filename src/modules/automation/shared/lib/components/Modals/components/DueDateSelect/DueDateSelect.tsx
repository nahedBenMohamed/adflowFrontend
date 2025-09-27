import {
  CustomIntervalInputGroup,
  MySelectCustomTemplate,
  NumberModel,
  SelectOptionItem,
  SelectOptionItemRoot,
  SelectOptionsList,
  useDropdownWidth,
  useGetDHMDateStringFromSeconds,
  type Nullable,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useGetDueDateOptions } from '../../../../hooks/useGetDueDateOptions';
import { AutomationEntityTypeDeadline, DeadlineType } from '../../../../models';

interface Props {
  deadline: AutomationEntityTypeDeadline;
  onChange: (deadline: AutomationEntityTypeDeadline) => void;
}

const DueDateSelect = observer((props: Props) => {
  const { deadline, onChange } = props;

  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.modals.common.due_date_select',
  });

  const [isOpen, { close: hide, open: show }] = useDisclosure(false);

  const [dropdownWidth, titleRef] = useDropdownWidth();

  const { type: deadlineType, time: deadlineTime } = deadline;

  const handleSelect = (value: DeadlineType) => {
    const deadline = new AutomationEntityTypeDeadline({ type: value, time: null });

    onChange(deadline);
    hide();
  };

  const time = NumberModel.create(deadlineTime);

  const options = useGetDueDateOptions();

  const selectedOption = options.find(o => o.value === deadlineType);
  const isPredefined = deadline.type ? Boolean(selectedOption) : false;

  const formattedDeadlineTime = useGetDHMDateStringFromSeconds({ value: deadlineTime ?? 0 });

  const label = deadlineType
    ? isPredefined
      ? selectedOption
        ? selectedOption.label
        : undefined
      : deadlineTime
        ? formattedDeadlineTime
        : undefined
    : undefined;

  const handleCustomSave = (time: Nullable<number>) => {
    onChange(new AutomationEntityTypeDeadline({ type: DeadlineType.CUSTOM, time }));

    hide();
  };

  return (
    <MySelectCustomTemplate
      label={label}
      ref={titleRef}
      opened={isOpen}
      titleWidth="100%"
      variant="outlined"
      dropdownPadding={0}
      placeholder={t('due_date')}
      dropdownWidth={dropdownWidth}
      hide={hide}
      show={show}
    >
      <SelectOptionsList padding="8px">
        {options.map(o => (
          <SelectOptionItem
            key={o.value}
            label={o.label}
            active={deadline.type === o.value}
            onSelect={() => handleSelect(o.value)}
          />
        ))}

        <SelectOptionItemRoot $disableStates>
          <CustomIntervalInputGroup value={time.value} onChange={handleCustomSave} />
        </SelectOptionItemRoot>
      </SelectOptionsList>
    </MySelectCustomTemplate>
  );
});

DueDateSelect.displayName = 'DueDateSelect';
export { DueDateSelect };
