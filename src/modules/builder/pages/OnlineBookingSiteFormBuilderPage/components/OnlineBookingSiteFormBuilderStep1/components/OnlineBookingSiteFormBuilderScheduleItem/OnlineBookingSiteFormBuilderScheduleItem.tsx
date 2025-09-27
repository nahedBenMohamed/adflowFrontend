import { iconStore } from '@/app';
import type { Schedule } from '@/modules/scheduler';
import {
  type CheckboxModel,
  MyCheckboxSkeleton,
  MyCheckboxWithModel,
  SpanWithEllipsis,
  TruncateMixin,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';

const Root = styled.li`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  padding: 12px 16px;
  border-radius: var(--border-radius-element);
  box-shadow:
    0px 0px 2px 0px #eef4fe,
    0px 1px 2px 0px #d0daeb;

  ${TruncateMixin}
`;

const LeftBlock = styled.label`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;

  ${TruncateMixin}
`;

const NameWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin}
`;

const IconWrapper = styled.div<{ $iconColor: string }>`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: auto;
  }

  svg rect,
  svg circle,
  svg ellipse,
  svg path {
    fill: ${p => p.$iconColor};
  }
`;

interface Props {
  schedule: Schedule;
  model: CheckboxModel;
  loading: boolean;
  handleChange: () => void;
}

const OnlineBookingSiteFormBuilderScheduleItem = observer((props: Props) => {
  const { schedule, model, loading, handleChange } = props;

  const { icon } = iconStore.defaultSchedulerIcon;
  const iconColor = iconStore.schedulerColor;

  return (
    <Root>
      <LeftBlock>
        {loading ? (
          <MyCheckboxSkeleton bigger />
        ) : (
          <MyCheckboxWithModel
            model={model}
            variant="bigger"
            value={schedule.id}
            handleChange={handleChange}
          />
        )}

        <NameWrapper>
          <IconWrapper $iconColor={iconColor}>{icon}</IconWrapper>

          <SpanWithEllipsis text={schedule.name} />
        </NameWrapper>
      </LeftBlock>
    </Root>
  );
});

export { OnlineBookingSiteFormBuilderScheduleItem };
