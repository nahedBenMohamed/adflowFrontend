import { FieldSettingsStore } from '@/modules/fields';
import { EntityForm } from '@/modules/section';
import {
  batchRequest,
  type Entity,
  EntityApiUtil,
  ErrorCode,
  InputModel,
  JsonStateHelper,
  type Nullable,
  type Optional,
  type ServiceError,
  type UtcDate,
  UuidUtil,
} from '@/shared';
import type { AxiosError } from 'axios';
import type { TFunction } from 'i18next';
import { computed, makeAutoObservable } from 'mobx';
import {
  addScheduleAppointmentToCache,
  CreateScheduleAppointmentDto,
  invalidateSchedulerStatisticsCache,
  invalidateSchedulerTotalVisitsCache,
  scheduleAppointmentApi,
  UpdateScheduleAppointmentDto,
  updateScheduleAppointmentInCache,
} from '../api';
import {
  type AddAppointmentPreset,
  type GetScheduleAppointmentsQueryParams,
  type Schedule,
  type ScheduleAppointment,
  ScheduleAppointmentDuplicateError,
  ScheduleAppointmentIntersectError,
  type ScheduleAppointmentStatus,
  type SchedulePerformer,
  ScheduleType,
  VisitParametersFormData,
} from '../shared';
import { type AppointmentOrderStore } from './AppointmentOrderStore';

class AddAppointmentModalStore {
  appointmentId: Nullable<number> = null;
  appointment: Nullable<ScheduleAppointment> = null;

  appointmentEntity: Nullable<Entity> = null;

  entityForm: Nullable<EntityForm> = null;
  preset: Nullable<AddAppointmentPreset>;
  visitParametersFormData: VisitParametersFormData;

  appointmentOrderStore: Nullable<AppointmentOrderStore> = null;

  // will only be used in AddAppointmentModal component
  fieldSettingsStore: Nullable<FieldSettingsStore> = null;

  isLoaded = false;
  isSaving = false;

  jsonState: Nullable<JsonStateHelper> = null;

  initializeJsonState = (openedFromCard?: boolean): void => {
    this.jsonState = new JsonStateHelper(() =>
      JSON.stringify(
        openedFromCard
          ? [this.visitParametersFormData]
          : [
              this.entityForm?.name.value,
              this.visitParametersFormData,
              this.entityForm?.fieldValuesStore.fieldValues,
            ]
      )
    );

    this.jsonState.calculateState();
  };

  constructor({
    preset,
    appointmentId,
    selectedSchedule,
    openedFromCard,
  }: {
    preset: Nullable<AddAppointmentPreset>;
    appointmentId: Nullable<number>;
    selectedSchedule: Nullable<Schedule>;
    openedFromCard?: boolean;
  }) {
    this.visitParametersFormData = new VisitParametersFormData(selectedSchedule);

    this.preset = preset;
    this.appointmentId = appointmentId;

    if (!appointmentId) {
      this.visitParametersFormData.initializeFormData({ appointment: null, preset: this.preset });

      if (this.preset && this.preset.entity) {
        this.initializeEntityForm({ entity: this.preset.entity, openedFromCard });
      } else {
        this.initializeJsonState(openedFromCard);
      }

      this.isLoaded = true;
    }

    makeAutoObservable(this);
  }

  initializeEntityForm = async ({
    entity,
    openedFromCard,
  }: {
    entity: Entity;
    openedFromCard?: boolean;
  }): Promise<void> => {
    this.entityForm = await EntityForm.create({ entity, sortOrder: 0 });

    this.fieldSettingsStore = new FieldSettingsStore(entity.entityTypeId);

    this.initializeJsonState(openedFromCard);
  };

  setAppointmentOrderStore = (orderStore: AppointmentOrderStore): void => {
    this.appointmentOrderStore = orderStore;
  };

