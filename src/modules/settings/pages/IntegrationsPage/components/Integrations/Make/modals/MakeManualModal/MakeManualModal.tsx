import { routes } from '@/app';
import { MakeSmallIcon } from '../../../../../../../shared';
import { IntegrationInfoLink } from '../../../../IntegrationInfoLink/IntegrationInfoLink';
import { IntegrationInfoModalTemplate } from '../../../../IntegrationInfoModalTemplate/IntegrationInfoModalTemplate';
import { IntegrationInfoText } from '../../../../IntegrationInfoText/IntegrationInfoText';
import { IntegrationInfoTitle } from '../../../../IntegrationInfoTitle/IntegrationInfoTitle';
import {
  IntegrationOrderedList,
  IntegrationOrderedListItem,
} from '../../../../IntegrationOrderedList/IntegrationOrderedList.styles';

interface Props {
  opened: boolean;
  hide: () => void;
  onApprove: () => void;
}

const MakeManualModal = (props: Props) => {
  const { opened, hide, onApprove } = props;

  // currently only available in english and only for Amwork
  return (
    <IntegrationInfoModalTemplate
      hideApprove
      isOpened={opened}
      Icon={<MakeSmallIcon />}
      cancelTitle="Close"
      headerTitle="Amwork + Make Integration Manual"
      onClose={hide}
      onApprove={onApprove}
    >
      <IntegrationInfoTitle>
        {'Amwork integrates seamlessly with Make.com, enabling you to automate your workflows.' +
          ' This guide provides a step-by-step manual to set up and use the integration, along with practical examples of automations.'}
      </IntegrationInfoTitle>

      <IntegrationInfoTitle>{'Step 1 – Create a Make Account'}</IntegrationInfoTitle>

      <IntegrationInfoLink
        label="Make.com Website"
        to="https://www.make.com/en/register?utm_source=amwork-app&utm_medium=partner&utm_campaign=amwork-app-partner-program"
        target="_blank"
        rel="noopener noreferrer"
      />

      <IntegrationOrderedList>
        <IntegrationOrderedListItem>
          {'Visit Make.com and sign up for a free account. If you already have an account, log in.'}
        </IntegrationOrderedListItem>
        <IntegrationOrderedListItem>
          {
            'Familiarize yourself with Make.com’s interface, which allows you to create “scenarios” (automation workflows).'
          }
        </IntegrationOrderedListItem>
      </IntegrationOrderedList>

      <IntegrationInfoTitle>
        {'Step 2 – Install the “Amwork” App on your Make account'}
      </IntegrationInfoTitle>

      <IntegrationInfoLink
        label="Amwork App on Make"
        to="https://www.make.com/en/integrations/amwork"
        target="_blank"
        rel="noopener noreferrer"
      />

      <IntegrationOrderedList>
        <IntegrationOrderedListItem>
          {'Open link to access the Amwork app on Make.com.'}
        </IntegrationOrderedListItem>
        <IntegrationOrderedListItem>
          {'Click “Install” to add Amwork to your Make workspace.'}
        </IntegrationOrderedListItem>
      </IntegrationOrderedList>

      <IntegrationInfoTitle>{'Step 3 – Connect Amwork to Make'}</IntegrationInfoTitle>

      <IntegrationInfoLink
        label="API Access Settings"
        to={routes.settingsApiKeys()}
        target="_blank"
      />

      <IntegrationOrderedList>
        <IntegrationOrderedListItem>
          {
            'In Make, create a new scenario and select one of the available Amwork modules as your starting module.'
          }
        </IntegrationOrderedListItem>
        <IntegrationOrderedListItem>
          {
            'When prompted, authenticate your Amwork account. Enter your API Key from Amwork. It can be found in the “API Access” section of the account settings.'
          }
        </IntegrationOrderedListItem>
        <IntegrationOrderedListItem>
          {'Enter login and password from your account and click “Create Connection”.'}
        </IntegrationOrderedListItem>
      </IntegrationOrderedList>

      <IntegrationInfoTitle>{'Step 4 – Use Amwork Modules in Make'}</IntegrationInfoTitle>

      <IntegrationInfoText>
        {'Amwork’s integration offers a range of modules to help you manage your workflows. You' +
          ' can create, search, update or delete cards (deals), manage tasks and activities.'}
      </IntegrationInfoText>
    </IntegrationInfoModalTemplate>
  );
};

export { MakeManualModal };
