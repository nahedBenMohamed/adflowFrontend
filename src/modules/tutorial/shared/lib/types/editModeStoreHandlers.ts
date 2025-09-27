import type {
  CreateTutorialGroupDto,
  CreateTutorialItemDto,
  DeleteTutorialGroupItemResult,
  UpdateTutorialItemDto,
} from '../../../api';
import type { TutorialGroup, TutorialItem } from '../models';

export type CreateTutorialGroupHandler = (dto: CreateTutorialGroupDto) => Promise<TutorialGroup>;

export type UpdateTutorialGroupNameHandler = ({
  groupId,
  name,
}: {
  groupId: number;
  name: string;
}) => Promise<TutorialGroup>;

export type DeleteTutorialGroupNameHandler = (groupId: number) => Promise<number>;

export type UpdateTutorialItemHandler = ({
  itemId,
  groupId,
  dto,
}: {
  itemId: number;
  groupId: number;
  dto: UpdateTutorialItemDto;
}) => Promise<TutorialItem>;

export type DeleteTutorialItemHandler = ({
  itemId,
  groupId,
}: {
  itemId: number;
  groupId: number;
}) => Promise<DeleteTutorialGroupItemResult>;

export type CreateTutorialItemHandler = ({
  groupId,
  dto,
}: {
  groupId: number;
  dto: CreateTutorialItemDto;
}) => Promise<TutorialItem>;
