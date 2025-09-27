import {
  Action,
  MyRadio,
  PermissionHelper,
  PermissionLevel,
  type InputModel,
  type MyRadioColorType,
  type PermissionObjectType,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { Fragment, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { ObjectPermissionModel } from '../../../../../shared';
import type { EditUserStore } from '../../../../../store';
import {
  PermissionItemColumnTitle,
  PermissionItemHeader,
  PermissionItemRowTitle,
} from './components';

const Root = styled.div<{ $isFullSize: boolean }>`
  grid-column: span ${p => (p.$isFullSize ? 2 : 1)};
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: 24px 8px 24px 32px;
  background: var(--primary-statuses-white-0);
  border-radius: var(--border-radius-block);
  box-shadow:
    0px 0px 2px #eef4fe,
    0px 1px 2px #d0daeb;
`;

const ContentGrid = styled.div<{ $columnNumber: number }>`
  display: grid;
  row-gap: 16px;
  align-items: center;
  justify-items: center;
  grid-template-rows: repeat(4, 1fr);
  grid-template-columns: 136px repeat(${p => p.$columnNumber}, 1fr);

  padding-right: 12px;
`;

type CellChangedFunc = ({
  value,
  model,
}: {
  value: PermissionLevel;
  model: ObjectPermissionModel;
}) => void;
type CellDisabledFunc = (model: ObjectPermissionModel) => boolean;
type CellVisibleFunc = (actions: Action[]) => boolean;

interface PermissionCell {
  type: Action;
  show: boolean;
  visible: CellVisibleFunc;
  disabled?: CellDisabledFunc;
  changed?: CellChangedFunc;
}

interface PermissionRow {
  title: string;
  colorType: MyRadioColorType;
  value: PermissionLevel;
  cells: PermissionCell[];
}

const isPermissionLevelBigger = (p1: PermissionLevel, p2: PermissionLevel): boolean =>
  PermissionHelper.isBigger(p1, p2);

const setMaxPermissionLevel = (targetModels: InputModel[], permissionLevel: PermissionLevel) => {
  for (const tm of targetModels) {
    if (isPermissionLevelBigger(tm.value as PermissionLevel, permissionLevel))
      tm.value = permissionLevel;
  }
};

const setMinPermissionLevel = (targetModels: InputModel[], permissionLevel: PermissionLevel) => {
  for (const tm of targetModels) {
    if (isPermissionLevelBigger(permissionLevel, tm.value as PermissionLevel))
      tm.value = permissionLevel;
  }
};

const permissionsRows: PermissionRow[] = [
  {
    title: 'denied',
    colorType: 'danger',
    value: PermissionLevel.DENIED,
    cells: [
      { type: Action.CREATE, show: true, visible: actions => actions.includes(Action.CREATE) },
      {
        type: Action.VIEW,
        show: true,
        visible: actions => actions.includes(Action.VIEW),
        disabled: model => model.create.value === PermissionLevel.ALLOWED,
        changed: ({ value, model }) =>
          setMaxPermissionLevel([model.edit, model.delete, model.report, model.dashboard], value),
      },
      {
        type: Action.EDIT,
        show: true,
        visible: actions => actions.includes(Action.EDIT),
        changed: ({ value, model }) => setMaxPermissionLevel([model.delete], value),
      },
      { type: Action.DELETE, show: true, visible: actions => actions.includes(Action.DELETE) },
      { type: Action.REPORT, show: true, visible: actions => actions.includes(Action.REPORT) },
      {
        type: Action.DASHBOARD,
        show: true,
        visible: actions => actions.includes(Action.DASHBOARD),
      },
    ],
  },
  {
    title: 'responsible',
    colorType: 'default',
    value: PermissionLevel.RESPONSIBLE,
    cells: [
      { type: Action.CREATE, show: false, visible: actions => actions.includes(Action.CREATE) },
      {
        type: Action.VIEW,
        show: true,
        visible: actions => actions.includes(Action.VIEW),
        changed: ({ value, model }) => setMaxPermissionLevel([model.edit, model.delete], value),
      },
      {
        type: Action.EDIT,
        show: true,
        visible: actions => actions.includes(Action.EDIT),
        disabled: model =>
          isPermissionLevelBigger(PermissionLevel.RESPONSIBLE, model.view.value as PermissionLevel),
        changed: ({ value, model }) => setMaxPermissionLevel([model.delete], value),
      },
      {
        type: Action.DELETE,
        show: true,
        visible: actions => actions.includes(Action.DELETE),
        disabled: model =>
          isPermissionLevelBigger(PermissionLevel.RESPONSIBLE, model.edit.value as PermissionLevel),
      },
      {
        type: Action.REPORT,
        show: true,
        visible: actions => actions.includes(Action.REPORT),
        disabled: model =>
          isPermissionLevelBigger(PermissionLevel.RESPONSIBLE, model.view.value as PermissionLevel),
      },
      {
        type: Action.DASHBOARD,
        show: true,
        visible: actions => actions.includes(Action.DASHBOARD),
        disabled: model =>
          isPermissionLevelBigger(PermissionLevel.RESPONSIBLE, model.view.value as PermissionLevel),
      },
    ],
  },
  {
    title: 'subdepartment',
    colorType: 'default',
    value: PermissionLevel.SUBDEPARTMENT,
    cells: [
      { type: Action.CREATE, show: false, visible: actions => actions.includes(Action.CREATE) },
      {
        type: Action.VIEW,
        show: true,
        visible: actions => actions.includes(Action.VIEW),
        changed: ({ value, model }) => setMaxPermissionLevel([model.edit, model.delete], value),
      },
      {
        type: Action.EDIT,
        show: true,
        visible: actions => actions.includes(Action.EDIT),
        disabled: model =>
          isPermissionLevelBigger(
            PermissionLevel.SUBDEPARTMENT,
            model.view.value as PermissionLevel
          ),
        changed: ({ value, model }) => setMaxPermissionLevel([model.delete], value),
      },
      {
        type: Action.DELETE,
        show: true,
        visible: actions => actions.includes(Action.DELETE),
        disabled: model =>
          isPermissionLevelBigger(
            PermissionLevel.SUBDEPARTMENT,
            model.edit.value as PermissionLevel
          ),
      },
      {
        type: Action.REPORT,
        show: true,
        visible: actions => actions.includes(Action.REPORT),
        disabled: model =>
          isPermissionLevelBigger(PermissionLevel.RESPONSIBLE, model.view.value as PermissionLevel),
      },
      {
        type: Action.DASHBOARD,
        show: true,
        visible: actions => actions.includes(Action.DASHBOARD),
        disabled: model =>
          isPermissionLevelBigger(PermissionLevel.RESPONSIBLE, model.view.value as PermissionLevel),
      },
    ],
  },
  {
    title: 'department',
    colorType: 'default',
    value: PermissionLevel.DEPARTMENT,
    cells: [
      { type: Action.CREATE, show: false, visible: actions => actions.includes(Action.CREATE) },
      {
        type: Action.VIEW,
        show: true,
        visible: actions => actions.includes(Action.VIEW),
        changed: ({ value, model }) => setMaxPermissionLevel([model.edit, model.delete], value),
      },
      {
        type: Action.EDIT,
        show: true,
        visible: actions => actions.includes(Action.EDIT),
        disabled: model =>
          isPermissionLevelBigger(PermissionLevel.DEPARTMENT, model.view.value as PermissionLevel),
        changed: ({ value, model }) => setMaxPermissionLevel([model.delete], value),
      },
      {
        type: Action.DELETE,
        show: true,
        visible: actions => actions.includes(Action.DELETE),
        disabled: model =>
          isPermissionLevelBigger(PermissionLevel.DEPARTMENT, model.edit.value as PermissionLevel),
      },
      {
        type: Action.REPORT,
        show: true,
        visible: actions => actions.includes(Action.REPORT),
        disabled: model =>
          isPermissionLevelBigger(PermissionLevel.RESPONSIBLE, model.view.value as PermissionLevel),
      },
      {
        type: Action.DASHBOARD,
        show: true,
        visible: actions => actions.includes(Action.DASHBOARD),
        disabled: model =>
          isPermissionLevelBigger(PermissionLevel.RESPONSIBLE, model.view.value as PermissionLevel),
      },
    ],
  },
  {
    title: 'allowed',
    colorType: 'success',
    value: PermissionLevel.ALLOWED,
    cells: [
      {
        type: Action.CREATE,
        show: true,
        visible: actions => actions.includes(Action.CREATE),
        changed: ({ model }) => setMinPermissionLevel([model.view], PermissionLevel.RESPONSIBLE),
      },
      { type: Action.VIEW, show: true, visible: actions => actions.includes(Action.VIEW) },
      {
        type: Action.EDIT,
        show: true,
        visible: actions => actions.includes(Action.EDIT),
        disabled: model =>
          isPermissionLevelBigger(PermissionLevel.ALLOWED, model.view.value as PermissionLevel),
      },
      {
        type: Action.DELETE,
        show: true,
        visible: actions => actions.includes(Action.DELETE),
        disabled: model =>
          isPermissionLevelBigger(PermissionLevel.ALLOWED, model.edit.value as PermissionLevel),
      },
      {
        type: Action.REPORT,
        show: true,
        visible: actions => actions.includes(Action.REPORT),
        disabled: model =>
          isPermissionLevelBigger(PermissionLevel.RESPONSIBLE, model.view.value as PermissionLevel),
      },
      {
        type: Action.DASHBOARD,
        show: true,
        visible: actions => actions.includes(Action.DASHBOARD),
        disabled: model =>
          isPermissionLevelBigger(PermissionLevel.RESPONSIBLE, model.view.value as PermissionLevel),
      },
    ],
  },
];

interface Props {
  link: string;
  title: string;
  actions: Action[];
  editUserStore: EditUserStore;
  objectType: PermissionObjectType;
  objectId?: number;
  isFullSize?: boolean;
}

const ObjectPermissionsItem = observer((props: Props) => {
  const {
    actions,
    objectType,
    title,
    link,
    editUserStore,
    objectId = null,
    isFullSize = false,
  } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.edit_user_page.ui.object_permissions_item',
  });

  const { hasDepartment, hasSubdepartment } = editUserStore;

  const permissionsForm = editUserStore.getObjectPermissionModel({ objectType, objectId });

  const checkRowVisibility = useCallback(
    (permissionLevel: PermissionLevel): boolean =>
      [PermissionLevel.DENIED, PermissionLevel.RESPONSIBLE, PermissionLevel.ALLOWED].includes(
        permissionLevel
      ) ||
      (permissionLevel === PermissionLevel.DEPARTMENT && hasDepartment) ||
      (permissionLevel === PermissionLevel.SUBDEPARTMENT && hasSubdepartment),
    [hasDepartment, hasSubdepartment]
  );

  const getPermissionModel = useCallback(
    (action: Action): InputModel => {
      switch (action) {
        case Action.CREATE:
          return permissionsForm.create;

        case Action.VIEW:
          return permissionsForm.view;

        case Action.EDIT:
          return permissionsForm.edit;

        case Action.DELETE:
          return permissionsForm.delete;

        case Action.REPORT:
          return permissionsForm.report;

        case Action.DASHBOARD:
          return permissionsForm.dashboard;
      }
    },
    [permissionsForm]
  );

  return (
    <Root $isFullSize={isFullSize}>
      <PermissionItemHeader title={title} link={link} hintText={t('hint', { title })} />

      <ContentGrid $columnNumber={actions.length}>
        <div />

        {actions.includes(Action.CREATE) && (
          <PermissionItemColumnTitle>{t('create')}</PermissionItemColumnTitle>
        )}
        {actions.includes(Action.VIEW) && (
          <PermissionItemColumnTitle>{t('view')}</PermissionItemColumnTitle>
        )}
        {actions.includes(Action.EDIT) && (
          <PermissionItemColumnTitle>{t('edit')}</PermissionItemColumnTitle>
        )}
        {actions.includes(Action.DELETE) && (
          <PermissionItemColumnTitle>{t('delete')}</PermissionItemColumnTitle>
        )}
        {actions.includes(Action.REPORT) && (
          <PermissionItemColumnTitle>{t('report')}</PermissionItemColumnTitle>
        )}
        {actions.includes(Action.DASHBOARD) && (
          <PermissionItemColumnTitle>{t('dashboard')}</PermissionItemColumnTitle>
        )}

        {permissionsRows.map(
          (r, rowIdx) =>
            checkRowVisibility(r.value) && (
              <Fragment key={`row-${objectId}-${rowIdx}`}>
                <PermissionItemRowTitle>{t(r.title)}</PermissionItemRowTitle>

                {r.cells
                  .filter(c => c.visible(actions))
                  .map((c, cellIdx) =>
                    c.show ? (
                      <MyRadio
                        key={`cell-${rowIdx}-${cellIdx}`}
                        value={r.value}
                        colorType={r.colorType}
                        model={getPermissionModel(c.type)}
                        disabled={c.disabled?.(permissionsForm)}
                        handleChange={v =>
                          c.changed?.({ value: v as PermissionLevel, model: permissionsForm })
                        }
                      />
                    ) : (
                      <div key={`cell-${rowIdx}-${cellIdx}`} />
                    )
                  )}
              </Fragment>
            )
        )}
      </ContentGrid>
    </Root>
  );
});

ObjectPermissionsItem.displayName = 'ObjectPermissionsItem';
export { ObjectPermissionsItem };
