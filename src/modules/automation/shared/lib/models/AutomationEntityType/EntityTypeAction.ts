import type { EntityTypeActionType, Nullable } from '@/shared';
import type { ActionActivityCreateSettings } from './ActionSettings/ActionActivityCreateSettings';
import type { ActionChatSendAmworkSettings } from './ActionSettings/ActionChatSendAmworkSettings';
import type { ActionChatSendSettings } from './ActionSettings/ActionChatSendSettings';
import type { ActionEmailSendSettings } from './ActionSettings/ActionEmailSendSettings';
import type { ActionEntityCreateSettings } from './ActionSettings/ActionEntityCreateSettings';
import type { ActionEntityLinkedStageChangeSettings } from './ActionSettings/ActionEntityLinkedStageChangeSettings';
import type { ActionEntityResponsibleChangeSettings } from './ActionSettings/ActionEntityResponsibleChangeSettings';
import type { ActionEntityStageChangeSettings } from './ActionSettings/ActionEntityStageChangeSettings';
import type { ActionHttpCallSettings } from './ActionSettings/ActionHttpCallSettings';
import type { ActionTaskCreateSettings } from './ActionSettings/ActionTaskCreateSettings';

export interface EntityTypeAction {
  type: EntityTypeActionType;
  delay?: Nullable<number>;
  settings:
    | ActionTaskCreateSettings
    | ActionActivityCreateSettings
    | ActionEntityStageChangeSettings
    | ActionEntityLinkedStageChangeSettings
    | ActionEntityCreateSettings
    | ActionEmailSendSettings
    | ActionChatSendAmworkSettings
    | ActionChatSendSettings
    | ActionEntityResponsibleChangeSettings
    | ActionHttpCallSettings;
}
