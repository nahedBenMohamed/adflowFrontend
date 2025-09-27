import type { WazzupChannelState, WazzupTransport } from '../../../shared';

export interface WazzupChannelDto {
  name: string;
  plainId: string;
  channelId: string;
  state: WazzupChannelState;
  transport: WazzupTransport;
}
