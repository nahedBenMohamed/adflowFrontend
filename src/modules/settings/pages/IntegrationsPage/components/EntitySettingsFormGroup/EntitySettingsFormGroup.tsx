import { boardApiUtil, entityTypeStore, userStore } from '@/app';
import {
  MyInput,
  MySelect,
  MySwitchWithModel,
  MyUsersSelect,
  type Option,
  Stage,
  StagesSelect,
} from '@/shared';
import autoAnimate from '@formkit/auto-animate';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { EntitySettingsStore } from '../../../../store';
import { IntegrationFormGroup } from '../IntegrationFormGroup/IntegrationFormGroup';
import { IntegrationInfoText } from '../IntegrationInfoText/IntegrationInfoText';
import { IntegrationInfoTitle } from '../IntegrationInfoTitle/IntegrationInfoTitle';

const Delimiter = styled.hr`
  width: 100%;

  border-top: 1px solid var(--graphite-graphite-80);
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

interface Props {
  entitySettingsStore: EntitySettingsStore;
  customAnnotation?: string;
  customCreateEntitiesLabel?: string;
}

const EntitySettingsFormGroup = observer((props: Props) => {
  const { entitySettingsStore, customAnnotation, customCreateEntitiesLabel } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.ui.common.form',
  });

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current && autoAnimate(ref.current);
  }, [ref]);

  const { data: boards } = boardApiUtil.useGetBoardsByEntityTypeId({
    entityTypeId: entitySettingsStore.leadEntityType.value,
  });

  const handleChangeContactEntityType = useCallback(() => {
    // clear errors on entity type selects (they can be present if validation fails)
    entitySettingsStore.contactEntityType.clearError();
    entitySettingsStore.leadEntityType.clearError();
  }, [entitySettingsStore.contactEntityType, entitySettingsStore.leadEntityType]);

  const handleChangeLeadEntityType = useCallback(() => {
    // clear board and stage values if changing lead entity type
    entitySettingsStore.leadBoard.resetValue();
    entitySettingsStore.leadStage.resetValue();

    // clear errors on entity type selects (they can be present if validation fails)
    entitySettingsStore.contactEntityType.clearError();
    entitySettingsStore.leadEntityType.clearError();
  }, [
    entitySettingsStore.leadBoard,
    entitySettingsStore.contactEntityType,
    entitySettingsStore.leadEntityType,
    entitySettingsStore.leadStage,
  ]);

  const handleChangeLeadStage = useCallback(
    (stage: Stage) => {
      entitySettingsStore.leadBoard.setValue(stage.boardId);
    },
    [entitySettingsStore.leadBoard]
  );

  const contactsAndCompaniesOptions = useMemo<Option[]>(
    () => [{ value: null, label: t('no_create') }, ...entityTypeStore.contactsAndCompaniesOptions],
    [t]
  );

  const otherEntityTypesOptions = useMemo<Option[]>(
    () => [
      { value: null, label: t('no_create') },
      ...entityTypeStore.entityTypesExceptContactAndCompaniesOptions,
    ],
    [t]
  );

  return (
    <>
      <Delimiter />

      <IntegrationInfoTitle>{t('messenger_leads_title')}</IntegrationInfoTitle>

      <IntegrationInfoText>
        {customAnnotation ?? t('messenger_leads_annotation')}
      </IntegrationInfoText>

      <IntegrationFormGroup
        label={customCreateEntitiesLabel ?? t('create_entities')}
        alignItems="center"
      >
        <MySwitchWithModel model={entitySettingsStore.createEntities} label={t('on')} />
      </IntegrationFormGroup>

      <div ref={ref}>
        {entitySettingsStore.createEntities.value && (
          <Content>
            <IntegrationFormGroup label={t('create_contact')}>
              <MySelect
                withinPortal
                options={contactsAndCompaniesOptions}
                variant="outlined-without-active-shadow"
                model={entitySettingsStore.contactEntityType}
                placeholder={t('placeholders.select_module')}
                handleChangeOption={handleChangeContactEntityType}
              />
            </IntegrationFormGroup>

            <IntegrationFormGroup label={t('create_lead')}>
              <MySelect
                withinPortal
                options={otherEntityTypesOptions}
                model={entitySettingsStore.leadEntityType}
                variant="outlined-without-active-shadow"
                placeholder={t('placeholders.select_module')}
                handleChangeOption={handleChangeLeadEntityType}
              />
            </IntegrationFormGroup>

            {Boolean(boards && boards.length > 0) && (
              <IntegrationFormGroup label={t('lead_stage')}>
                <StagesSelect
                  monochrome
                  withinPortal
                  variant="outlined"
                  model={entitySettingsStore.leadStage}
                  entityTypeId={entitySettingsStore.leadEntityType.value}
                  handleChangeStage={handleChangeLeadStage}
                />
              </IntegrationFormGroup>
            )}

            {entitySettingsStore.leadEntityType.value && (
              <IntegrationFormGroup label={t('lead_name')}>
                <MyInput
                  variant="outlined"
                  model={entitySettingsStore.leadName}
                  placeholder={t('placeholders.lead_name')}
                />
              </IntegrationFormGroup>
            )}

            <IntegrationFormGroup label={t('lead_owner')}>
              <MyUsersSelect
                withinPortal
                variant="outlined"
                users={userStore.activeUsers}
                model={entitySettingsStore.ownerId}
                placeholder={t('placeholders.select_user')}
              />
            </IntegrationFormGroup>

            <IntegrationFormGroup label={t('check_duplicates')} alignItems="center">
              <MySwitchWithModel model={entitySettingsStore.checkDuplicate} label={t('on')} />
            </IntegrationFormGroup>

            {entitySettingsStore.leadEntityType.value &&
              entitySettingsStore.checkDuplicate.value && (
                <IntegrationFormGroup label={t('check_active_lead')} alignItems="center">
                  <MySwitchWithModel model={entitySettingsStore.checkActiveLead} label={t('on')} />
                </IntegrationFormGroup>
              )}
          </Content>
        )}
      </div>
    </>
  );
});

EntitySettingsFormGroup.displayName = 'EntitySettingsFormGroup';
export { EntitySettingsFormGroup };
