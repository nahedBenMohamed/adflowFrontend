import { productApi, productOrderApi, type Order, type Product } from '@/modules/products';
import { EntityApiUtil } from '@/modules/section';
import { SelectModel, delayResolve, type Entity, type Nullable, type Optional } from '@/shared';
import { makeAutoObservable, runInAction } from 'mobx';
import {
  UpdateScheduleAppointmentDto,
  invalidateSchedulerTotalVisitsCache,
  scheduleAppointmentApi,
  updateScheduleAppointmentInCache,
} from '../api';
import type { ScheduleAppointment, ScheduleAppointmentStatus } from '../shared';

export class AppointmentEventHoverCardStore {
  appointmentId: number;
  appointment: Nullable<ScheduleAppointment> = null;
  status: SelectModel;

  appointmentOrder: Nullable<Order> = null;
  appointmentEntity: Nullable<Entity> = null;

  productsSectionId: Nullable<number> = null;
  services: Product[] = [];

  isLoaded = false;

  constructor({
    appointmentId,
    productsSectionId = null,
  }: {
    appointmentId: number;
    productsSectionId: Nullable<number>;
  }) {
    this.appointmentId = appointmentId;
    this.productsSectionId = productsSectionId;

    this.status = SelectModel.create();

    makeAutoObservable(this);
  }

  setStatus = (status: ScheduleAppointmentStatus): void => {
    this.status.setValue(status);
  };

  loadData = async (): Promise<void> => {
    try {
      this.isLoaded = false;

      // delay resolving this function so it resolves after hover card transition (~400ms)
      const getScheduleAppointment = delayResolve(
        () =>
          scheduleAppointmentApi.getScheduleAppointment({
            appointmentId: this.appointmentId,
          }),
        400
      );

      // we need to synchronously update states so all the data is displayed at once
      runInAction(async () => {
        this.appointment = await getScheduleAppointment();

        if (this.appointment) this.setStatus(this.appointment.status);

        const { orderId, entityId } = this.appointment;

        if (orderId && entityId) {
          const [order, entity] = await Promise.all([
            productOrderApi.getEntityProductOrder({ orderId, expand: 'items' }),
            EntityApiUtil.getById(entityId),
          ]);

          this.appointmentOrder = order;
          this.appointmentEntity = entity;
        } else if (orderId) {
          this.appointmentOrder = await productOrderApi.getEntityProductOrder({
            orderId,
            expand: 'items',
          });
        } else if (entityId) {
          this.appointmentEntity = await EntityApiUtil.getById(entityId);
        }

        if (this.appointmentOrder && this.productsSectionId) {
          const { products } = await productApi.getProductsByIds({
            sectionId: this.productsSectionId,
            ids: this.appointmentOrder.items.map<number>(i => i.productId),
          });

          this.services = products;
        }
      });
    } catch (e) {
      throw new Error(`Failed to load appointment with id ${this.appointmentId}: ${e}`);
    } finally {
      this.isLoaded = true;
    }
  };

  findServiceById = (productId: number): Optional<Product> => {
    return this.services.find(s => s.id === productId);
  };

  updateAppointmentStatus = async (status: ScheduleAppointmentStatus): Promise<void> => {
    if (!this.appointment)
      throw new Error(`Appointment with id ${this.appointmentId} is not loaded`);

    const dto = UpdateScheduleAppointmentDto.fromModel(this.appointment);
    dto.status = status;

    try {
      this.setStatus(status);

      this.appointment = await scheduleAppointmentApi.updateScheduleAppointment({
        appointmentId: this.appointment.id,
        dto,
      });

      updateScheduleAppointmentInCache(this.appointment);

      invalidateSchedulerTotalVisitsCache({
        scheduleId: this.appointment.scheduleId,
      });
    } catch (e) {
      throw new Error(`Failed to update appointment status to ${status}: ${e}`);
    }
  };
}
