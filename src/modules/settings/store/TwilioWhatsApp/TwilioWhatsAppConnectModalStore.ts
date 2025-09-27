import {
  ChatProviderStatus,
  ChatProviderTransport,
  ChatProviderType,
  CreateTwilioProviderDto,
  UpdateTwilioProviderDto,
  type TwilioProviderSettings,
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

const TWILIO_DEFAULT_MESSAGE_PER_DAY_LIMIT = 10;

export class TwilioWhatsAppConnectModalStore {
  title: InputModel;
  accountSid: InputModel;
  authToken: InputModel;
  phoneNumber: InputModel;
  responsibleUserIds: MultiselectModel<number>;
  accessibleUserIds: MultiselectModel<number>;
  active: BooleanModel;
  messagePerDay: SelectModel;
  supervisorUserIds: MultiselectModel<number>;

  entitySettingsStore: EntitySettingsStore;

  jsonState: Nullable<JsonStateHelper> = null;

  initializeJsonState = (): void => {
    this.jsonState = new JsonStateHelper(() =>
      JSON.stringify([
        this.title.value,
        this.accountSid.value,
        this.authToken.value,
        this.phoneNumber.value,
        this.responsibleUserIds.values,
        this.accessibleUserIds.values,
        this.active.value,
        this.messagePerDay.value,
        this.supervisorUserIds.values,
      ])
    );

    this.jsonState.calculateState();
  };

  constructor(currentProviderSettings: Nullable<TwilioProviderSettings>) {
    this.title = InputModel.create(currentProviderSettings?.title).required();
    this.accountSid = InputModel.create(currentProviderSettings?.accountSid).required();
    this.authToken = InputModel.create();
    this.phoneNumber = InputModel.create(currentProviderSettings?.phoneNumber)
      .required()
      .phoneInternational();
    this.responsibleUserIds = MultiselectModel.create<number>(
      currentProviderSettings?.responsibleUserIds ?? []
    ).required();
    this.accessibleUserIds = MultiselectModel.create<number>(
      currentProviderSettings?.accessibleUserIds ?? []
    );
    this.active = BooleanModel.create(currentProviderSettings?.isActive() ?? true);
    this.messagePerDay = SelectModel.create(
      currentProviderSettings?.messagePerDay ?? TWILIO_DEFAULT_MESSAGE_PER_DAY_LIMIT
    ).required();
    this.supervisorUserIds = MultiselectModel.create<number>(
      currentProviderSettings?.supervisorUserIds ?? []
    );

    this.entitySettingsStore = new EntitySettingsStore(currentProviderSettings?.entitySettings);

    this.initializeJsonState();

    makeAutoObservable(this);
  }

  get updateDto(): UpdateTwilioProviderDto {
    return new UpdateTwilioProviderDto({
      title: this.title.value,
      accountSid: this.accountSid.value,
      phoneNumber: this.phoneNumber.value,
      accessibleUserIds: this.accessibleUserIds.values,
      supervisorUserIds: this.supervisorUserIds.values,
      responsibleUserIds: this.responsibleUserIds.values,
      authToken: this.authToken.value ? this.authToken.value : null,
      messagePerDay: this.messagePerDay.value,
      status: this.active.value ? ChatProviderStatus.ACTIVE : ChatProviderStatus.INACTIVE,
      entitySettings: this.entitySettingsStore.updateDto,
    });
  }

  get createDto(): CreateTwilioProviderDto {
    return new CreateTwilioProviderDto({
      title: this.title.value,
      type: ChatProviderType.TWILIO,
      authToken: this.authToken.value,
      accountSid: this.accountSid.value,
      phoneNumber: this.phoneNumber.value,
      transport: ChatProviderTransport.WHATSAPP,
      accessibleUserIds: this.accessibleUserIds.values,
      supervisorUserIds: this.supervisorUserIds.values,
      responsibleUserIds: this.responsibleUserIds.values,
      status: this.active.value ? ChatProviderStatus.ACTIVE : ChatProviderStatus.INACTIVE,
      entitySettings: this.entitySettingsStore.updateDto,
    });
  }

  validateForm = (): boolean => {
    return validateForm(this);
  };

  @computed.struct
  isJsonStateChanged = (): boolean => {
    if (this.jsonState)
      return this.jsonState.stateChanged || this.entitySettingsStore.isJsonStateChanged();

    return false;
  };
}
