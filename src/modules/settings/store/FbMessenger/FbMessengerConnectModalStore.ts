import {
  ChatProviderStatus,
  UpdateMessengerProviderDto,
  type MessengerProviderSettings,
} from '@/modules/multichat';
import {
  BooleanModel,
  InputModel,
  JsonStateHelper,
  MultiselectModel,
  SelectModel,
  validateForm,
  type Nullable,
} from '@/shared';
import { computed, makeAutoObservable } from 'mobx';
import { EntitySettingsStore } from '../EntitySettingsStore';

const FB_DEFAULT_MESSAGE_PER_DAY_LIMIT = 10;

export class FbMessengerConnectModalStore {
  title: InputModel;
  responsibleUserIds: MultiselectModel<number>;
  accessibleUserIds: MultiselectModel<number>;
  supervisorUserIds: MultiselectModel<number>;
  messagePerDay: SelectModel;
  active: BooleanModel;

  entitySettingsStore: EntitySettingsStore;

  jsonState: Nullable<JsonStateHelper> = null;

  initializeJsonState = (): void => {
    this.jsonState = new JsonStateHelper(() =>
      JSON.stringify([
        this.title.value,
        this.responsibleUserIds.values,
        this.accessibleUserIds.values,
        this.supervisorUserIds.values,
        this.messagePerDay.value,
        this.active.value,
      ])
    );

    this.jsonState.calculateState();
  };

  constructor(currentProviderSettings: MessengerProviderSettings) {
    this.title = InputModel.create(currentProviderSettings.title).required();
    this.responsibleUserIds = MultiselectModel.create<number>(
      currentProviderSettings.responsibleUserIds
    ).required();
    this.accessibleUserIds = MultiselectModel.create<number>(
      currentProviderSettings.accessibleUserIds
    );
    this.active = BooleanModel.create(currentProviderSettings.status === ChatProviderStatus.ACTIVE);
    this.supervisorUserIds = MultiselectModel.create<number>(
      currentProviderSettings.supervisorUserIds ?? []
    );
    this.messagePerDay = SelectModel.create(
      currentProviderSettings.messagePerDay ?? FB_DEFAULT_MESSAGE_PER_DAY_LIMIT
    ).required();

    this.entitySettingsStore = new EntitySettingsStore(currentProviderSettings?.entitySettings);

    this.initializeJsonState();

    makeAutoObservable(this);
  }

  validateForm = (): boolean => {
    return validateForm(this);
  };

  get updateDto(): UpdateMessengerProviderDto {
    return new UpdateMessengerProviderDto({
      title: this.title.value,
      supervisorUserIds: this.supervisorUserIds.values,
      accessibleUserIds: this.accessibleUserIds.values,
      responsibleUserIds: this.responsibleUserIds.values,
      messagePerDay: this.messagePerDay.value,
      status: this.active.value ? ChatProviderStatus.ACTIVE : ChatProviderStatus.INACTIVE,
      entitySettings: this.entitySettingsStore.updateDto,
    });
  }

  @computed.struct
  isJsonStateChanged = (): boolean => {
    if (this.jsonState)
      return this.jsonState.stateChanged || this.entitySettingsStore.isJsonStateChanged();

    return false;
  };
}
