import { watchdogStore } from '@/app';
import { validateForm, type Optional } from '@/shared';
import { makeAutoObservable } from 'mobx';
import {
  CreateTutorialGroupDto,
  CreateTutorialItemDto,
  UpdateTutorialItemDto,
  tutorialApi,
  type GetExpandedTutorialGroupsQueryParams,
  type SortOrderListDto,
} from '../api';
import {
  TutorialGroupForm,
  TutorialItemForm,
  type CreateTutorialGroupHandler,
  type CreateTutorialItemHandler,
  type DeleteTutorialGroupNameHandler,
  type DeleteTutorialItemHandler,
  type UpdateTutorialGroupNameHandler,
  type UpdateTutorialItemHandler,
} from '../shared';

export class TutorialEditModeStore {
  tutorialGroupsForms: TutorialGroupForm[] = [];

  isLoaded = false;
  isCreatingGroupForm = false;

  queryParams: GetExpandedTutorialGroupsQueryParams;

  constructor(queryParams: GetExpandedTutorialGroupsQueryParams) {
    this.queryParams = queryParams;

    watchdogStore.watch(this);
    makeAutoObservable(this);
  }

  get createdEmptyGroupForm(): Optional<TutorialGroupForm> {
    // if id is negative -> group form is created and not saved yet
    return this.tutorialGroupsForms.find(g => g.id < 0);
  }

  get savedTutorialGroupsForms(): TutorialGroupForm[] {
    return this.tutorialGroupsForms.filter(g => g.id > 0);
  }

  loadData = async (): Promise<void> => {
    try {
      this.isLoaded = false;

      const tutorialGroups = await tutorialApi.getExpandedTutorialGroups({});

      this.tutorialGroupsForms = tutorialGroups.map(TutorialGroupForm.createFromGroup);
    } catch (e) {
      throw new Error(`Failed to load tutorial groups: ${e}`);
    } finally {
      this.isLoaded = true;
    }
  };

  invalidateTutorialGroupsInCache = async (): Promise<void> => {
    try {
      const tutorialGroups = await tutorialApi.getExpandedTutorialGroups({});

      this.tutorialGroupsForms = tutorialGroups.map(TutorialGroupForm.createFromGroup);
    } catch (e) {
      throw new Error(`Failed to invalidate tutorial groups in cache: ${e}`);
    }
  };

  createEmptyGroupForm = (): void => {
    // if there is already an empty group form, do nothing, we allow only one empty form at a time
    if (this.tutorialGroupsForms.some(g => g.id < 0)) return;

    this.tutorialGroupsForms = [...this.tutorialGroupsForms, TutorialGroupForm.empty()];
  };

  saveEmptyGroupForm = async ({
    handler,
  }: {
    handler: CreateTutorialGroupHandler;
  }): Promise<void> => {
    const createdEmptyForm = this.createdEmptyGroupForm;

    if (!createdEmptyForm)
      throw new Error(`Failed to saveEmptyGroupForm, createdEmptyForm was not found`);

    if (!createdEmptyForm.name.validate()) return;

    try {
      this.isCreatingGroupForm = true;

      const minSortOrder = this.tutorialGroupsForms.reduce<number>(
        (min, g) => (g.sortOrder < min ? g.sortOrder : min),
        0
      );

      const createdGroup = await handler(
        new CreateTutorialGroupDto({
          name: createdEmptyForm.name.trimmedValue,
          sortOrder: this.savedTutorialGroupsForms.length ? minSortOrder - 1 : 0,
        })
      );

      this.tutorialGroupsForms = [
        TutorialGroupForm.createFromGroup(createdGroup),
        ...this.tutorialGroupsForms,
      ];

      this.deleteEmptyGroupForm();
    } finally {
      this.isCreatingGroupForm = false;
    }
  };

  deleteEmptyGroupForm = (): void => {
    this.tutorialGroupsForms = this.tutorialGroupsForms.filter(g => g.id > 0);
  };

  updateGroupName = async ({
    groupId,
    handler,
  }: {
    groupId: number;
    handler: UpdateTutorialGroupNameHandler;
  }): Promise<void> => {
    const groupForm = this.getGroupFormById(groupId);

    if (!groupForm.name.validate()) return;

    try {
      await handler({
        groupId,
        name: groupForm.name.trimmedValue,
      });
    } catch (e) {
      throw new Error(`Failed to update group name ${groupId}: ${e}`);
    }
  };

  deleteGroup = async ({
    groupId,
    handler,
  }: {
    groupId: number;
    handler: DeleteTutorialGroupNameHandler;
  }): Promise<void> => {
    this.tutorialGroupsForms = this.tutorialGroupsForms.filter(g => g.id !== groupId);

    try {
      await handler(groupId);
    } catch (e) {
      throw new Error(`Failed to delete group ${groupId}: ${e}`);
    }
  };

  getGroupFormById = (groupId: number): TutorialGroupForm => {
    const groupForm = this.tutorialGroupsForms.find(g => g.id === groupId);

    if (!groupForm) throw new Error(`Group form with id ${groupId} not found`);

    return groupForm;
  };

  createEmptyItemForm = (groupId: number): void => {
    const groupForm = this.getGroupFormById(groupId);

    // if there is already an item form, do nothing, we allow only one empty form at a time
    if (groupForm.itemsForms.some(i => i.id < 0)) return;

    groupForm.itemsForms = [...groupForm.itemsForms, TutorialItemForm.empty()];
  };

