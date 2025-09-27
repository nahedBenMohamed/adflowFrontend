import { determineApiHost } from '@/app/api/BaseApi/BaseApi';
import { io, type Socket } from 'socket.io-client';
import { type Nullable } from '../types';
import { TokenUtil } from '../utils';

class ServerEventService {
  private _socket: Nullable<Socket> = null;

  connect = (): void => {
    if (!this._socket)
      this._socket = io(determineApiHost(), {
        path: '/api/socket.io',
        auth: { token: TokenUtil.getLocalToken(), userId: TokenUtil.getUserId() },
      });
  };

  disconnect = (): void => {
    if (this._socket) {
      this._socket.disconnect();
      this._socket = null;
    }
  };

  on = <EventData>(event: string, handler: (...args: EventData[]) => Promise<void>): void => {
    this._socket?.on(event, handler);
  };

  off = (event: string): void => {
    this._socket?.off(event);
  };
}

export const serverEventService = new ServerEventService();
