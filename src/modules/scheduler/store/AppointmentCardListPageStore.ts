import {
  type ChangeFieldValueHandler,
  type ColumnChangeNameHandler,
  type ColumnChangeStageHandler,
  type ColumnResponsibleChangeHandler,
  DEFAULT_ENTITY_LIST_ITEMS_LIMIT,
  entityApi,
  type EntityListItem,
  type EntityListMeta,
  UpdateEntityDto,
} from '@/modules/section';
import {
  EntityApiUtil,
  ErrorCode,
  type Nullable,
  ObjectState,
  type Optional,
  type ServiceError,
} from '@/shared';
import type { AxiosError } from 'axios';
import { makeAutoObservable } from 'mobx';
import { scheduleAppointmentCardListApi } from '../api';
import type { GetScheduleAppointmentsQueryParams } from '../shared';

const defaultMeta: EntityListMeta = {
  totalCount: 0,
  totalPrice: 0,
  hasPrice: false,
};

// TODO: Proper realtime handling
export class AppointmentCardListPageStore {
  scheduleId: number;
  entityTypeId: number;

  meta: EntityListMeta = defaultMeta;
  entities: EntityListItem[] = [];

  pageCount = 1;
  isLoaded = false;
  isLoading = false;

  showMutationWarning: Nullable<() => void> = null;

  constructor({ scheduleId, entityTypeId }: { scheduleId: number; entityTypeId: number }) {
    this.scheduleId = scheduleId;
    this.entityTypeId = entityTypeId;

    makeAutoObservable(this);
  }

  setShowMutationWarningCb = (cb: Nullable<() => void>): void => {
    this.showMutationWarning = cb;
  };

  loadData = async ({
    page,
    params,
  }: {
    page: number;
    params: GetScheduleAppointmentsQueryParams;
  }): Promise<void> => {
    if (this.isLoading) return;

    const offset = page * DEFAULT_ENTITY_LIST_ITEMS_LIMIT - DEFAULT_ENTITY_LIST_ITEMS_LIMIT;

    this.entities = [];
    this.meta = defaultMeta;
    this.pageCount = 0;

    try {
      this.isLoading = true;
      this.isLoaded = false;

      this.entities = await scheduleAppointmentCardListApi.getScheduleAppointmentCardList({
        offset,
        ...params,
      });

      this._updateMeta(params);

      // for better change page experience
      window.scrollTo({
        top: 0,
      });
    } catch (e) {
      throw new Error(
        `Error while loading entityType ${this.entityTypeId} appointments card list items: ${e}`
      );
    } finally {
      this.isLoading = false;
      this.isLoaded = true;
    }
  };

  getById = (id: number): EntityListItem => {
    const entity = this.entities.find(e => e.id === id);

    if (!entity) throw new Error(`Entity with id ${id} not found`);

    return entity;
  };

  changeName: ColumnChangeNameHandler = async ({ id, name }) => {
    const entity = this.getById(id);

    await entityApi.updateEntity({ id, dto: UpdateEntityDto.create({ name }) });
    entity.name = name;
  };

  changeResponsible: ColumnResponsibleChangeHandler = async ({ id, responsibleUserId }) => {
    const entity = this.getById(id);

    await entityApi.updateEntity({ id, dto: UpdateEntityDto.create({ responsibleUserId }) });
    entity.responsibleUserId = responsibleUserId;
  };

  changeStage: ColumnChangeStageHandler = async ({ id, stageId }) => {
    const entity = this.getById(id);

    try {
      await EntityApiUtil.update({ id, dto: UpdateEntityDto.create({ stageId }) });

      entity.stageId = stageId;

      return true;
    } catch (e) {
      const axiosError = e as AxiosError;
      const serviceError = axiosError.response?.data as Optional<ServiceError>;

      if (serviceError?.errorCode === ErrorCode.REQUIRED_FIELD_EMPTY) this.showMutationWarning?.();

      return false;
    }
  };

  changeFieldValue: ChangeFieldValueHandler = async ({ entityId, fieldValue }) => {
    await entityApi.saveFieldValue({ entityId, dto: fieldValue.toDto() });

    fieldValue.changeState(ObjectState.UNCHANGED);
  };

  clearListItem = (id: number): void => {
    this.entities = this.entities.filter(e => e.id !== id);
  };

  private _updateMeta = async (params: GetScheduleAppointmentsQueryParams): Promise<void> => {
    const meta = await scheduleAppointmentCardListApi.getScheduleAppointmentCardListMeta(params);

    this.meta = meta;
    this.pageCount = Math.ceil(meta.totalCount / DEFAULT_ENTITY_LIST_ITEMS_LIMIT);
  };
}
