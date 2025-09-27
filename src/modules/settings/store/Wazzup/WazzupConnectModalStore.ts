import {
  ChatProviderStatus,
  ChatProviderTransport,
  ChatProviderType,
  CreateWazzupProviderDto,
  UpdateWazzupProviderDto,
  WazzupChannelState,
  WazzupTransport,
  wazzupProviderSettingsApi,
  type WazzupChannel,
  type WazzupProvider,
} from '@/modules/multichat';
import {
  BooleanModel,
  InputModel,
  JsonStateHelper,
  MultiselectModel,
  SelectModel,
  validateForm,
  type Nullable,
  type Option,
} from '@/shared';
import { computed, makeAutoObservable } from 'mobx';
import { EntitySettingsStore } from '../EntitySettingsStore';
import { wazzupProviderSettingsStore } from './WazzupProviderSettingsStore';

const WAZZUP_DEFAULT_MESSAGE_PER_DAY_LIMIT = 10;

export class WazzupConnectModalStore {
  currentProviderSettings: Nullable<WazzupProvider> = null;
  wazzupStateParam: Nullable<string> = null;

  entitySettingsStore: EntitySettingsStore;

  title: InputModel;
  apiKey: InputModel;
  responsibleUserIds: MultiselectModel<number>;
  accessibleUserIds: MultiselectModel<number>;
  supervisorUserIds: MultiselectModel<number>;
  messagePerDay: SelectModel;
  active: BooleanModel;

  wazzupChannels: WazzupChannel[] = [];
  currentWazzupChannelId: SelectModel;

  areWazzupChannelsLoading = false;
  isCreatingWazzupProvider = false;
  isUpdatingWazzupProvider = false;
  isApiKeyLoading = false;

  jsonState: Nullable<JsonStateHelper> = null;

  initializeJsonState = (): void => {
    this.jsonState = new JsonStateHelper(() =>
      JSON.stringify([
        this.title.value,
        this.apiKey.value,
        this.responsibleUserIds.values,
        this.accessibleUserIds.values,
        this.supervisorUserIds.values,
        this.messagePerDay.value,
        this.active.value,
      ])
    );

    this.jsonState.calculateState();
  };

  constructor({
    wazzupStateParam,
    currentProviderSettings,
  }: {
    wazzupStateParam: Nullable<string>;
    currentProviderSettings: Nullable<WazzupProvider>;
  }) {
    this.currentProviderSettings = currentProviderSettings;
    this.wazzupStateParam = wazzupStateParam;

    this.entitySettingsStore = new EntitySettingsStore(currentProviderSettings?.entitySettings);

    this.title = InputModel.create(currentProviderSettings?.title ?? undefined).required();
    this.apiKey = InputModel.create().required();
    this.responsibleUserIds = MultiselectModel.create<number>(
      currentProviderSettings?.responsibleUserIds ?? []
    ).required();
    this.accessibleUserIds = MultiselectModel.create<number>(
      currentProviderSettings?.accessibleUserIds ?? []
    );
    this.supervisorUserIds = MultiselectModel.create<number>(
      currentProviderSettings?.supervisorUserIds ?? []
    );
    this.active = BooleanModel.create(currentProviderSettings?.isActive() ?? true);
    this.messagePerDay = SelectModel.create(
      currentProviderSettings?.messagePerDay ?? WAZZUP_DEFAULT_MESSAGE_PER_DAY_LIMIT
    ).required();

    this.currentWazzupChannelId = SelectModel.create(currentProviderSettings?.channelId).required();

    if (wazzupStateParam) this.initializeApiKeyByState(wazzupStateParam);

    this.initializeJsonState();

    makeAutoObservable(this);
  }

  get activeWazzupChannelsOptions(): Option<string>[] {
    const alreadyConnectedChannels: string[] =
      wazzupProviderSettingsStore.providersSettings.map<string>(p => p.channelId);

    return this.wazzupChannels
      .filter(
        c =>
          c.state === WazzupChannelState.ACTIVE && !alreadyConnectedChannels.includes(c.channelId)
      )
      .map(w => ({
        label: w.name,
        value: w.channelId,
      }));
  }

