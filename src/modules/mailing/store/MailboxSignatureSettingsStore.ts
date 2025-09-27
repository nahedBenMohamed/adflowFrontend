import { watchdogStore } from '@/app';
import type { DataStore } from '@/shared';
import { makeAutoObservable } from 'mobx';
import {
  invalidateMailboxesSignaturesInCache,
  mailboxSignatureSettingsApi,
  type CreateMailboxSignatureDto,
  type UpdateMailboxSignatureDto,
} from '../api';
import type { MailboxSignature } from '../shared';

export class MailboxSignatureSettingsStore implements DataStore {
  signatures: MailboxSignature[] = [];

  isLoading = false;
  isAdding = false;
  isUpdating = false;
  isDeleting = false;

  constructor() {
    watchdogStore.watch(this);
    makeAutoObservable(this);
  }

  loadData = async (): Promise<void> => {
    await this.loadSignatures();
  };

  loadSignatures = async (): Promise<MailboxSignature[]> => {
    try {
      this.isLoading = true;

      const signatures = await mailboxSignatureSettingsApi.getSignatures();

      this.signatures = signatures;

      return signatures;
    } catch (e) {
      throw new Error(`Failed to load signatures: ${e}`);
    } finally {
      this.isLoading = false;
    }
  };

  addSignature = async (dto: CreateMailboxSignatureDto): Promise<MailboxSignature> => {
    try {
      this.isAdding = true;

      const signature = await mailboxSignatureSettingsApi.addSignature(dto);

      this.signatures = [signature, ...this.signatures];

      invalidateMailboxesSignaturesInCache();

      return signature;
    } catch (e) {
      throw new Error(`Failed to add signature ${dto.name}: ${e}`);
    } finally {
      this.isAdding = false;
    }
  };

  updateSignature = async ({
    id,
    dto,
  }: {
    id: number;
    dto: UpdateMailboxSignatureDto;
  }): Promise<void> => {
    try {
      this.isUpdating = true;

      const updatedSignature = await mailboxSignatureSettingsApi.updateSignature({ id, dto });

      this.signatures = this.signatures.map(s => (s.id === id ? updatedSignature : s));
    } catch (e) {
      throw new Error(`Failed to update signature ${dto.name}: ${e}`);
    } finally {
      this.isUpdating = false;
    }
  };

  deleteSignature = async (id: number): Promise<void> => {
    try {
      this.isDeleting = true;

      await mailboxSignatureSettingsApi.deleteSignature(id);

      this.signatures = this.signatures.filter(s => s.id !== id);

      invalidateMailboxesSignaturesInCache();
    } catch (e) {
      throw new Error(`Failed to delete signature ${id}: ${e}`);
    } finally {
      this.isDeleting = false;
    }
  };

  reset = () => {
    this.signatures = [];
  };
}
