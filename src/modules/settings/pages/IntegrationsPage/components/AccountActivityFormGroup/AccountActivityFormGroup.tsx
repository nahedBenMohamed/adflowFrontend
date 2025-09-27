import { Label, MySwitchWithModel, type BooleanModel } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { INTEGRATION_FORM_GROUP_GRID } from '../IntegrationFormGroup/IntegrationFormGroup';

const Root = styled.div`
  display: grid;
  grid-template-columns: ${INTEGRATION_FORM_GROUP_GRID};
  align-items: flex-start;
  gap: 8px;
`;

const LabelWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const LabelAnnotation = styled.p`
  font-size: 10px;
  font-weight: 400;
  line-height: 14px;
  color: var(--button-text-graphite-secondary-text);
`;

interface Props {
  active: BooleanModel;
}

const AccountActivityFormGroup = observer((props: Props) => {
  const { active } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.ui.common.form',
  });

  return (
    <Root>
      <LabelWrapper>
        <Label $color="var(--button-text-graphite-primary-text)">{t('account_activity')}</Label>
        <LabelAnnotation>{t('account_activity_annotation')}</LabelAnnotation>
      </LabelWrapper>

      <MySwitchWithModel model={active} label={t('on')} />
    </Root>
  );
});

AccountActivityFormGroup.displayName = 'AccountActivityFormGroup';
export { AccountActivityFormGroup };
