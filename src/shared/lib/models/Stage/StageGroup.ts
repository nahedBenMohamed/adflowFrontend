import { type EntityBoardCard } from '../../../../modules/section/shared/lib/models/Entity/EntityBoardCard';
import { type Stage } from './Stage';

export interface StageGroup {
  id: number;
  stage: Stage;
  entities: EntityBoardCard[];
}
