import { type Optional, SelectOptionItem, useDropdownWidth, type UtcDateValue } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { RefObject, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useOnClickOutside } from 'usehooks-ts';
import { generateMyDatePickerRangeTitle, useGetPeriodOptions } from '../../helpers';
import {
  type DatePeriodFilterModel,
  DatePeriodFilterType,
  type MySelectTitleRootVariant,
} from '../../models';
import { MySelectCustomTemplate } from '../Form/MySelect/MySelectCustomTemplate/MySelectCustomTemplate';
import { MyDatePeriodPicker } from '../MyDatePicker/MyDatePeriodPicker/MyDatePeriodPicker';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 8px;
`;

const Delimiter = styled.hr`
  width: 100%;
  height: 1px;

  margin: 4px 0;
  background-color: var(--graphite-graphite-80);
`;

const DatePeriodPickerWrapper = styled.div`
  width: 100%;

  padding: 4px 0;
`;

interface Props {
  createdAtModel: DatePeriodFilterModel;
  withQuarters?: boolean;
  titleWidth?: string;
  activeBgColor?: boolean;
  variant?: MySelectTitleRootVariant;
  handleApply: () => void;
}

const CreatedAtDateSelect = observer((props: Props) => {
  const {
    createdAtModel,
    activeBgColor,
    withQuarters,
    titleWidth,
    variant = 'outlined',
    handleApply,
  } = props;

  const { t } = useTranslation('component.section', {
    keyPrefix: 'section.common.filter_button.ui.date_period_picker',
  });

  const [opened, { close: hide, open: show }] = useDisclosure(false);

  const periodOptions = useGetPeriodOptions(withQuarters);

  const handleChangeCreatedAtTo = useCallback(
    (date: UtcDateValue) => {
      createdAtModel.to = date;

      if (date) createdAtModel.type = DatePeriodFilterType.PERIOD;

      handleApply();
    },
    [createdAtModel, handleApply]
  );

  const handleChangeCreatedAtFrom = useCallback(
    (date: UtcDateValue) => {
      createdAtModel.from = date;

      if (date) createdAtModel.type = DatePeriodFilterType.PERIOD;

      handleApply();
    },
    [createdAtModel, handleApply]
  );

  const [dropdownWidth, ref] = useDropdownWidth();

  const handleSelectType = (type: DatePeriodFilterType) => {
    createdAtModel.type = type;

    handleApply();
    hide();
  };

  const handleChangeTypeToPeriod = () => {
    createdAtModel.type = DatePeriodFilterType.PERIOD;

    handleApply();
  };

  const getLabel = (): Optional<string> => {
    if (createdAtModel.type === DatePeriodFilterType.PERIOD) {
      return generateMyDatePickerRangeTitle([
        createdAtModel.from ?? null,
        createdAtModel.to ?? null,
      ]);
    } else {
      const option = periodOptions.find(o => o.value === createdAtModel.type);

      return option ? option.label : t('placeholders.select_period');
    }
  };

  const label: Optional<string> = getLabel();

  useOnClickOutside(ref as RefObject<HTMLDivElement>, e => {
    const target = e.target as HTMLElement;

    if (target.closest('.workspace__MyDropdown--StyledDropdown')) return;

    hide();
  });

  return (
    <MySelectCustomTemplate
      ref={ref}
      withinPortal
      label={label}
      opened={opened}
      variant={variant}
      titleWidth={titleWidth}
      dropdownMinWidth="264px"
      closeOnClickOutside={false}
      dropdownWidth={dropdownWidth}
      activeBgColor={activeBgColor}
      placeholder={t('placeholders.select_period')}
      hide={hide}
      show={show}
    >
      <Root>
        {periodOptions.map(o => (
          <SelectOptionItem
            key={o.value}
            label={o.label}
            active={o.value === createdAtModel.type}
            onSelect={() => handleSelectType(o.value)}
          />
        ))}

        <Delimiter />

        <DatePeriodPickerWrapper onClick={handleChangeTypeToPeriod}>
          <MyDatePeriodPicker
            withinPortal
            position="left-end"
            to={createdAtModel.to}
            from={createdAtModel.from}
            handleChangeTo={handleChangeCreatedAtTo}
            handleChangeFrom={handleChangeCreatedAtFrom}
          />
        </DatePeriodPickerWrapper>
      </Root>
    </MySelectCustomTemplate>
  );
});

CreatedAtDateSelect.displayName = 'CreatedAtDateSelect';
export { CreatedAtDateSelect };
