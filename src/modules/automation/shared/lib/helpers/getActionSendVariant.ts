import type { Nullable } from '@/shared';
import { ActionSendVariant } from '../models';

export const getActionSendVariant = ({
  onlyFirstValue,
  onlyFirstEntity,
}: {
  onlyFirstValue?: Nullable<boolean>;
  onlyFirstEntity?: Nullable<boolean>;
}) => {
  // transform 2 boolean parameters to 1 merged variant

  if (onlyFirstEntity && onlyFirstValue) return ActionSendVariant.FIRST_ENTITY_FIRST_VALUE;

  if (onlyFirstEntity && !onlyFirstValue) return ActionSendVariant.FIRST_ENTITY_ALL_VALUES;

  if (!onlyFirstEntity && onlyFirstValue) return ActionSendVariant.ALL_ENTITIES_FIRST_VALUE;

  if (!onlyFirstEntity && !onlyFirstValue) return ActionSendVariant.ALL_ENTITIES_ALL_VALUES;
};
