import { iconStore } from '@/app';
import {
  MyCheckboxWithModel,
  SpanWithEllipsis,
  type CheckboxModel,
  type EntityType,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';

const Root = styled.div`
  width: 100%;
  max-width: 100%;
  height: fit-content;

  display: flex;
  flex-direction: column;
  gap: 12px;

  overflow: hidden;
`;

const ItemWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;

  overflow: hidden;
`;

const IconWrapper = styled.div<{ $moduleColor: string }>`
  width: 14px;
  height: 14px;

  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  svg {
    rect,
    circle,
    ellipse,
    path {
      fill: ${p => p.$moduleColor};
    }
  }
`;

interface Props {
  linkedEntityTypes: EntityType[];
  responsibleEntityTypeIds: CheckboxModel;
}

const LinkedEntitiesSelect = observer((props: Props) => {
  const { linkedEntityTypes, responsibleEntityTypeIds } = props;

  return (
    <Root>
      {linkedEntityTypes.map(et => (
        <ItemWrapper key={et.id}>
          <MyCheckboxWithModel model={responsibleEntityTypeIds} value={et.id} />

          <IconWrapper $moduleColor={iconStore.getEntityColorByEntityCategory(et.entityCategory)}>
            {iconStore.getByName(et.section.icon).icon}
          </IconWrapper>

          <SpanWithEllipsis text={et.name} />
        </ItemWrapper>
      ))}
    </Root>
  );
});

LinkedEntitiesSelect.displayName = 'LinkedEntitiesSelect';
export { LinkedEntitiesSelect };
