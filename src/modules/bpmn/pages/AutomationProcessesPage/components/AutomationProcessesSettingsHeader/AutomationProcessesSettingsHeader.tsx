import { entityTypeStore, iconStore, routes } from '@/app';
import {
  DefaultHeader,
  PrimaryButton,
  SectionView,
  TutorialProductType,
  type DefaultHeaderModuleIconProps,
  type Nullable,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CreateAutomationButton } from '../../../../shared';

interface Props {
  boardId: Nullable<number>;
  entityTypeId: number;
  prevPage: Nullable<string>;
  areAutomationProcessesHidden?: boolean;
  selectedAutomationProcessId: Nullable<number>;
}

const AutomationProcessesSettingsHeader = observer((props: Props) => {
  const {
    boardId,
    entityTypeId,
    prevPage,
    areAutomationProcessesHidden,
    selectedAutomationProcessId,
  } = props;

  const { t } = useTranslation('module.bpmn', {
    keyPrefix: 'bpmn.pages.bpmn_automations_page.bpmn_automations_settings_header',
  });

  const navigate = useNavigate();

  const et = entityTypeStore.getById(entityTypeId);

  const moduleIconProps = useMemo<DefaultHeaderModuleIconProps>(
    () => ({
      icon: iconStore.getByName(et.section.icon).icon,
      color: iconStore.getEntityColorByEntityCategory(et.entityCategory),
    }),
    [et]
  );

  const handleNavigateBack = useCallback(() => {
    if (prevPage) {
      navigate(prevPage);

      return;
    }

    if (boardId === null) {
      navigate(routes.listSectionBase(entityTypeId));

      return;
    }

    navigate(routes.entitiesSection({ entityTypeId, boardId, tab: SectionView.BOARD }));
  }, [prevPage, entityTypeId, boardId, navigate]);

  return (
    <>
      <DefaultHeader
        objectId={entityTypeId}
        moduleIconProps={moduleIconProps}
        moduleName={t('bpmn_automations')}
        productType={TutorialProductType.ENTITY_TYPE}
        Controls={
          !selectedAutomationProcessId &&
          !areAutomationProcessesHidden && (
            <>
              <CreateAutomationButton entityTypeId={entityTypeId} />

              <PrimaryButton variant="outlined" onClick={handleNavigateBack}>
                {t('back')}
              </PrimaryButton>
            </>
          )
        }
      />
    </>
  );
});

AutomationProcessesSettingsHeader.displayName = 'AutomationProcessesSettingsHeader';
export { AutomationProcessesSettingsHeader };
