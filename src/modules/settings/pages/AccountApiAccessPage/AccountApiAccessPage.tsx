import styled from 'styled-components';
import { SettingsPageTemplate } from '../../templates';
import { ApiAccessBlock, ApiTokensList } from './components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
`;

const AccountApiAccessPage = () => {
  return (
    <SettingsPageTemplate pageTitleKey="settings.api_access">
      <Root>
        <ApiAccessBlock />

        <ApiTokensList />
      </Root>
    </SettingsPageTemplate>
  );
};

export { AccountApiAccessPage };
