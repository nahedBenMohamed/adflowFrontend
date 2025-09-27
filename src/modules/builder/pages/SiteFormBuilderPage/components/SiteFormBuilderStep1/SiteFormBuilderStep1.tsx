import { userStore } from '@/app';
import { Hint, MySwitchWithModel, MyUsersSelect } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  BuilderStepBiggerTitle,
  BuilderStepBox,
  BuilderStepSubtitle,
  GiantOutlinedInput,
  GiantOutlinedInputSkeleton,
  SiteFormBuilderPageStepRoot,
} from '../../../../shared';
import type { HeadlessSiteFormBuilderStore, SiteFormBuilderStore } from '../../../../store';
import {
  SiteFormBuilderLinkedEntityItemCheckbox,
  SiteFormBuilderLinkedEntityItemRadio,
} from './components';

const Root = styled(SiteFormBuilderPageStepRoot)`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Content = styled(BuilderStepBox)`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 32px;

  padding: 32px 48px;
`;

const BlockWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const OutlinedBlock = styled.div`
  display: grid;
  grid-template-columns: repeat(2, calc(50% - 24px));
  grid-auto-rows: auto;
  gap: 16px 48px;

  padding: 24px;
  border-radius: var(--border-radius-block);
  border: 1px solid var(--graphite-graphite-120);
`;

const SettingsWrapper = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: calc(50% - 16px) 50%;
  grid-auto-rows: auto;
  align-items: center;
  gap: 16px;
`;

const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SettingsLabel = styled.label`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

const SwitchWrapper = styled.div`
  justify-self: end;
`;

const LinkedEntitiesWrapper = styled.ul`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 8px;
`;

interface Props {
  loading: boolean;
  siteFormBuilderStore: SiteFormBuilderStore | HeadlessSiteFormBuilderStore;
}

const SiteFormBuilderStep1 = observer((props: Props) => {
  const {
    loading,
    siteFormBuilderStore: {
      siteFormInitializationFormData: {
        name,
        responsibleId,
        checkDuplicate,
        mainEntityTypeLinks,
        linkedEntityTypeLinks,
        mainEntityTypeLinkModel,
        linkedEntityTypeLinksCheckboxModel,
        initializeLinkedEntityTypeLinks,
      },
    },
  } = props;

  const handleClearLinkedEntityTypeLinks = useCallback(async (): Promise<void> => {
    linkedEntityTypeLinksCheckboxModel.setValues([]);

    await initializeLinkedEntityTypeLinks();
  }, [linkedEntityTypeLinksCheckboxModel, initializeLinkedEntityTypeLinks]);

  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.site_form_builder_page.site_form_builder_step1',
  });

  return (
    <Root>
      <BuilderStepBiggerTitle>{t('title')}</BuilderStepBiggerTitle>

      <Content>
        <BlockWrapper>
          <BuilderStepSubtitle>{t('title_input_name')}</BuilderStepSubtitle>

          {loading ? (
            <GiantOutlinedInputSkeleton />
          ) : (
            <GiantOutlinedInput model={name} placeholder={t('placeholders.title_input')} />
          )}
        </BlockWrapper>

        <BlockWrapper>
          <BuilderStepSubtitle>{t('choose_main_card')}</BuilderStepSubtitle>

          <LinkedEntitiesWrapper>
            {mainEntityTypeLinks.map(et => (
              <SiteFormBuilderLinkedEntityItemRadio
                key={et.entityTypeId}
                loading={loading}
                entityTypeLink={et}
                model={mainEntityTypeLinkModel}
                handleChange={handleClearLinkedEntityTypeLinks}
              />
            ))}
          </LinkedEntitiesWrapper>
        </BlockWrapper>

        {linkedEntityTypeLinks.length > 0 && (
          <BlockWrapper>
            <BuilderStepSubtitle>{t('choose_linked_cards')}</BuilderStepSubtitle>

            <LinkedEntitiesWrapper>
              {linkedEntityTypeLinks.map(et => (
                <SiteFormBuilderLinkedEntityItemCheckbox
                  key={et.entityTypeId}
                  loading={loading}
                  entityTypeLink={et}
                  model={linkedEntityTypeLinksCheckboxModel}
                />
              ))}
            </LinkedEntitiesWrapper>
          </BlockWrapper>
        )}

        <BlockWrapper>
          <BuilderStepSubtitle>{t('card_settings')}</BuilderStepSubtitle>

          <OutlinedBlock>
            <SettingsWrapper>
              <SettingsLabel>{t('responsible_user')}</SettingsLabel>

              <MyUsersSelect
                withinPortal
                maxWidth="400px"
                model={responsibleId}
                variant="outlined-tall"
                users={userStore.activeUsers}
                placeholder={t('placeholders.responsible_select')}
              />
            </SettingsWrapper>

            <SettingsWrapper>
              <LabelWrapper>
                <SettingsLabel>{t('check_duplicates')}</SettingsLabel>

                <Hint text={t('check_duplicates_hint')} />
              </LabelWrapper>

              <SwitchWrapper>
                <MySwitchWithModel model={checkDuplicate} label={t('yes')} />
              </SwitchWrapper>
            </SettingsWrapper>
          </OutlinedBlock>
        </BlockWrapper>
      </Content>
    </Root>
  );
});

SiteFormBuilderStep1.displayName = 'SiteFormBuilderStep1';
export { SiteFormBuilderStep1 };
