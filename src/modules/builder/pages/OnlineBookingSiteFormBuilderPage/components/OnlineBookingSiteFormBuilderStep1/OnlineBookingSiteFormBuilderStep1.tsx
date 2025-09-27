import { userStore } from '@/app';
import { Hint, MyInput, MySwitchWithModel, MyUsersSelect, SkeletonAnimationMixin } from '@/shared';
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
import type { OnlineBookingSiteFormBuilderStore } from '../../../../store';
import { SiteFormBuilderLinkedEntityItemCheckbox } from '../../../SiteFormBuilderPage/components/SiteFormBuilderStep1/components/SiteFormBuilderLinkedEntityItemCheckbox/SiteFormBuilderLinkedEntityItemCheckbox';
import { OnlineBookingSiteFormBuilderScheduleItem } from './components';

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

const SchedulerBlockSkeleton = styled.div<{ $delay?: number }>`
  width: 100%;
  height: 44px;

  border-radius: var(--border-radius-element);
  box-shadow:
    0px 0px 2px 0px #eef4fe,
    0px 1px 2px 0px #d0daeb;

  ${SkeletonAnimationMixin}
`;

const EmptyBlock = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

interface Props {
  loading: boolean;
  siteFormBuilderStore: OnlineBookingSiteFormBuilderStore;
}

const OnlineBookingSiteFormBuilderStep1 = observer((props: Props) => {
  const {
    loading,
    siteFormBuilderStore: {
      schedules,
      areSchedulesLoaded,
      siteFormInitializationFormData: {
        name,
        responsibleId,
        checkDuplicate,
        scheduleLimitDays,
        scheduleLinksCheckboxModel,
        linkedEntityTypeLinkModel,
        linkedEntityTypeLink,
        reinitializeLinkedEntityTypeLink,
      },
    },
  } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix:
      'builder.pages.online_booking_site_form_builder_page.online_booking_site_form_builder_step1',
  });

  const handleChangeScheduler = useCallback(() => {
    reinitializeLinkedEntityTypeLink(schedules);
  }, [reinitializeLinkedEntityTypeLink, schedules]);

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
          <BuilderStepSubtitle>{t('choose_schedulers')}</BuilderStepSubtitle>

          <LinkedEntitiesWrapper>
            {areSchedulesLoaded ? (
              schedules.length ? (
                schedules.map(s => (
                  <OnlineBookingSiteFormBuilderScheduleItem
                    key={s.id}
                    schedule={s}
                    model={scheduleLinksCheckboxModel}
                    loading={loading}
                    handleChange={handleChangeScheduler}
                  />
                ))
              ) : (
                <EmptyBlock>{t('no_schedules')}</EmptyBlock>
              )
            ) : (
              <>
                <SchedulerBlockSkeleton />
                <SchedulerBlockSkeleton />
              </>
            )}
          </LinkedEntitiesWrapper>
        </BlockWrapper>

        <BlockWrapper>
          <BuilderStepSubtitle>{t('choose_linked_cards')}</BuilderStepSubtitle>
          <LinkedEntitiesWrapper>
            {linkedEntityTypeLink ? (
              <SiteFormBuilderLinkedEntityItemCheckbox
                loading={loading}
                entityTypeLink={linkedEntityTypeLink}
                model={linkedEntityTypeLinkModel}
              />
            ) : (
              <EmptyBlock>{t('no_linked_cards')}</EmptyBlock>
            )}
          </LinkedEntitiesWrapper>
        </BlockWrapper>

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
              <SettingsLabel>{t('limit_days_name')}</SettingsLabel>

              <MyInput
                width="100%"
                variant="outlined-tall"
                model={scheduleLimitDays}
                placeholder={t('placeholders.limit_days')}
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

OnlineBookingSiteFormBuilderStep1.displayName = 'OnlineBookingSiteFormBuilderStep1';
export { OnlineBookingSiteFormBuilderStep1 };
