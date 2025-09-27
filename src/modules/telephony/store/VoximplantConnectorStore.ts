import { generalSettingsStore } from '@/app';
import { authStore } from '@/modules/auth';
import {
  EntityApiUtil,
  FieldType,
  Language,
  delay,
  type DataStore,
  type EntityInfo,
  type Nullable,
  type Optional,
} from '@/shared';
import { envUtil } from '@/shared/lib/utils/EnvUtil';
import { makeAutoObservable, toJS } from 'mobx';
import * as VoxImplant from 'voximplant-websdk';
import type { Call } from 'voximplant-websdk/Call/Call';
import type { Client } from 'voximplant-websdk/Client';
import type { CallSettings } from 'voximplant-websdk/Structures';
import { UpdateVoximplantCallDto, voximplantApi } from '../api';
import type { VoximplantAccount, VoximplantUser } from '../shared';

type CallType = 'incoming' | 'outgoing';

enum CallMessageType {
  TRANSFER = 'transfer',
}

interface CallState {
  tone: string;
  muted: boolean;
  type: CallType;
  started: boolean;
  connected: boolean;
  call: Nullable<Call>;
  callFromNumber: Nullable<string>;
  callFromSipRegExternalId: Nullable<number>;
  entityInfo: Nullable<EntityInfo>;
  linkedEntityInfo: Nullable<EntityInfo>;
  sessionId?: string;
}

const defaultOutgoingCallState: CallState = {
  tone: '',
  muted: false,
  type: 'outgoing',
  started: false,
  connected: false,
  call: null,
  callFromNumber: null,
  callFromSipRegExternalId: null,
  entityInfo: null,
  linkedEntityInfo: null,
  sessionId: undefined,
};

const SOUND_PUBLIC_PATH = '/sounds/incoming_call.mp3';

const ENTITY_ID_HEADER = 'X-Entity-ID';
const PHONE_NUMBER_HEADER = 'X-Phone-Number';
const SIP_REG_ID_HEADER = 'X-SIP-Reg-ID';

class VoximplantConnectorStore implements DataStore {
  private _incomingCallAudio = new Audio(SOUND_PUBLIC_PATH);

  voximplant: Client;

  connectedToVoximplant = false;
  loggedIn = false;

  user: Nullable<VoximplantUser> = null;
  account: Nullable<VoximplantAccount> = null;

  callState: CallState = defaultOutgoingCallState;

  isCreatingAccount = false;
  isLoaded = false;

  // to control the opening of the modal window
  setOpened: Nullable<(opened: boolean) => void> = null;
  reloadFeed: Nullable<() => void> = null;

  constructor() {
    this.voximplant = VoxImplant.getInstance();

    this.voximplant.init({
      node: envUtil.voximplantConnectionNode,
    });

    makeAutoObservable(this);
  }

  get callId(): Optional<string> {
    return this.callState.call?.id();
  }

  getBillingManagementLink = (): Optional<string> => {
    if (!this.account) return;

    const { apiKey, accountId } = this.account;

    return `https://billing.voximplant.com?api_key=${apiKey}&account_id=${accountId}&_lang=${
      generalSettingsStore.accountSettings?.language === Language.RUSSIAN ? 'RU' : 'EN'
    }`;
  };

  playIncomingCallMedia = (): void => {
    this._incomingCallAudio.play();
  };

  setOpenerFn = (setOpened: (opened: boolean) => void): void => {
    this.setOpened = setOpened;
  };

  setReloadFeedFn = (reloadFeed: () => void): void => {
    this.reloadFeed = reloadFeed;
  };

  createVoximplantAccount = async (): Promise<void> => {
    try {
      this.isCreatingAccount = true;

      this.account = await voximplantApi.createVoximplantAccount();
    } catch (e) {
      throw new Error(`Failed to create Voximplant account: ${e}`);
    } finally {
      this.isCreatingAccount = false;
    }
  };

