import type { WazzupChannelDto } from '../../../../api';
import type { WazzupChannelState } from './WazzupChanelState';
import type { WazzupTransport } from './WazzupTransport';

export class WazzupChannel {
  name: string;
  plainId: string;
  channelId: string;
  state: WazzupChannelState;
  transport: WazzupTransport;

  constructor({ name, plainId, channelId, state, transport }: WazzupChannel) {
    this.name = name;
    this.plainId = plainId;
    this.channelId = channelId;
    this.state = state;
    this.transport = transport;
  }

  static fromDto(dto: WazzupChannelDto): WazzupChannel {
    return new WazzupChannel({
      name: dto.name,
      plainId: dto.plainId,
      channelId: dto.channelId,
      state: dto.state,
      transport: dto.transport,
    });
  }

  static fromDtos(dtos: WazzupChannelDto[]): WazzupChannel[] {
    return dtos.map(this.fromDto);
  }
}
