import type { EntityEventItemDto, FeedItemDto, FileLinkDto } from '@/app';
import type { NoteDto } from '@/modules/card';
import { FeedItemType } from '@/modules/card';
import { MailThreadInfo, type MailThreadInfoDto } from '@/modules/mailing';
import type { BaseTaskDto } from '@/modules/tasks';
import { BaseTask } from '@/modules/tasks';
import { CallInfo } from '../../models';
import { FileLink } from '../FileLink/FileLink';
import { Note } from '../Note/Note';
import { UtcDate } from '../UtcDate';

export class FeedItem {
  id: number;
  createdAt: UtcDate;
  type: FeedItemType;
  data: object;

  constructor(id: number, createdAt: UtcDate, type: FeedItemType, data: object) {
    this.id = id;
    this.createdAt = createdAt;
    this.type = type;
    this.data = data;
  }

  static fromDto(dto: FeedItemDto): FeedItem {
    if (dto.type === FeedItemType.TASK || dto.type === FeedItemType.ACTIVITY) {
      return new FeedItem(
        dto.id,
        UtcDate.parseISO(dto.createdAt),
        dto.type,
        BaseTask.fromBaseDto(dto.data as BaseTaskDto)
      );
    }

    if (dto.type === FeedItemType.NOTE) {
      return new FeedItem(
        dto.id,
        UtcDate.parseISO(dto.createdAt),
        dto.type,
        Note.fromDto(dto.data as NoteDto)
      );
    }

    if (dto.type === FeedItemType.MAIL) {
      return new FeedItem(
        dto.id,
        UtcDate.parseISO(dto.createdAt),
        dto.type,
        MailThreadInfo.fromDto(dto.data as MailThreadInfoDto)
      );
    }

    if (dto.type === FeedItemType.DOCUMENT) {
      return new FeedItem(
        dto.id,
        UtcDate.parseISO(dto.createdAt),
        dto.type,
        FileLink.fromDto(dto.data as FileLinkDto)
      );
    }

    if (dto.type === FeedItemType.CALL) {
      return new FeedItem(
        dto.id,
        UtcDate.parseISO(dto.createdAt),
        dto.type,
        CallInfo.fromDto(dto.data as EntityEventItemDto)
      );
    }

    /** temporary solution until orders, rental_orders, shipments are added to feed */
    if ([FeedItemType.ORDER, FeedItemType.RENTAL_ORDER, FeedItemType.SHIPMENT].includes(dto.type))
      return new FeedItem(dto.id, UtcDate.parseISO(dto.createdAt), dto.type, {});

    throw new Error(`Unknown feed item type: ${dto.type}`);
  }

  static fromDtos(dtos: FeedItemDto[]): FeedItem[] {
    return dtos.map(this.fromDto);
  }
}