  loadVoximplantAccount = async (): Promise<void> => {
    try {
      this.account = await voximplantApi.getVoximplantAccount();
    } catch (e) {
      throw new Error(`Failed to load Voximplant account: ${e}`);
    }
  };

  loadVoximplantUser = async (): Promise<void> => {
    if (!authStore.user)
      throw new Error(`Failed to load Voximplant user: user is not authenticated`);

    try {
      this.user = await voximplantApi.getVoximplantUser(authStore.user.id);

      if (this.user.isActive && !this.connectedToVoximplant) {
        await this.voximplant.connect();

        this.connectedToVoximplant = true;
      } else if (this.connectedToVoximplant) {
        await this.voximplant.disconnect();

        this.connectedToVoximplant = false;
        this.loggedIn = false;

        this.setOpened?.(false);
      }
    } catch (e) {
      throw new Error(`Failed to load Voximplant user: ${e}`);
    }
  };

  loadData = async (): Promise<void> => {
    if (!envUtil.voximplantShowTelephony) return;

    try {
      this.isLoaded = false;

      await Promise.all([this.loadVoximplantAccount(), this.loadVoximplantUser()]);

      await this.login();
    } catch (e) {
      throw new Error(`Failed to load Voximplant account: ${e}`);
    } finally {
      this.isLoaded = true;
    }
  };

  login = async (): Promise<void> => {
    try {
      if (!this.account || !this.user || !this.connectedToVoximplant) return;

      const username = `${this.user.userName}@${this.account.applicationName}`;

      const { code, key } = await this.voximplant.requestOneTimeLoginKey(username);

      if (code === 302 && key) {
        const token = await voximplantApi.getLoginToken(key);

        await this.voximplant.loginWithOneTimeKey(username, token);

        this.loggedIn = true;

        this.subscribeToIncomingCalls();
      }
    } catch (e) {
      this.loggedIn = false;

      throw new Error(`Failed to login to Voximplant: ${e}`);
    }
  };

  getEntityInfo = async ({
    phone,
    delayMs = 750,
    sessionId,
  }: {
    phone: string;
    delayMs?: number;
    sessionId?: string;
  }): Promise<void> => {
    if (phone.length < 6) {
      if (delayMs) return await delay(delayMs);

      return;
    }

    const startTime = performance.now();

    const { entity, linked } = await EntityApiUtil.findOneEntityForCall({
      fieldType: FieldType.PHONE,
      fieldValue: phone,
    });

    if (delayMs) {
      const endTime = performance.now();
      const searchTime = endTime - startTime;

      // we need to wait to avoid flickering
      if (searchTime < delayMs) await delay(delayMs - searchTime);
    }

    this.setEntityInfo(entity);
    this.setLinkedEntityInfo(linked);

    if (sessionId && entity)
      this.patchUpdateCall({
        sessionId,
        dto: UpdateVoximplantCallDto.create({
          entityId: entity.id,
        }),
      });
  };

  subscribeToIncomingCalls = (): void => {
    if (!this.loggedIn) return;

    this.voximplant.on(VoxImplant.Events.IncomingCall, e => {
      // we allow only one active call a time
      if (this.callState.call) {
        e.call.decline();

        return;
      }

      const intervalId = setInterval(() => {
        this.playIncomingCallMedia();
      }, 3000);

      const call: Call = e.call;

      this.callState.call = call;
      this.callState.type = 'incoming';
      this.callState.started = true;

      this.setOpened?.(true);

      call.addDefaultEventListener(VoxImplant.CallEvents.MessageReceived, e => {
        const { sessionId } = JSON.parse(e.text) as { sessionId: string };

        if (sessionId) {
          this.callState.sessionId = sessionId;

          this.getEntityInfo({ phone: call.displayName(), sessionId });
        }
      });

      call.addDefaultEventListener(VoxImplant.CallEvents.Connected, () => {
        clearInterval(intervalId);

        this.callState.connected = true;

        this.getEntityInfo({ phone: call.displayName() });
      });

      call.addDefaultEventListener(VoxImplant.CallEvents.Disconnected, () => {
        clearInterval(intervalId);

        // we want to close the modal window when the incoming call is over
        this.setOpened?.(false);

        this.clearCallState();
      });

      call.addDefaultEventListener(VoxImplant.CallEvents.Failed, () => {
        clearInterval(intervalId);

        this.clearCallState();

        console.error(`Incoming call failed with status code ${e.code}: ${e.reason}`);
      });
    });
  };

