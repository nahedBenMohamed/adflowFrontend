import { appStore, entityTypeStore, iconStore, routes } from '@/app';
import { AutomationStore, ListAutomationSidebar } from '@/modules/automation';
import {
  ArrowBackLink,
  DefaultHeader,
  type DefaultHeaderModuleIconProps,
  EntityApiUtil,
  type EntityType,
  LeftNavTemplate,
  PageTemplateWithSubheader,
  Subheader,
  TutorialProductType,
  useTitle,
  useTypedParams,
  WholePageLoaderWithLogo,
} from '@/shared';
import { when } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import {
  EntitiesListAutomationColumn,
  SearchBlock,
  useEntitiesListAutomationPageTabs,
} from '../../shared';

const Root = styled.div`
  height: 100%;

  display: flex;

  padding: 16px 0;
`;

const EntitiesListAutomationPage = observer(() => {
  const { entityTypeId: etId } = useTypedParams<{
    entityTypeId: number;
  }>();

  const [pageTitle, setPageTitle] = useState<string>();

  useTitle({ dynamicTitle: pageTitle });

  const automationStore = useMemo(
    () => new AutomationStore({ entityTypeId: etId, boardId: null }),
    [etId]
  );

  useEffect(() => {
    when(
      () => appStore.isLoaded,
      () => {
        const et = entityTypeStore.getById(etId);

        setPageTitle(et.section.name);

        automationStore.loadData();
      }
    );
  }, [automationStore, etId]);

  const getModuleIconProps = useCallback<(et: EntityType) => DefaultHeaderModuleIconProps>(
    et => ({
      icon: iconStore.getByName(et.section.icon).icon,
      color: iconStore.getEntityColorByEntityCategory(et.entityCategory),
    }),
    []
  );

  const tabs = useEntitiesListAutomationPageTabs(etId);

  if (!appStore.isLoaded)
    return (
      <PageTemplateWithSubheader tabs={tabs} Header={<DefaultHeader />}>
        <WholePageLoaderWithLogo ensureSubheaderWithOffset />
      </PageTemplateWithSubheader>
    );

  const et = entityTypeStore.getById(etId);

  return (
    <LeftNavTemplate
      contentMarginTop="var(--header-with-subheader-height)"
      Header={
        <DefaultHeader
          objectId={etId}
          moduleName={et.section.name}
          moduleIconProps={getModuleIconProps(et)}
          productType={TutorialProductType.ENTITY_TYPE}
          CentralContent={
            <SearchBlock entityTypeId={et.id} searchEntities={EntityApiUtil.searchEntities} />
          }
        />
      }
    >
      <Subheader
        tabs={tabs}
        Content={<ArrowBackLink small backLink={routes.listSection(etId)} />}
      />
      <Root>
        <ListAutomationSidebar />

        <EntitiesListAutomationColumn entityType={et} automationStore={automationStore} />
      </Root>
    </LeftNavTemplate>
  );
});

EntitiesListAutomationPage.displayName = 'EntitiesListAutomationPage';
export { EntitiesListAutomationPage };
