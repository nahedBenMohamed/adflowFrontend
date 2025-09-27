import { entityTypeStore, routes } from '@/app';
import { useGetProductsSections } from '@/modules/products';
import { useGetSchedules } from '@/modules/scheduler';
import {
  Action,
  DefaultLoader,
  PermissionObjectType,
  SectionView,
  type EntityType,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { EditUserStore } from '../../../../../store';
import { ObjectPermissionsItem } from '../PermissionItem/ObjectPermissionsItem';
import { ProductsPermissionsItem } from '../PermissionItem/ProductsPermissionsItem';

interface Props {
  editUserStore: EditUserStore;
}

const DEFAULT_ACTIONS = [Action.CREATE, Action.VIEW, Action.EDIT, Action.DELETE];

const ObjectPermissionsList = observer((props: Props) => {
  const { editUserStore } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.edit_user_page.ui.object_permissions_list',
  });

  const { areWarehouseStoresInitialized, handleInitializeProductsSectionWarehousesModels } =
    editUserStore;

  const entityTypes = entityTypeStore.entityTypes;
  const { data: productsSections } = useGetProductsSections();
  const { data: schedulers } = useGetSchedules();

  const getEntityTypeLink = useCallback((entityType: EntityType): string => {
    if (entityType.section.view === SectionView.BOARD)
      return routes.boardSection({ entityTypeId: entityType.id });

    return routes.listSection(entityType.id);
  }, []);

  useEffect(() => {
    if (productsSections)
      handleInitializeProductsSectionWarehousesModels(productsSections.map<number>(ps => ps.id));
  }, [productsSections, handleInitializeProductsSectionWarehousesModels]);

  return (
    <>
      <ObjectPermissionsItem
        title={t('tasks')}
        link={routes.activities}
        actions={DEFAULT_ACTIONS}
        editUserStore={editUserStore}
        objectType={PermissionObjectType.TASK}
      />

      <ObjectPermissionsItem
        title={t('activities')}
        link={routes.timeBoard()}
        actions={DEFAULT_ACTIONS}
        editUserStore={editUserStore}
        objectType={PermissionObjectType.ACTIVITY}
      />

      {entityTypes.map(et => (
        <ObjectPermissionsItem
          key={et.id}
          objectId={et.id}
          title={et.section.name}
          link={getEntityTypeLink(et)}
          editUserStore={editUserStore}
          objectType={PermissionObjectType.ENTITY_TYPE}
          actions={[...DEFAULT_ACTIONS, Action.REPORT, Action.DASHBOARD]}
          isFullSize
        />
      ))}

      {productsSections && areWarehouseStoresInitialized ? (
        productsSections.map(ps => (
          <ProductsPermissionsItem key={ps.id} editUserStore={editUserStore} productsSection={ps} />
        ))
      ) : (
        <DefaultLoader height="320px" />
      )}

      {schedulers &&
        schedulers.map(sc => (
          <ObjectPermissionsItem
            key={sc.id}
            objectId={sc.id}
            title={sc.name}
            editUserStore={editUserStore}
            objectType={PermissionObjectType.SCHEDULE}
            actions={[...DEFAULT_ACTIONS, Action.REPORT]}
            link={routes.scheduler({
              scheduleId: sc.id,
              scheduleType: sc.type,
              tab: SectionView.OVERVIEW,
            })}
            isFullSize
          />
        ))}
    </>
  );
});

ObjectPermissionsList.displayName = 'ObjectPermissionsList';
export { ObjectPermissionsList };
