import {
  CustomizeButton,
  FieldGroupTabPanel,
  FieldGroupTabs,
  HideScrollbarMixin,
  Nullable,
  useTransformScroll,
  type DadataBankRequisitesSuggestion,
  type DadataOrgRequisitesSuggestion,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { type Field, type FieldGroup } from '../../../../../../shared';
import type { FieldSettingsStore, FieldValuesStore } from '../../../../../../store';
import { ShowFields } from '../../ShowFields';
import { MoreTabsDropdown, type TabOption } from '../MoreTabsDropdown/MoreTabsDropdown';

const WrapTab = styled.div`
  position: relative;
`;

const TabListWrapper = styled.div`
  width: 100%;
  height: 38px;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

interface TabsListProps {
  $hasHiddenTabs: boolean;
  $showLeftFade: boolean;
}

const TabsList = styled(FieldGroupTabs.List)<TabsListProps>`
  overflow: auto hidden;
  position: relative;

  flex-wrap: nowrap;

  &::before {
    display: none;
  }

  // fade effect for the right overflow
  ${p =>
    p.$hasHiddenTabs &&
    css`
      padding-right: 24px;

      mask-image: linear-gradient(to left, transparent, var(--primary-statuses-white-0) 24px);
    `}

  // fade effect for the left overflow
  ${p =>
    p.$showLeftFade &&
    css`
      mask-image: linear-gradient(to right, transparent, var(--primary-statuses-white-0) 24px);
    `}

  // Combine both fades for left and right
  ${p =>
    p.$hasHiddenTabs &&
    p.$showLeftFade &&
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

const RightButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const DATA_TAB_ATTRIBUTE = 'data-tab';

interface Props {
  fields: Field[];
  activeTabKey: string;
  fieldGroups: FieldGroup[];
  fieldValuesStore: FieldValuesStore;
  fieldSettingsStore: FieldSettingsStore;
  showEditButton?: boolean;
  disabled?: boolean;
  isEditMode?: boolean;
  extraTabs?: ReactNode;
  extraTabPanels?: ReactNode;
  onChangeTab: (tab: string) => void;
  onSelectOrgRequisitesSuggestion: (suggestion: DadataOrgRequisitesSuggestion) => void;
  onSelectBankRequisitesSuggestion: (suggestion: DadataBankRequisitesSuggestion) => void;
  toggleEditMode?: () => void;
  getExtraFields?: (idx: number) => ReactNode;
}

const ShowFieldsTab = observer((props: Props) => {
  const {
    fields,
    activeTabKey,
    fieldGroups,
    fieldValuesStore,
    fieldSettingsStore,
    showEditButton,
    disabled,
    isEditMode = false,
    extraTabs,
    extraTabPanels,
    onChangeTab,
    onSelectBankRequisitesSuggestion,
    onSelectOrgRequisitesSuggestion,
    toggleEditMode,
    getExtraFields,
  } = props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card',
  });

  const tabsListRef = useRef<HTMLDivElement>(null);

  const [hiddenTabs, setHiddenTabs] = useState<string[]>([]);
  const [showLeftFade, setShowLeftFade] = useState<boolean>(false);

  const getFieldsByGroupId = useCallback(
    (groupId: number) => fields.filter(f => f.fieldGroupId === groupId),
    [fields]
  );

  const scrollToTab = useCallback((tabId: string) => {
    const tabsList = tabsListRef.current;

    if (!tabsList) return;

    const tab = tabsList.querySelector(`[${DATA_TAB_ATTRIBUTE}="${tabId}"]`);

    if (tab) tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  }, []);

  const handleChangeTab = useCallback(
    (tab: Nullable<string>) => {
      if (!tab) return;

      onChangeTab(tab);

      if (hiddenTabs.includes(tab)) scrollToTab(tab);
    },
    [onChangeTab, hiddenTabs, scrollToTab]
  );

  useTransformScroll(tabsListRef);

  const handleScroll = useCallback(() => {
    const tabsList = tabsListRef.current;

    if (!tabsList) return;

    const { scrollLeft } = tabsList;

    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setShowLeftFade(scrollLeft > 0);
  }, []);

  useEffect(() => {
    const tabsList = tabsListRef.current;

    if (!tabsList) return;

    tabsList.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => tabsList.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useLayoutEffect(() => {
    const tabsList = tabsListRef.current;

    if (!tabsList) return;

    const tabs = tabsList.querySelectorAll('.mantine-Tabs-tab');

    if (tabs) {
      const tabsArray = Array.from(tabs);

      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            const tab = entry.target.getAttribute(DATA_TAB_ATTRIBUTE);

            if (!tab) return;

            if (entry.isIntersecting) {
              setHiddenTabs(prev => prev.filter(t => t !== tab));
            } else {
              setHiddenTabs(prev => [...prev.filter(t => t !== tab), tab]);
            }
          });
        },
        {
          threshold: 0.65,
          root: tabsList,
          rootMargin: '110% 0px 110% 0px',
        }
      );

      tabsArray.forEach(t => observer.observe(t));

      return () => tabsArray.forEach(t => observer.unobserve(t));
    }
  }, [fieldGroups]);

  const tabsOptions = useMemo<TabOption[]>(
    () =>
      hiddenTabs.map<TabOption>(ht => ({
        id: Number(ht),
        name:
          ht === 'files' ? t('files') : (fieldGroups.find(f => f.id === Number(ht))?.name ?? '...'),
        active: activeTabKey === ht,
        onClick: () => handleChangeTab(ht),
      })),
    [activeTabKey, fieldGroups, handleChangeTab, hiddenTabs, t]
  );

  const hasHiddenTabs = hiddenTabs.length > 0;

  return (
    <WrapTab>
      <FieldGroupTabs value={activeTabKey} onChange={handleChangeTab}>
        <TabListWrapper>
          <TabsList ref={tabsListRef} $hasHiddenTabs={hasHiddenTabs} $showLeftFade={showLeftFade}>
            {fieldGroups.map(g => (
              <FieldGroupTabs.Tab
                key={g.id}
                value={String(g.id)}
                className={activeTabKey === String(g.id) ? 'active' : ''}
                {...{ [DATA_TAB_ATTRIBUTE]: String(g.id) }}
              >
                {g.name}
              </FieldGroupTabs.Tab>
            ))}

            {extraTabs}
          </TabsList>

          <RightButtonsWrapper>
            {hasHiddenTabs && <MoreTabsDropdown options={tabsOptions} />}

            {showEditButton && toggleEditMode && (
              <CustomizeButton margin="4px 0 0 4px" active={isEditMode} onClick={toggleEditMode} />
            )}
          </RightButtonsWrapper>
        </TabListWrapper>

        {fieldGroups.map((g, idx) => (
          <FieldGroupTabPanel
            key={g.id}
            value={String(g.id)}
            $stack={activeTabKey === String(g.id)}
          >
            {getExtraFields?.(idx)}

            <ShowFields
              disabled={disabled}
              fields={getFieldsByGroupId(g.id)}
              fieldValuesStore={fieldValuesStore}
              fieldSettingsStore={fieldSettingsStore}
              onSelectOrgRequisitesSuggestion={onSelectOrgRequisitesSuggestion}
              onSelectBankRequisitesSuggestion={onSelectBankRequisitesSuggestion}
            />
          </FieldGroupTabPanel>
        ))}

        {extraTabPanels}
      </FieldGroupTabs>
    </WrapTab>
  );
});

ShowFieldsTab.displayName = 'ShowFieldsTab';
export { ShowFieldsTab };
