import type { Nullable } from '@/shared';
import type { AutomationStore } from '../../../store';
import type { AutomationEntityType } from './AutomationEntityType/AutomationEntityType';

export interface AutomationModalBaseProps {
  stageId: Nullable<number>;
  isOpened: boolean;
  automationStore: AutomationStore;
  automation?: Nullable<AutomationEntityType>;
  onClose: () => void;
}