  startOutgoingCallFromSipRegistration = async ({
    callToNumber,
    callFromSipRegExternalId,
    handlers,
  }: {
    callToNumber: string;
    callFromSipRegExternalId: number;
    handlers?: {
      onInfoReceived?: () => void;
    };
  }): Promise<void> => {
    if (this.callState.call) {
      console.error(
        `Failed to start outgoing call, call already exists ${this.callState.call.id()}, there must be only one active call at a time`
      );

      return;
    }

    this.callState.callFromSipRegExternalId = callFromSipRegExternalId;

    const extraHeaders: CallSettings['extraHeaders'] = {
      [SIP_REG_ID_HEADER]: String(callFromSipRegExternalId),
    };

    const callSettings: CallSettings = {
      extraHeaders,
      number: callToNumber,
      video: {
        sendVideo: false,
        receiveVideo: false,
      },
    };

    await this._startOutgoingCall({ callSettings, handlers });
  };

  startOutgoingCallFromNumber = async ({
    callToNumber,
    callFromNumber,
    handlers,
  }: {
    callToNumber: string;
    callFromNumber: string;
    handlers?: {
      onInfoReceived?: () => void;
    };
  }): Promise<void> => {
    if (this.callState.call) {
      console.error(
        `Failed to start outgoing call, call already exists ${this.callState.call.id()}, there must be only one active call at a time`
      );

      return;
    }

    this.callState.callFromNumber = callFromNumber;

    const extraHeaders: CallSettings['extraHeaders'] = {
      [PHONE_NUMBER_HEADER]: callFromNumber,
    };

    const callSettings: CallSettings = {
      extraHeaders,
      number: callToNumber,
      video: {
        sendVideo: false,
        receiveVideo: false,
      },
    };

    await this._startOutgoingCall({ callSettings, handlers });
  };