  loadData = async (): Promise<void> => {
    if (!this.appointmentId) return;

    try {
      this.appointment = await scheduleAppointmentApi.getScheduleAppointment({
        appointmentId: this.appointmentId,
      });

      const { entityId } = this.appointment;

      if (entityId) this.appointmentEntity = await EntityApiUtil.getById(entityId);

      // if appointment has attached entityId - we need to load entity, otherwise we will create new one
      // from preset if it exists
      this.entityForm = this.appointmentEntity
        ? await EntityForm.create({ entity: this.appointmentEntity, sortOrder: 0 })
        : this.preset && this.preset.entity
          ? await EntityForm.create({ entity: this.preset.entity, sortOrder: 0 })
          : null;

      if (this.entityForm) {
        this.fieldSettingsStore = new FieldSettingsStore(
          this.entityForm.originalEntity.entityTypeId
        );

        await this.fieldSettingsStore.loadData();
      }
    } catch (e) {
      throw new Error(`Failed to load appointment ${this.appointmentId}: ${e}`);
    } finally {
      this.visitParametersFormData.initializeFormData({
        appointment: this.appointment,
        preset: this.preset,
      });

      this.isLoaded = true;

      // to initialize jsonState at the end of the queue
      setTimeout(() => {
        this.initializeJsonState();
      });
    }
  };

  validate = (): boolean => {
    if (this.entityForm)
      return this.entityForm.name.validate() && this.visitParametersFormData.validate();

    return this.visitParametersFormData.validate();
  };

  addEntityForm = async (entity: Entity): Promise<void> => {
    this.entityForm = await EntityForm.create({
      entity,
      sortOrder: 0,
    });

    this.fieldSettingsStore = new FieldSettingsStore(entity.entityTypeId);

    await this.fieldSettingsStore.loadData();
  };

  createAppointment = async ({
    dto,
    withoutInvalidation,
  }: {
    dto: CreateScheduleAppointmentDto;
    withoutInvalidation?: boolean;
  }): Promise<ScheduleAppointment> => {
    const response = await scheduleAppointmentApi.createScheduleAppointment(dto);

    if (!withoutInvalidation) invalidateSchedulerStatisticsCache();

    return response;
  };

  updateAppointment = async (
    appointmentId: number,
    dto: UpdateScheduleAppointmentDto
  ): Promise<ScheduleAppointment> => {
    const response = await scheduleAppointmentApi.updateScheduleAppointment({ appointmentId, dto });

    invalidateSchedulerStatisticsCache();

    return response;
  };

  handleFieldRequiredError = (stageId: number): void => {
    if (!this.fieldSettingsStore || !this.entityForm)
      throw new Error(
        'fieldSettingsStore or entityForm is not initialized, failed to handleFieldRequiredError'
      );

    const mandatoryFieldsIds = this.fieldSettingsStore.getAllMandatoryFieldsIds(stageId);

    this.entityForm.fieldValuesStore.fieldValues
      .filter(fv => mandatoryFieldsIds.includes(fv.fieldId))
      .forEach(fv => {
        if (fv.model instanceof Array) {
          fv.model.forEach(m => {
            if (m instanceof InputModel) {
              m.required();

              m.validate();
            }
          });
        } else {
          fv.model.required();

          fv.model.validate();
        }
      });
  };

  saveEntity = async (): Promise<boolean> => {
    if (!this.entityForm) return true;

    // we just linked existing entity to appointment and we didn't change its fields
    if (
      !this.entityForm.originalEntity.isNew &&
      this.entityForm.jsonState &&
      !this.entityForm.jsonState.stateChanged
    )
      return true;

    const entityForUpdate = this.entityForm.originalEntity;

    entityForUpdate.name = this.entityForm.name.value;
    entityForUpdate.stageId = this.entityForm.stageId.value;
    entityForUpdate.responsibleUserId = this.entityForm.responsibleUserId.value;
    entityForUpdate.fieldValues = this.entityForm.fieldValuesStore.fieldValuesForSave;

    try {
      this.entityForm.originalEntity = await EntityApiUtil.save(entityForUpdate);

      return true;
    } catch (e) {
      const axiosError = e as AxiosError;
      const serviceError = axiosError.response?.data as Optional<ServiceError>;

      const stageId = this.entityForm.originalEntity.stageId;

      if (serviceError?.errorCode === ErrorCode.REQUIRED_FIELD_EMPTY && stageId)
        this.handleFieldRequiredError(stageId);

      return false;
    }
  };