  get createDto(): CreateWazzupProviderDto {
    const wazzupChannel = this.getWazzupChannelById(this.currentWazzupChannelId.value);

    const chatProviderTransportToWazzupTransportMap: Record<
      WazzupTransport,
      ChatProviderTransport
    > = {
      [WazzupTransport.VK]: ChatProviderTransport.VK,
      [WazzupTransport.AVITO]: ChatProviderTransport.AVITO,
      [WazzupTransport.WAPI]: ChatProviderTransport.WHATSAPP,
      [WazzupTransport.TGAPI]: ChatProviderTransport.TELEGRAM,
      [WazzupTransport.TELEGRAM]: ChatProviderTransport.TELEGRAM,
      [WazzupTransport.WHATS_APP]: ChatProviderTransport.WHATSAPP,
      [WazzupTransport.INSTAGRAM]: ChatProviderTransport.INSTAGRAM,
    };

    return new CreateWazzupProviderDto({
      type: ChatProviderType.WAZZUP,
      title: this.title.trimmedValue,
      plainId: wazzupChannel.plainId,
      apiKey: this.apiKey.trimmedValue,
      channelId: wazzupChannel.channelId,
      messagePerDay: this.messagePerDay.value,
      channelTransport: wazzupChannel.transport,
      accessibleUserIds: this.accessibleUserIds.values,
      supervisorUserIds: this.supervisorUserIds.values,
      responsibleUserIds: this.responsibleUserIds.values,
      entitySettings: this.entitySettingsStore.updateDto,
      transport: chatProviderTransportToWazzupTransportMap[wazzupChannel.transport],
      status: this.active.value ? ChatProviderStatus.ACTIVE : ChatProviderStatus.INACTIVE,
    });
  }

  get updateDto(): UpdateWazzupProviderDto {
    return new UpdateWazzupProviderDto({
      title: this.title.trimmedValue,
      messagePerDay: this.messagePerDay.value,
      accessibleUserIds: this.accessibleUserIds.values,
      supervisorUserIds: this.supervisorUserIds.values,
      responsibleUserIds: this.responsibleUserIds.values,
      entitySettings: this.entitySettingsStore.updateDto,
      status: this.active.value ? ChatProviderStatus.ACTIVE : ChatProviderStatus.INACTIVE,
    });
  }

  createWazzupProviderSettings = async (): Promise<void> => {
    try {
      this.isCreatingWazzupProvider = true;

      await wazzupProviderSettingsStore.createProviderSettings(this.createDto);
    } catch (e) {
      throw new Error(`Failed to create wazzup provider settings ${this.createDto.title}: ${e}`);
    } finally {
      this.isCreatingWazzupProvider = false;
    }
  };

  updateWazzupProviderSettings = async (): Promise<void> => {
    if (!this.currentProviderSettings)
      throw new Error(
        `Failed to update wazzup provider settings: currentProviderSettings do not exist, received: ${this.currentProviderSettings}`
      );

    try {
      this.isUpdatingWazzupProvider = true;

      await wazzupProviderSettingsStore.updateProviderSettings({
        providerId: this.currentProviderSettings.id,
        dto: this.updateDto,
      });
    } catch (e) {
      throw new Error(`Failed to update wazzup provider settings ${this.updateDto.title}: ${e}`);
    } finally {
      this.isUpdatingWazzupProvider = false;
    }
  };

  initializeApiKeyByState = async (wazzupStateParam: string): Promise<void> => {
    try {
      this.isApiKeyLoading = true;

      this.apiKey.value = await wazzupProviderSettingsApi.getWazzupApiKeyByState(wazzupStateParam);

      this.loadWazzupChannelsByApiKey();
    } catch (e) {
      throw new Error(`Failed to initialize apiKey by state ${wazzupStateParam}: ${e}`);
    } finally {
      this.isApiKeyLoading = false;
    }
  };

  loadWazzupChannelsByApiKey = async (): Promise<void> => {
    if (!this.apiKey.validate()) return;

    try {
      this.areWazzupChannelsLoading = true;

      this.currentWazzupChannelId = SelectModel.create().required();

      this.wazzupChannels = await wazzupProviderSettingsApi.getWazzupProviderSettingsChannels(
        this.apiKey.value
      );
    } catch (e) {
      throw new Error(`Failed to load wazzup channels by apiKey: ${e}`);
    } finally {
      this.areWazzupChannelsLoading = false;
    }
  };

  getWazzupChannelById = (channelId: string): WazzupChannel => {
    const wazzupChannel = this.wazzupChannels.find(w => w.channelId === channelId);

    if (!wazzupChannel) throw new Error(`Wazzup channel with id ${channelId} was not found`);

    return wazzupChannel;
  };

  handleSelectWazzupChannel = (channelId: string): void => {
    const currentWazzupChannel = this.getWazzupChannelById(channelId);

    this.title.setValue(currentWazzupChannel.name);
  };

  validateForm = (): boolean => {
    if (this.currentProviderSettings) {
      return validateForm({
        0: this.title,
        2: this.responsibleUserIds,
        5: this.entitySettingsStore,
      });
      // apiKey is not needed if we have wazzupStateParam specified
    } else if (!this.wazzupStateParam) {
      return validateForm({
        0: this.title,
        1: this.apiKey,
        2: this.responsibleUserIds,
        3: this.currentProviderSettings,
        4: this.currentWazzupChannelId,
        5: this.entitySettingsStore,
      });
    } else {
      return validateForm({
        0: this.title,
        2: this.responsibleUserIds,
        3: this.currentProviderSettings,
        5: this.entitySettingsStore,
      });
    }
  };

  @computed.struct
  isJsonStateChanged = (): boolean => {
    if (this.jsonState)
      return this.jsonState.stateChanged || this.entitySettingsStore.isJsonStateChanged();

    return false;
  };
}
