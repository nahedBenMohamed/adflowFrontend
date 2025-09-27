import {
  CustomizeButton,
  EditableTabTitle,
  envUtil,
  FieldGroupTabPanel,
  HideScrollbarMixin,
  type Nullable,
  PlusIconSquareLegacy,
  PlusSecondaryIcon,
  useTransformScroll,
} from '@/shared';
import { FieldGroupTabs } from '@/shared/lib/components/FieldGroupTabs/FieldGroupTabs';
import { observer } from 'mobx-react-lite';
import { type ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import {
  type AnalyticsFieldSubgroupCode,
  type FieldGroup,
  FieldGroupCode,
  FieldSpecialTab,
  type RequisitesFieldSubgroupCode,
} from '../../../../../../shared';
import type { FieldGroupsStore, FieldSettingsStore, FieldsStore } from '../../../../../../store';
import { EditFields } from '../../EditFields';

const AddTab = styled.div`
  width: 26px;
  height: 26px;

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 2;

  margin-right: 8px;
  background: var(--graphite-graphite-20);
  border-radius: var(--border-radius-element);

  svg {
    rect,
    path {
      transition: var(--transition-200);
    }
  }

  &:hover {
    svg {
      rect,
      path {
        opacity: 1;
        stroke: var(--button-text-graphite-primary-text);
      }
    }
  }
`;

const AddExtraTab = styled.div`
  width: 100%;
  min-height: 26px;
  min-width: 20px;

  z-index: 2;

  display: flex;
  align-items: center;
  gap: 4px;

  line-height: 24px;
  color: var(--button-text-graphite-priory-text);

  padding: 0 8px;
  background: var(--graphite-graphite-20);
  border: 1px solid var(--graphite-graphite-120);
  border-radius: var(--border-radius-element);
  transition: var(--transition-200);

  svg path {
    fill: var(--graphite-graphite-360) !important;

    transition: var(--transition-200);
  }

  &:hover {
    border: 1px solid var(--button-text-graphite-primary-text);

    svg path {
      fill: var(--button-text-graphite-primary-text) !important;
    }
  }
`;

const WrapTab = styled.div`
  position: relative;

  width: 100%;
`;

const TabListWrapper = styled.div`
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

interface TabListProps {
  $hasLeftFade: boolean;
  $hasRightFade: boolean;
}

const TabList = styled(FieldGroupTabs.List)<TabListProps>`
  overflow: auto hidden;
  position: relative;

  padding-right: 24px;

  flex-wrap: nowrap;

  &::before {
    display: none;
  }

  // right fade effect
  ${p =>
    p.$hasRightFade &&
    css`
      mask-image: linear-gradient(to left, transparent, var(--primary-statuses-white-0) 24px);
    `}

  // left fade effect
  ${p =>
    p.$hasLeftFade &&
    css`
      mask-image: linear-gradient(to right, transparent, var(--primary-statuses-white-0) 24px);
    `}

    // Combine both fades for left and right
  ${p =>
    p.$hasLeftFade &&
    p.$hasRightFade &&
    css`
      mask-image: linear-gradient(
        to right,
        transparent,
        var(--primary-statuses-white-0) 24px,
        var(--primary-statuses-white-0) calc(100% - 24px),
        transparent
      );
    `}

  ${HideScrollbarMixin}
`;

const AnalyticsFieldGroupTab = styled(FieldGroupTabs.Tab)`
  margin-right: 8px !important;
`;

const ErrorMessage = styled.div`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: var(--button-text-red-default);

  margin: 8px 0;
`;

interface Props {
  showEditButton: boolean;
  fieldsStore: FieldsStore;
  entityTypeId: Nullable<number>;
  fieldGroupsStore: FieldGroupsStore;
  autoFocus?: boolean;
  isEditMode?: boolean;
  fieldSettingsStore?: FieldSettingsStore;
  handleChangeTab: (tab: Nullable<string>) => void;
  toggleEditMode?: () => void;
}

const EditFieldsTab = observer((props: Props) => {
  const {
    fieldsStore,
    entityTypeId,
    showEditButton,
    fieldGroupsStore,
    autoFocus,
    isEditMode,
    fieldSettingsStore,
    handleChangeTab,
    toggleEditMode,
  } = props;

  const {
    errorCode,
    activeTabKey,
    isValidTabKey,
    activeFieldGroups,
    hasAnalyticsGroup,
    hasRequisitesGroup,
    firstActiveFieldGroup,
    validate,
    deleteGroup,
    changeGroupName,
  } = fieldGroupsStore;

  const { t: t1 } = useTranslation('store.fields-store');
  const { t: t2 } = useTranslation('store.field-groups-store');

  const tabsList = useRef<HTMLDivElement>(null);

  const [hasLeftFade, setHasLeftFade] = useState(false);
  const [hasRightFade, setHasRightFade] = useState(false);

  useEffect(() => {
    if (isValidTabKey) return;

    if (firstActiveFieldGroup) handleChangeTab(String(firstActiveFieldGroup.id));
  }, [isValidTabKey, firstActiveFieldGroup, handleChangeTab]);

  const getTabTitle = useCallback(
    (group: FieldGroup): ReactNode => (
      <EditableTabTitle
        autoFocus={autoFocus}
        title={group.form.name}
        withDeleteButton={!group.isSystem}
        isActive={activeTabKey === String(group.id)}
        onDelete={() => deleteGroup(group)}
        onChange={name => changeGroupName(group, name)}
      />
    ),
    [activeTabKey, autoFocus, deleteGroup, changeGroupName]
  );

  const handleToggleEditMode = useCallback(() => {
    if (!validate() || !fieldsStore.validate()) return;

    toggleEditMode?.();
  }, [fieldsStore, toggleEditMode, validate]);

  const getAddFieldHandler = useCallback(
    (fieldGroupId: number) => () => fieldsStore.addTextFieldWithCode({ groupId: fieldGroupId }),
    [fieldsStore]
  );

  const getAddAnalyticsSubgroupHandler = useCallback(
    (fieldGroupId: number) => (code: AnalyticsFieldSubgroupCode) =>
      fieldsStore.addAnalyticsSubgroup({ groupId: fieldGroupId, code }),
    [fieldsStore]
  );

  const getAddRequisitesSubgroupHandler = useCallback(
    (fieldGroupId: number) => (code: RequisitesFieldSubgroupCode) =>
      fieldsStore.addRequisitesSubgroup({ groupId: fieldGroupId, code }),
    [fieldsStore]
  );

  useLayoutEffect(() => {
    const handleScroll = () => {
      const tabsListEl = tabsList.current;

      if (!tabsListEl) return;

      const { scrollLeft, scrollWidth, clientWidth } = tabsListEl;

      setHasLeftFade(scrollLeft > 0);

      setHasRightFade(scrollLeft < scrollWidth - clientWidth);
    };

    const tabsListEl = tabsList.current;

    if (tabsListEl) {
      tabsListEl.addEventListener('scroll', handleScroll);

      handleScroll();

      return () => tabsListEl.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useTransformScroll(tabsList);

  return (
    <WrapTab>
      <FieldGroupTabs $unstyled value={activeTabKey} onChange={handleChangeTab}>
        <TabListWrapper>
          <TabList ref={tabsList} $hasLeftFade={hasLeftFade} $hasRightFade={hasRightFade}>
            {activeFieldGroups.map(g => (
              <FieldGroupTabs.Tab key={g.id} value={String(g.id)}>
                {getTabTitle(g)}
              </FieldGroupTabs.Tab>
            ))}

            <FieldGroupTabs.Tab value={FieldSpecialTab.ADD}>
              <AddTab>
                <PlusIconSquareLegacy />
              </AddTab>
            </FieldGroupTabs.Tab>

            {!hasAnalyticsGroup && (
              <AnalyticsFieldGroupTab value={FieldSpecialTab.ADD_ANALYTICS}>
                <AddExtraTab>
                  <PlusSecondaryIcon />

                  {t2('field_groups_store.analytics')}
                </AddExtraTab>
              </AnalyticsFieldGroupTab>
            )}

            {!hasRequisitesGroup && envUtil.appRUSegment && (
              <FieldGroupTabs.Tab value={FieldSpecialTab.ADD_REQUISITES}>
                <AddExtraTab>
                  <PlusSecondaryIcon />

                  {t2('field_groups_store.requisites')}
                </AddExtraTab>
              </FieldGroupTabs.Tab>
            )}
          </TabList>

          {showEditButton && (
            <CustomizeButton
              margin="2px 0 4px 6px"
              active={Boolean(isEditMode)}
              onClick={handleToggleEditMode}
            />
          )}
        </TabListWrapper>

        {activeFieldGroups.map(g => (
          <FieldGroupTabPanel key={g.id} value={String(g.id)}>
            <EditFields
              fieldsStore={fieldsStore}
              entityTypeId={entityTypeId}
              fieldSettingsStore={fieldSettingsStore}
              fields={fieldsStore.getFieldsByGroupId(g.id)}
              isAnalyticsGroup={g.code === FieldGroupCode.ANALYTICS}
              isRequisitesGroup={g.code === FieldGroupCode.REQUISITES}
              onAddField={getAddFieldHandler(g.id)}
              onAddRequisitesSubgroup={getAddRequisitesSubgroupHandler(g.id)}
              onAddAnalyticsSubgroup={getAddAnalyticsSubgroupHandler(g.id)}
            />
          </FieldGroupTabPanel>
        ))}
      </FieldGroupTabs>

      {fieldsStore.errorCode && (
        <ErrorMessage>
          {t1(`fields_store.errors.${fieldsStore.errorCode}`, { ...fieldsStore.errorMetadata })}
        </ErrorMessage>
      )}

      {errorCode && <ErrorMessage>{t2(`field_groups_store.errors.${errorCode}`)}</ErrorMessage>}
    </WrapTab>
  );
});

export { EditFieldsTab };
