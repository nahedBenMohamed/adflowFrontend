import { userStore } from '@/app';
import { InputModel, Label, MyRadio, UsersMultiselect, type MultiselectModel } from '@/shared';
import { Transition } from '@mantine/core';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { INTEGRATION_FORM_GROUP_GRID } from '../IntegrationFormGroup/IntegrationFormGroup';
import { IntegrationInfoText } from '../IntegrationInfoText/IntegrationInfoText';

const Root = styled.div`
  display: grid;
  grid-template-columns: ${INTEGRATION_FORM_GROUP_GRID};
  align-items: flex-start;
  gap: 8px;
`;

const RadiosWrapper = styled.div`
  display: flex;
  flex-direction: column;

  gap: 8px;
`;

const RadioWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
`;

interface Props {
  accessibleUsersIds: MultiselectModel<number>;
}

enum AccessibilityType {
  ALL = 'all',
  USERS = 'users',
}

const AccountAvailableFormGroup = observer((props: Props) => {
  const { accessibleUsersIds } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.ui.common.form',
  });

  const type = useLocalObservable(() =>
    InputModel.create(
      accessibleUsersIds.values.length ? AccessibilityType.USERS : AccessibilityType.ALL
    ).required()
  );

  return (
    <Root>
      <Label $noEllipsis $color="var(--button-text-graphite-primary-text)">
        {t('available')}
      </Label>

      <RadiosWrapper>
        <RadioWrapper>
          <MyRadio
            model={type}
            value={AccessibilityType.ALL}
            handleChange={() => accessibleUsersIds.setValue([])}
          />
          <IntegrationInfoText>{t('all')}</IntegrationInfoText>
        </RadioWrapper>

        <RadioWrapper>
          <MyRadio model={type} value={AccessibilityType.USERS} />
          <IntegrationInfoText>{t('users')}</IntegrationInfoText>
        </RadioWrapper>

        <Transition mounted={type.value === AccessibilityType.USERS} transition="slide-down">
          {styles => (
            <div style={{ ...styles }}>
              <UsersMultiselect
                withinPortal
                model={accessibleUsersIds}
                users={userStore.activeUsers}
                variant="outlined-without-active-shadow"
                placeholder={t('placeholders.select_users')}
              />
            </div>
          )}
        </Transition>
      </RadiosWrapper>
    </Root>
  );
});

AccountAvailableFormGroup.displayName = 'AccountAvailableFormGroup';
export { AccountAvailableFormGroup };