  private _startOutgoingCall = async ({
    callSettings,
    handlers,
  }: {
    callSettings: CallSettings;
    handlers?: {
      onInfoReceived?: () => void;
    };
  }): Promise<void> => {
    if (!this.loggedIn) {
      console.error(`Failed to start outgoing call, telephony user is not logged in`);

      return;
    }

    if (this.callState.call) {
      console.error(
        `Failed to start outgoing call, call already exists, ${JSON.stringify(this.callState.call)}`
      );

      return;
    }

    if (!this.callState.entityInfo)
      await this.getEntityInfo({ phone: callSettings.number, delayMs: 0 });

    if (this.callState.entityInfo) {
      if (!callSettings.extraHeaders) callSettings.extraHeaders = {};

      callSettings.extraHeaders[ENTITY_ID_HEADER] = `${this.callState.entityInfo.id}`;
    }

    this.callState.call = this.voximplant.call(callSettings);
    this.callState.type = 'outgoing';

    const call = this.callState.call;

    const keydownEventListener = (e: KeyboardEvent): void => {
      // allowed tone keys are 0-9, *, #
      const allowedToneKeysRegexp = /^[0-9*#]$/;

      if (this.callState.call && allowedToneKeysRegexp.test(e.key)) {
        this.callState.call.sendTone(e.key);
        this.callState.tone += e.key;
      }
    };

    call.addDefaultEventListener(VoxImplant.CallEvents.InfoReceived, () => {
      this.callState.started = true;

      if (handlers) handlers.onInfoReceived?.();
    });

    call.addDefaultEventListener(VoxImplant.CallEvents.Connected, () => {
      this.callState.connected = true;

      if (!this.callState.entityInfo)
        this.getEntityInfo({ phone: callSettings.number, delayMs: 0 });

      window.addEventListener('keydown', keydownEventListener);
    });

    call.addDefaultEventListener(VoxImplant.CallEvents.Disconnected, () => {
      this.reloadFeed?.();
      this.clearCallState();

      window.removeEventListener('keydown', keydownEventListener);
    });

    call.addDefaultEventListener(VoxImplant.CallEvents.Failed, e => {
      this.reloadFeed?.();
      this.clearCallState();

      console.error(`Outgoing call failed with status code ${e.code}: ${e.reason}`);

      window.removeEventListener('keydown', keydownEventListener);
    });

    // double check whether the entity or linked entity exists
    if (!this.callState.entityInfo && callSettings.number.length >= 6) {
      const { entity, linked } = await EntityApiUtil.findOneEntityForCall({
        fieldType: FieldType.PHONE,
        fieldValue: callSettings.number,
      });

      this.setEntityInfo(entity);
      this.setLinkedEntityInfo(linked);
    }
  };

  acceptCall = (): void => {
    if (!this.callState.call) {
      console.error(`Failed to accept incoming call, call does not exist`);

      return;
    }

    this.callState.call.answer();
  };

  hangupCall = (): void => {
    if (!this.callState.call) {
      console.error(`Failed to hangup outgoing call, call already does not exist`);

      return;
    }

    // if incoming call was started but not connected hang up will decline the call
    if (this.callState.started && !this.callState.connected && this.callState.type === 'incoming')
      this.callState.call.decline();

    this.callState.call.hangup();
    this.clearCallState();

    if (this.callState.type === 'incoming') this.setOpened?.(false);
  };

  transferCall = (operatorId: number): void => {
    const { user: currentUser } = authStore;

    if (!this.callState.call || !currentUser) {
      console.error(`Failed to transfer call, call or user does not exist`);

      return;
    }

    this.callState.call.setActive(false);

    const initialCall = toJS(this.callState.call);
    const initialCallType = toJS(this.callState.type);

    this.clearCallState();
    this.setOpened?.(false);

    initialCall.sendMessage(
      JSON.stringify({
        type: CallMessageType.TRANSFER,
        phoneNumber:
          initialCallType === 'incoming' ? initialCall.displayName() : initialCall.number(),
        transferTo: this.generateVoximplantUserName(operatorId),
        transferFrom: this.generateVoximplantUserName(currentUser.id),
      })
    );
  };

  generateVoximplantUserName = (id: number): string => {
    return `user-${id}`;
  };

  clearCallState = (): void => {
    this.callState = defaultOutgoingCallState;
  };

  toggleMuteMicrophone = (): void => {
    if (!this.callState.call) {
      console.error(`Failed to mute microphone, call does not exist`);

      return;
    }

    this.callState.muted
      ? this.callState.call.unmuteMicrophone()
      : this.callState.call.muteMicrophone();

    this.callState.muted = !this.callState.muted;
  };

  patchUpdateCall = async ({
    sessionId,
    dto,
  }: {
    sessionId: string;
    dto: UpdateVoximplantCallDto;
  }): Promise<void> => {
    voximplantApi.patchVoximplantCall({
      externalId: sessionId,
      dto,
    });
  };

  setEntityInfo = (entityInfo: Nullable<EntityInfo>): void => {
    this.callState.entityInfo = entityInfo;
  };

  setLinkedEntityInfo = (linkedEntityInfo: Nullable<EntityInfo>): void => {
    this.callState.linkedEntityInfo = linkedEntityInfo;
  };

  reset = (): void => {
    if (this.connectedToVoximplant) {
      this.voximplant.disconnect();

      this.connectedToVoximplant = false;
      this.loggedIn = false;
    }

    this.account = null;
    this.user = null;

    this.clearCallState();

    this.setOpened?.(false);
    this.setOpened = null;
  };
}

export const voximplantConnectorStore = new VoximplantConnectorStore();
