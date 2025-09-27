import { identityStore } from '@/app';
import {
  dangerouslySetQueryParams,
  MathUtil,
  type Nullable,
  ObjectState,
  type Optional,
} from '@/shared';
import { computed, makeAutoObservable, observable } from 'mobx';
import { FieldGroup, FieldGroupCode, FieldGroupsErrorCode, FieldSpecialTab } from '../shared';
import type { FieldsStore } from './FieldsStore';

export const FIELDS_TAB = 'fieldsTab';

export class FieldGroupsStore {
  private _fieldGroups = observable<FieldGroup>([]);
  private readonly _analyticsGroupName: string;
  private readonly _requisitesGroupName: string;

  activeTabKey = '0';
  fieldsStore: FieldsStore;

  // binded with translations in store.field_groups_store.json
  errorCode: Nullable<FieldGroupsErrorCode> = null;

  constructor({
    fieldGroups,
    analyticsGroupName,
    requisitesGroupName,
  }: {
    fieldGroups?: FieldGroup[];
    analyticsGroupName?: string;
    requisitesGroupName?: string;
  }) {
    this.setFieldGroups(fieldGroups ?? []);

    this._analyticsGroupName = analyticsGroupName || '';
    this._requisitesGroupName = requisitesGroupName || '';

    makeAutoObservable(this);
  }

  @computed.struct
  get activeFieldGroups(): FieldGroup[] {
    return this._fieldGroups
      .filter(fg => !fg.isDeleted())
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  get firstActiveFieldGroup(): Optional<FieldGroup> {
    return this.activeFieldGroups[0];
  }

  get allFieldGroups(): FieldGroup[] {
    return this._fieldGroups;
  }

  get isValidTabKey(): boolean {
    return this.activeFieldGroups.some(fg => String(fg.id) === this.activeTabKey);
  }

  get hasAnalyticsGroup(): boolean {
    return this.activeFieldGroups.some(fg => fg.code === FieldGroupCode.ANALYTICS);
  }

  get hasRequisitesGroup(): boolean {
    return this.activeFieldGroups.some(fg => fg.code === FieldGroupCode.REQUISITES);
  }

  // in order to validate fields inside group
  setFieldsStore = (fieldsStore: FieldsStore): void => {
    this.fieldsStore = fieldsStore;
  };

  setFieldGroups = (fieldGroups: FieldGroup[]): void => {
    this._fieldGroups.replace(fieldGroups);

    if (this.isValidTabKey) return;

    if (this.firstActiveFieldGroup) this.activeTabKey = String(this.firstActiveFieldGroup.id);
  };

  changeActiveTab = (key: Nullable<string>): void => {
    if (!key) return;

    // when click on tab with + icon
    if (key === FieldSpecialTab.ADD) {
      this.addGroup();

      return;
    }

    if (key === FieldSpecialTab.ADD_ANALYTICS) {
      this.addAnalyticsGroup();

      return;
    }

    if (key === FieldSpecialTab.ADD_REQUISITES) {
      this.addRequisitesGroup();

      return;
    }

    this.activeTabKey = key;

    // set params without setSearchParams so that react-router-dom will not see the change,
    // this is needed to prevent "save changes" dialog from appearing
    dangerouslySetQueryParams(new Map([[FIELDS_TAB, key]]));
  };

  addGroup = (): void => {
    const newId = identityStore.getFieldGroupId();
    const maxSortOrder = MathUtil.maxOrZero(this._fieldGroups.map<number>(fg => fg.sortOrder));
    this._fieldGroups.push(FieldGroup.create({ id: newId, name: '', sortOrder: maxSortOrder + 1 }));

    this.changeActiveTab(newId.toString());
  };

  addAnalyticsGroup = (): void => {
    const newId = identityStore.getFieldGroupId();
    const maxSortOrder = MathUtil.maxOrZero(this._fieldGroups.map<number>(fg => fg.sortOrder));
    this._fieldGroups.push(
      FieldGroup.create({
        id: newId,
        name: this._analyticsGroupName,
        sortOrder: maxSortOrder + 1,
        code: FieldGroupCode.ANALYTICS,
      })
    );

    this.fieldsStore.addUTMAnalyticsFields(newId);

    this.changeActiveTab(newId.toString());
  };

  addRequisitesGroup = (): void => {
    const newId = identityStore.getFieldGroupId();
    const maxSortOrder = MathUtil.maxOrZero(this._fieldGroups.map<number>(fg => fg.sortOrder));
    this._fieldGroups.push(
      FieldGroup.create({
        id: newId,
        name: this._requisitesGroupName,
        sortOrder: maxSortOrder + 1,
        code: FieldGroupCode.REQUISITES,
      })
    );

    this.fieldsStore.addSpAndOrganizationRequisitesFields(newId);

    this.changeActiveTab(newId.toString());
  };

  changeGroupName = (group: FieldGroup, name: string): void => {
    group.changeName(name);
  };

  deleteGroup = (group: FieldGroup): void => {
    const idx = this._fieldGroups.findIndex(fg => fg.id === group.id);
    const fieldGroup = this._fieldGroups[idx];

    if (!fieldGroup) throw new Error(`Field group with id ${group.id} is not found`);

    if (fieldGroup.isCreated()) {
      this._fieldGroups.splice(idx, 1);
    } else {
      fieldGroup.markDeleted();
    }

    if (!this.firstActiveFieldGroup)
      throw new Error(`Field groups list is empty, failed to delete field group, ${fieldGroup.id}`);

    if (this.activeTabKey === String(group.id))
      this.changeActiveTab(String(this.firstActiveFieldGroup.id));
  };

  validate = (): boolean => {
    this.errorCode = null;

    if (this._fieldGroups.every(f => f.state === ObjectState.UNCHANGED)) return true;

    let isValid = true;

    for (const fieldGroup of this.activeFieldGroups) {
      if (!fieldGroup.form.name.validate()) isValid = false;

      const fields = this.fieldsStore.getFieldsByGroupId(fieldGroup.id);

      if (fields.length === 0) {
        isValid = false;

        this.errorCode = FieldGroupsErrorCode.CREATE_AT_LEAST_ONE_FIELD;
      }
    }

    return isValid;
  };

  clearError = (): void => {
    this.errorCode = null;
  };
}