  deleteEmptyItemForm = (groupId: number): void => {
    const groupForm = this.getGroupFormById(groupId);

    groupForm.itemsForms = groupForm.itemsForms.filter(i => i.id > 0);
  };

  saveEmptyItemForm = async ({
    groupId,
    handler,
  }: {
    groupId: number;
    handler: CreateTutorialItemHandler;
  }): Promise<void> => {
    const groupForm = this.getGroupFormById(groupId);

    const createdEmptyForm = groupForm.createdEmptyItemForm;

    if (!createdEmptyForm)
      throw new Error(`Failed to saveEmptyGroupForm, createdEmptyForm was not found`);

    if (!validateForm({ 0: createdEmptyForm.name, 1: createdEmptyForm.link })) return;

    try {
      const maxSortOrder = groupForm.itemsForms.reduce(
        (max, i) => (i.sortOrder > max ? i.sortOrder : max),
        0
      );

      const createdItem = await handler({
        groupId,
        dto: new CreateTutorialItemDto({
          sortOrder: groupForm.savedItemsForms.length ? maxSortOrder + 1 : 0,
          link: createdEmptyForm.link.trimmedValue,
          name: createdEmptyForm.name.trimmedValue,
          userIds: createdEmptyForm.userIds.valuesOrNull,
          products: createdEmptyForm.products.valuesOrNull,
        }),
      });

      groupForm.itemsForms = [
        ...groupForm.itemsForms,
        TutorialItemForm.createFromItem(createdItem),
      ];

      this.deleteEmptyItemForm(groupId);
    } catch (e) {
      throw new Error(`Failed to saveEmptyItemForm in group ${groupId}: ${e}`);
    }
  };

  deleteItem = async ({
    itemId,
    groupId,
    handler,
  }: {
    itemId: number;
    groupId: number;
    handler: DeleteTutorialItemHandler;
  }): Promise<void> => {
    const groupForm = this.getGroupFormById(groupId);

    groupForm.itemsForms = groupForm.itemsForms.filter(i => i.id !== itemId);

    try {
      await handler({ groupId, itemId });
    } catch (e) {
      throw new Error(`Failed to delete item ${itemId} in group ${groupId}: ${e}`);
    }
  };

  updateItemName = async ({
    itemId,
    groupId,
    handler,
  }: {
    itemId: number;
    groupId: number;
    handler: UpdateTutorialItemHandler;
  }): Promise<void> => {
    const groupForm = this.getGroupFormById(groupId);
    const itemForm = groupForm.getItemFormById(itemId);

    if (!itemForm.name.validate()) return;

    try {
      await handler({
        itemId,
        groupId,
        dto: UpdateTutorialItemDto.create({ name: itemForm.name.trimmedValue }),
      });
    } catch (e) {
      throw new Error(`Failed to update item name ${itemId} in group ${groupId}: ${e}`);
    }
  };

  updateItemLink = async ({
    itemId,
    groupId,
    handler,
  }: {
    itemId: number;
    groupId: number;
    handler: UpdateTutorialItemHandler;
  }): Promise<void> => {
    const groupForm = this.getGroupFormById(groupId);
    const itemForm = groupForm.getItemFormById(itemId);

    if (!itemForm.link.validate()) return;

    try {
      await handler({
        itemId,
        groupId,
        dto: UpdateTutorialItemDto.create({ link: itemForm.link.trimmedValue }),
      });
    } catch (e) {
      throw new Error(`Failed to update item link ${itemId} in group ${groupId}: ${e}`);
    }
  };

  updateItemUsersIds = async ({
    itemId,
    groupId,
    handler,
  }: {
    itemId: number;
    groupId: number;
    handler: UpdateTutorialItemHandler;
  }): Promise<void> => {
    const groupForm = this.getGroupFormById(groupId);
    const itemForm = groupForm.getItemFormById(itemId);

    try {
      await handler({
        itemId,
        groupId,
        dto: UpdateTutorialItemDto.create({ userIds: itemForm.userIds.valuesOrNull }),
      });
    } catch (e) {
      throw new Error(`Failed to update item users ${itemId} in group ${groupId}: ${e}`);
    }
  };

  updateItemProducts = async ({
    itemId,
    groupId,
    handler,
  }: {
    itemId: number;
    groupId: number;
    handler: UpdateTutorialItemHandler;
  }): Promise<void> => {
    const groupForm = this.getGroupFormById(groupId);
    const itemForm = groupForm.getItemFormById(itemId);

    try {
      await handler({
        itemId,
        groupId,
        dto: UpdateTutorialItemDto.create({ products: itemForm.products.valuesOrNull }),
      });
    } catch (e) {
      throw new Error(`Failed to update item products ${itemId} in group ${groupId}: ${e}`);
    }
  };

  changeGroupsSortOrder = async (dto: SortOrderListDto): Promise<void> => {
    try {
      await tutorialApi.changeGroupsSortOrder(dto);
    } catch (e) {
      throw new Error(`Failed to change groups sort order`);
    }
  };

  changeItemsSortOrder = async ({
    groupId,
    dto,
  }: {
    groupId: number;
    dto: SortOrderListDto;
  }): Promise<void> => {
    try {
      await tutorialApi.changeItemsSortOrder({ groupId, dto });
    } catch (e) {
      throw new Error(`Failed to change items sort order`);
    }
  };

  reset = (): void => {
    this.tutorialGroupsForms = [];
  };
}
