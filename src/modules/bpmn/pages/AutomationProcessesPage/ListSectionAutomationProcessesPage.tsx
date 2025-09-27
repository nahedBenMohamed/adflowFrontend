import { appStore, generalSettingsStore, routes } from '@/app';
import { useEntitiesListAutomationPageTabs } from '@/modules/section';
import {
  ArrowBackLink,
  DefaultHeader,
  PREV_PAGE_QUERY_PARAM,
  PageTemplateWithSubheader,
  SpanWithEllipsis,
  UriCodingUtil,
  WholePageLoaderWithLogo,
  useTypedParams,
  type Nullable,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { useGetAutomationsProcesses } from '../../api';
import {
  AutomationProcessType,
  AutomationProcesses,
  BPMNRequestSplashscreen,
  SELECTED_AUTOMATION_PROCESS_ID_QUERY_PARAM,
} from '../../shared';
import { AutomationProcessesSettingsHeader } from './components';

const SelectedBpmnAutomationName = styled(SpanWithEllipsis)`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

const SubheaderControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ListSectionAutomationProcessesPage = observer(() => {
  const { entityTypeId } = useTypedParams<{
    entityTypeId: number;
  }>();

  const [searchParams] = useSearchParams();

  const prevPageFromParams = searchParams.get(PREV_PAGE_QUERY_PARAM);
  const prevPage = prevPageFromParams ? UriCodingUtil.decode(prevPageFromParams) : null;

  const selectedAutomationProcessIdFromParams = searchParams.get(
    SELECTED_AUTOMATION_PROCESS_ID_QUERY_PARAM
  );
  const selectedAutomationProcessId = selectedAutomationProcessIdFromParams
    ? Number(selectedAutomationProcessIdFromParams)
    : null;

  const areAutomationProcessesHidden = !generalSettingsStore.accountSettings?.isBpmnEnable;

  const { data: automationProcesses, isLoading: areAutomationProcessesLoading } =
    useGetAutomationsProcesses({
      // we only want to show processes which user can directly edit
      isReadonly: false,
      objectId: entityTypeId,
      type: AutomationProcessType.ENTITY_TYPE,
    });

  const tabs = useEntitiesListAutomationPageTabs(entityTypeId);

  const selectedAutomationProcessName = useMemo<Nullable<string>>(() => {
    if (!selectedAutomationProcessId) return null;

    return automationProcesses?.find(a => a.id === selectedAutomationProcessId)?.name ?? null;
  }, [automationProcesses, selectedAutomationProcessId]);

  const backLinkFromProcess = useMemo<string>(
    () => routes.listSectionBpmn(entityTypeId),
    [entityTypeId]
  );

  if (!appStore.isLoaded || areAutomationProcessesLoading)
    return (
      <PageTemplateWithSubheader tabs={tabs} Header={<DefaultHeader />}>
        <WholePageLoaderWithLogo ensureSubheaderWithOffset />
      </PageTemplateWithSubheader>
    );

  return (
    <PageTemplateWithSubheader
      tabs={tabs}
      marginLeft={0}
      marginRight={0}
      rootWidth="100%"
      SubheaderContent={<ArrowBackLink small backLink={routes.listSection(entityTypeId)} />}
      Header={
        <AutomationProcessesSettingsHeader
          boardId={null}
          prevPage={prevPage}
          entityTypeId={entityTypeId}
          selectedAutomationProcessId={selectedAutomationProcessId}
          areAutomationProcessesHidden={areAutomationProcessesHidden}
        />
      }
      SubheaderCenterControls={
        selectedAutomationProcessName && !areAutomationProcessesHidden ? (
          <SubheaderControlsWrapper>
            <ArrowBackLink small backLink={backLinkFromProcess} />

            <SelectedBpmnAutomationName text={selectedAutomationProcessName} />
          </SubheaderControlsWrapper>
        ) : null
      }
    >
      {areAutomationProcessesHidden ? (
        <BPMNRequestSplashscreen />
      ) : (
        automationProcesses && (
          <AutomationProcesses
            backLink={backLinkFromProcess}
            entityTypeId={entityTypeId}
            automationProcesses={automationProcesses}
            selectedAutomationProcessId={selectedAutomationProcessId}
          />
        )
      )}
    </PageTemplateWithSubheader>
  );
});

ListSectionAutomationProcessesPage.displayName = 'ListSectionAutomationProcessesPage';
export { ListSectionAutomationProcessesPage };
