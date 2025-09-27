import { iconStore } from '@/app';
import {
  AutomationBlock,
  type AutomationStore,
  getActionTypeEntityTypeInfos,
} from '@/modules/automation';
import { type EntityType } from '@/shared';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';

const Root = styled.div`
  position: relative;

  min-width: 179px;

  display: flex;
  flex-direction: column;
  gap: 16px;

  border-radius: var(--border-radius-block);
  margin-right: 11px;
`;

const actionTypeEntityTypeInfos = getActionTypeEntityTypeInfos(true);

interface Props {
  entityType: EntityType;
  automationStore?: AutomationStore;
}

const EntitiesListAutomationColumn = observer((props: Props) => {
  const { entityType, automationStore } = props;

  const color = iconStore.getEntityColorByEntityCategory(entityType.entityCategory);

  return (
    <Root>
      {automationStore &&
        actionTypeEntityTypeInfos.map(a => (
          <AutomationBlock
            key={a.type}
            type={a.type}
            stageId={null}
            headerColor={color}
            automationStore={automationStore}
            automations={automationStore.getByTypeAndStageId({
              type: a.type,
              stageId: null,
            })}
          />
        ))}
    </Root>
  );
});

EntitiesListAutomationColumn.displayName = 'EntitiesListAutomationColumn';
export { EntitiesListAutomationColumn };
