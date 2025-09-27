import type { Nullable } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { partnerApi } from '../api';
import type { PartnerLead, PartnerSummary } from '../shared';

export class PartnerInfoStore {
  partnerId: number;
  summary: Nullable<PartnerSummary> = null;
  leads: PartnerLead[] = [];

  isSummaryLoading = false;
  areLeadsLoading = false;

  constructor(partnerId: number) {
    this.partnerId = partnerId;

    makeAutoObservable(this);
  }

  loadSummary = async (): Promise<void> => {
    try {
      this.isSummaryLoading = true;

      this.summary = await partnerApi.getPartnerSummary(this.partnerId);
    } catch (e) {
      throw new Error(`Error while loading partner ${this.partnerId} summary: ${e}`);
    } finally {
      this.isSummaryLoading = false;
    }
  };

  loadLeads = async (): Promise<void> => {
    try {
      this.areLeadsLoading = true;

      this.leads = await partnerApi.getPartnerLeads(this.partnerId);
    } catch (e) {
      throw new Error(`Error while loading partner ${this.partnerId} leads: ${e}`);
    } finally {
      this.areLeadsLoading = false;
    }
  };
}
