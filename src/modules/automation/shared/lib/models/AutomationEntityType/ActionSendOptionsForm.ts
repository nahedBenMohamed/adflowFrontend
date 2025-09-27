import type { BooleanModel, InputModel } from '@/shared';

export interface ActionSendOptionsForm {
  enabled: InputModel;
  main: {
    enabled: BooleanModel;
    onlyFirstValue: InputModel;
  };
  contact: {
    enabled: BooleanModel;
    actionSendVariant: InputModel;
  };
  company: {
    enabled: BooleanModel;
    actionSendVariant: InputModel;
  };
}
