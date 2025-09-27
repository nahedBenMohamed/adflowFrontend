import { FilterItemWrapper, MySwitch, type Stage } from '@/shared';
import { observer } from 'mobx-react-lite';

interface Props {
  systemStages: Stage[];
  excludeStageIds: number[];
  handleChangeStageIds: (stageId: number) => void;
}

const FilterSystemStagesBlock = observer((props: Props) => {
  const { systemStages, excludeStageIds, handleChangeStageIds } = props;

  return systemStages.map(s => (
    <FilterItemWrapper key={s.id} label={s.name}>
      <MySwitch
        checked={Boolean(excludeStageIds && !excludeStageIds.includes(s.id))}
        onChange={() => handleChangeStageIds(s.id)}
      />
    </FilterItemWrapper>
  ));
});

FilterSystemStagesBlock.displayName = 'FilterSystemStagesBlock';
export { FilterSystemStagesBlock };
