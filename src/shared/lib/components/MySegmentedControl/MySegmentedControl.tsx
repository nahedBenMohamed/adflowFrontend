import { Nullable } from '@/shared';
import { SegmentedControl, type SegmentedControlItem } from '@mantine/core';
import { memo } from 'react';
import styled from 'styled-components';

const Root = styled(SegmentedControl)`
  width: 100%;

  overflow: visible;
  background-color: var(--graphite-graphite-40);
  border-radius: var(--border-radius-block);

  .mantine-SegmentedControl-indicator {
    background-color: var(--primary-statuses-white-0);
    box-shadow:
      0px 1px 2px 0px #d0daeb,
      0px 0px 2px 0px #eef4fe;
  }

  .mantine-SegmentedControl-label {
    padding: 0;

    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: var(--button-text-graphite-secondary-text);
    transition: color var(--transition-200);

    &[data-active] {
      color: var(--button-text-graphite-priory-text);
    }
  }
`;

const SegmentTitle = styled.div`
  padding: 2px 16px;
`;

interface Props {
  controlItems: SegmentedControlItem[];
  value?: string;
  onChange: (value: Nullable<string>) => void;
}

const MySegmentedControl = memo((props: Props) => {
  const { controlItems, value, onChange } = props;

  const segmentedControlData = controlItems.map<SegmentedControlItem>(d => ({
    value: d.value,
    label: <SegmentTitle>{d.label}</SegmentTitle>,
  }));

  return <Root value={value} onChange={onChange} data={segmentedControlData} />;
});

MySegmentedControl.displayName = 'MySegmentedControl';
export { MySegmentedControl };
