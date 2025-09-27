import { routes } from '@/app';
import { LinkedEntityTag, SpanWithEllipsis, type EntityInfo, type Nullable } from '@/shared';
import type { CellContext } from '@tanstack/react-table';
import { observer } from 'mobx-react-lite';
import type { TaskRow } from '../../../../../models';

interface Props {
  cellContext: CellContext<TaskRow, Nullable<EntityInfo>>;
  currentPathname?: string;
}

const TaskLinkedEntityCell = observer((props: Props) => {
  const { cellContext, currentPathname } = props;

  const { entityInfo } = cellContext.row.original;

  return (
    entityInfo && (
      <LinkedEntityTag
        to={routes.card({
          from: currentPathname,
          entityId: entityInfo.id,
          entityTypeId: entityInfo.entityTypeId,
        })}
        $disabled={!entityInfo.hasAccess}
      >
        <SpanWithEllipsis text={entityInfo.name} />
      </LinkedEntityTag>
    )
  );
});

TaskLinkedEntityCell.displayName = 'TaskLinkedEntityCell';
export { TaskLinkedEntityCell };