  getTitle = (t: TFunction): Nullable<string> => {
    const trimmedTitle = this.visitParametersFormData.title.trimmedValue;

    if (trimmedTitle.length > 0) return trimmedTitle;

    if (this.entityForm) return this.entityForm.name.value;

    return t('visit', { number: UuidUtil.generate6() });
  };

  createNewAppointment = async ({
    queryParams,
    title,
    orderId,
    performer,
    startDate,
    endDate,
    withoutInvalidation,
  }: {
    title: Nullable<string>;
    orderId: Nullable<number>;
    performer: SchedulePerformer;
    startDate: UtcDate;
    endDate: UtcDate;
    queryParams?: GetScheduleAppointmentsQueryParams;
    withoutInvalidation?: boolean;
  }): Promise<void> => {
    if (!this.visitParametersFormData.selectedSchedule)
      throw new Error('Failed to create appointment: selectedSchedule must be defined');

    const dto = new CreateScheduleAppointmentDto({
      title,
      orderId,
      performerId: performer.id,
      comment: this.visitParametersFormData.comment.value,
      entityId: this.entityForm?.originalEntity.id ?? null,
      ownerId: this.entityForm?.originalEntity.responsibleUserId ?? null,
      endDate: endDate.formatISO(),
      scheduleId: this.visitParametersFormData.currentScheduleId,
      startDate: startDate.formatISO(),
      status: this.visitParametersFormData.status.value as ScheduleAppointmentStatus,
      checkIntersection:
        this.visitParametersFormData.selectedSchedule.type === ScheduleType.SCHEDULE,
    });

    const createdAppointment = await this.createAppointment({ dto, withoutInvalidation });

    if (queryParams) {
      switch (this.visitParametersFormData.selectedSchedule.type) {
        case ScheduleType.BOARD: {
          await addScheduleAppointmentToCache({
            appointment: createdAppointment,
            queryParams,
          });

          break;
        }

        case ScheduleType.SCHEDULE: {
          await addScheduleAppointmentToCache({
            appointment: createdAppointment,
            queryParams,
          });

          break;
        }
      }
    }
  };

  save = async ({
    queryParams,
    t,
  }: {
    queryParams?: GetScheduleAppointmentsQueryParams;
    t: TFunction;
  }): Promise<boolean> => {
    if (!this.validate()) return false;

    try {
      this.isSaving = true;

      const entitySavedSuccessfully = await this.saveEntity();

      if (!entitySavedSuccessfully) return false;

      let orderId: Nullable<number> = null;

      if (this.appointmentOrderStore) {
        if (!this.appointmentOrderStore.validate()) return false;

        if (this.appointmentOrderStore.order) {
          orderId = (
            await this.appointmentOrderStore.updateOrder(this.appointmentOrderStore.order.id)
          ).id;
        } else if (this.appointmentOrderStore.orderItemRows.length > 0) {
          orderId = (await this.appointmentOrderStore.createOrder()).id;
        }
      }

      const title = this.getTitle(t);

      if (
        !this.visitParametersFormData.selectedSchedule ||
        !this.visitParametersFormData.performerObjectId.value
      )
        throw new Error(
          `Failed to save appointment ${this.appointmentId}, schedule and performerObjectId are required`
        );

      const performer = this.visitParametersFormData.selectedSchedule.getPerformerByObjectId(
        this.visitParametersFormData.performerObjectId.value
      );

      if (!performer)
        throw new Error(
          `Failed to save appointment ${this.appointmentId}, performer not found for objectId ${this.visitParametersFormData.performerObjectId.value} in schedule ${this.visitParametersFormData.selectedSchedule.id}`
        );

      if (this.appointmentId) {
        // patch already existing appointment

        const dto = new UpdateScheduleAppointmentDto({
          title: title !== this.appointment?.title ? title : undefined,
          orderId: orderId !== this.appointment?.orderId ? orderId : undefined,
          performerId: performer.id !== this.appointment?.performerId ? performer.id : undefined,
          comment:
            this.visitParametersFormData.comment.value !== this.appointment?.comment
              ? this.visitParametersFormData.comment.value
              : undefined,
          entityId:
            this.entityForm?.originalEntity.id !== this.appointment?.entityId
              ? this.entityForm?.originalEntity.id
              : undefined,
          ownerId:
            this.entityForm &&
            this.entityForm.originalEntity.responsibleUserId !== this.appointment?.ownerId
              ? this.entityForm.originalEntity.responsibleUserId
              : undefined,
          endDate:
            this.appointment?.endDate &&
            !this.visitParametersFormData.endDate.isEqual(this.appointment.endDate)
              ? this.visitParametersFormData.endDate.formatISO()
              : undefined,
          scheduleId:
            this.visitParametersFormData.currentScheduleId !== this.appointment?.scheduleId
              ? this.visitParametersFormData.currentScheduleId
              : undefined,
          startDate:
            this.appointment?.startDate &&
            !this.visitParametersFormData.startDate.isEqual(this.appointment.startDate)
              ? this.visitParametersFormData.startDate.formatISO()
              : undefined,
          status:
            this.visitParametersFormData.status.value !== this.appointment?.status
              ? this.visitParametersFormData.status.value
              : undefined,
        });

        const updatedAppointment = await this.updateAppointment(this.appointmentId, dto);
        await updateScheduleAppointmentInCache(updatedAppointment);
      } else {
        // appointment does not exist yet -> creating it

        if (this.visitParametersFormData.repeatingVisitParameters.intervalEnabled) {
          // if repeating appointments by interval is enabled, create appointments according to that interval
          // (current appointment is already included in interval generator)

          batchRequest({
            array: Array.from(
              this.visitParametersFormData.repeatingVisitParameters.repeatingAppointmentsByInterval(
                {
                  startDate: this.visitParametersFormData.startDate,
                  endDate: this.visitParametersFormData.endDate,
                }
              )
            ),
            cb: async (appointment): Promise<void> => {
              await this.createNewAppointment({
                queryParams,
                title,
                orderId,
                performer,
                startDate: appointment.startDate,
                endDate: appointment.endDate,
                withoutInvalidation: true,
              });
            },
          });

          invalidateSchedulerStatisticsCache();
        } else if (this.visitParametersFormData.repeatingVisitParameters.listEnabled) {
          // if repeating appointments by list is enabled, create appointments from that list
          // (current appointment is not included in list, so creating it manually)

          await this.createNewAppointment({
            queryParams,
            title,
            orderId,
            performer,
            startDate: this.visitParametersFormData.startDate,
            endDate: this.visitParametersFormData.endDate,
            withoutInvalidation: true,
          });

          batchRequest({
            array:
              this.visitParametersFormData.repeatingVisitParameters.getSelectedAppointmentsList({
                startTime: this.visitParametersFormData.startDate,
                endTime: this.visitParametersFormData.endDate,
              }),
            cb: async (appointment): Promise<void> => {
              await this.createNewAppointment({
                queryParams,
                title,
                orderId,
                performer,
                startDate: appointment.startDate,
                endDate: appointment.endDate,
                withoutInvalidation: true,
              });
            },
          });

          invalidateSchedulerStatisticsCache();
        } else {
          // simply create one appointment if no repeating options are used

          await this.createNewAppointment({
            queryParams,
            title,
            orderId,
            performer,
            startDate: this.visitParametersFormData.startDate,
            endDate: this.visitParametersFormData.endDate,
          });
        }
      }

      invalidateSchedulerTotalVisitsCache({
        scheduleId: this.visitParametersFormData.currentScheduleId,
      });

      this.initializeJsonState();

      return true;
    } catch (e) {
      const axiosError = e as AxiosError;
      const serviceError = axiosError.response?.data as Optional<ServiceError>;

      if (serviceError?.errorCode === ErrorCode.DUPLICATE_SCHEDULER_APPOINTMENT)
        throw new ScheduleAppointmentDuplicateError(serviceError.details?.appointmentId as number);

      if (serviceError?.errorCode === ErrorCode.INTERSECT_SCHEDULER_APPOINTMENT)
        throw new ScheduleAppointmentIntersectError();

      return false;
    } finally {
      this.isSaving = false;
    }
  };

  @computed.struct
  isJsonStateChanged = (): boolean => {
    if (this.jsonState) return this.jsonState.stateChanged;

    return false;
  };
}

export { AddAppointmentModalStore };
