import { ApixDriveSmallIcon } from '../../../../../../../shared';
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

const ApixDriveManualModal = (props: Props) => {
  const { opened, hide, onApprove } = props;

  // currently only available in english and only for Amwork
  return (
    <IntegrationInfoModalTemplate
      hideApprove
      isOpened={opened}
      Icon={<ApixDriveSmallIcon />}
      cancelTitle="Close"
      headerTitle="Amwork + ApiX-Drive Integration Manual"
      onClose={hide}
      onApprove={onApprove}
    >
      <IntegrationInfoTitle>
        {
          'Automate processes using ApiX-Drive with Amwork Integration. Follow this manual step-by-step to set up an integration.'
        }
      </IntegrationInfoTitle>

      <IntegrationInfoTitle>
        {'Outbound Integration (from Amwork to other ApiX-Drive Services)'}
      </IntegrationInfoTitle>

      <IntegrationInfoTitle>{'Step 1 – Create an ApiX-Drive Account'}</IntegrationInfoTitle>

      <IntegrationInfoLink
        label="ApiX-Drive Website"
        to="https://apix-drive.com/"
        target="_blank"
        rel="noopener noreferrer"
      />

      <IntegrationOrderedList>
        <IntegrationOrderedListItem>
          {
            'Visit ApiX-Drive and sign up for a free account. If you already have an account, log in.'
          }
        </IntegrationOrderedListItem>
        <IntegrationOrderedListItem>
          {
            'Familiarize yourself with the interface, which allows you to create “connections” (automation workflows).'
          }
        </IntegrationOrderedListItem>
      </IntegrationOrderedList>

      <IntegrationInfoTitle>{'Step 2 – Set up Data Source'}</IntegrationInfoTitle>

      <IntegrationOrderedList>
        <IntegrationOrderedListItem>
          {'Click on the “Create Connection” button to create a new connection.'}
        </IntegrationOrderedListItem>
        <IntegrationOrderedListItem>
          {'Select “Webhooks (source)” as your data source system and click “Continue”.'}
        </IntegrationOrderedListItem>
        <IntegrationOrderedListItem>
          {'Select “Get DATA” as your action trigger and click “Continue”.'}
        </IntegrationOrderedListItem>
        <IntegrationOrderedListItem>
          {
            'Click on the “Connect” button, give any name to the connection, and then click “Continue”.'
          }
        </IntegrationOrderedListItem>
        <IntegrationOrderedListItem>
          {'On the next step you will see a Webhook URL. Save it for later purposes.'}
        </IntegrationOrderedListItem>
        <IntegrationOrderedListItem>{'Finish your setup as needed.'}</IntegrationOrderedListItem>
      </IntegrationOrderedList>

      <IntegrationInfoTitle>{'Step 3 – Connect Webhook to Amwork'}</IntegrationInfoTitle>

      <IntegrationOrderedList>
        <IntegrationOrderedListItem>
          {'In your Amwork account go to your module and click on the “Automation” tab.'}
        </IntegrationOrderedListItem>
        <IntegrationOrderedListItem>
          {'Choose any stage and create a new automation with the type “HTTP Request”.'}
        </IntegrationOrderedListItem>
        <IntegrationOrderedListItem>
          {'Choose a trigger and conditions based on your automation requirements.'}
        </IntegrationOrderedListItem>
        <IntegrationOrderedListItem>
          {'Paste your saved ApiX-Drive Webhook URL in the URL field of automation setup.'}
        </IntegrationOrderedListItem>
        <IntegrationOrderedListItem>
          {
            'Select “POST” method. Do not append any headers or parameters. Enable and save the automation.'
          }
        </IntegrationOrderedListItem>
      </IntegrationOrderedList>

      <IntegrationInfoText>
        {
          'Congratulations! You have set up the outbound automation. Next, set up your data destination in ApiX-Drive based on your requirements.'
        }
      </IntegrationInfoText>

      <IntegrationInfoTitle>
        {'Inbound Integration (from other ApiX-Drive Services to Amwork)'}
      </IntegrationInfoTitle>

      <IntegrationInfoTitle>{'Step 1 – Create an ApiX-Drive Account'}</IntegrationInfoTitle>

      <IntegrationInfoLink
        label="ApiX-Drive Website"
        to="https://apix-drive.com/"
        target="_blank"
        rel="noopener noreferrer"
      />

      <IntegrationOrderedList>
        <IntegrationOrderedListItem>
          {
            'Visit ApiX-Drive and sign up for a free account. If you already have an account, log in.'
          }
        </IntegrationOrderedListItem>
        <IntegrationOrderedListItem>
          {
            'Familiarize yourself with the interface, which allows you to create “connections” (automation workflows).'
          }
        </IntegrationOrderedListItem>
      </IntegrationOrderedList>

      <IntegrationInfoTitle>{'Step 2 – Set up Data Source'}</IntegrationInfoTitle>

      <IntegrationOrderedList>
        <IntegrationOrderedListItem>
          {'Click on the “Create Connection” button to create a new connection.'}
        </IntegrationOrderedListItem>
        <IntegrationOrderedListItem>
          {'Configure data source based on your requirements. This data will be sent to Amwork.'}
        </IntegrationOrderedListItem>
      </IntegrationOrderedList>

      <IntegrationInfoTitle>{'Step 3 – Set up Data Destination'}</IntegrationInfoTitle>

      <IntegrationInfoLink
        label="Amwork API Documentation"
        to="https://amwork.dev/api/doc"
        target="_blank"
        rel="noopener noreferrer"
      />

      <IntegrationOrderedList>
        <IntegrationOrderedListItem>
          {'Select “Webhooks” as your data destination system and click “Continue”.'}
        </IntegrationOrderedListItem>
        <IntegrationOrderedListItem>
          {'Select “Send DATA (Custom)” as your action and click “Continue”.'}
        </IntegrationOrderedListItem>
        <IntegrationOrderedListItem>
          {
            'This action does not require access configuration, so just click “Continue” on the next step.'
          }
        </IntegrationOrderedListItem>
        <IntegrationOrderedListItem>
          {'Choose a suitable API endpoint in Amwork documentation. For example, if you need to create a card, look' +
            ' for /api/crm/entities/simple. Take a path and append it to your Amwork base URL, like this: https://your-company.amwork.com/api/crm/entities/simple.'}
        </IntegrationOrderedListItem>
        <IntegrationOrderedListItem>
          {'Paste your endpoint URL to the ApiX-Drive URL field.'}
        </IntegrationOrderedListItem>
        <IntegrationOrderedListItem>
          {
            'Select the method as it described in the documentation. For example, for creating a card, the method is POST.'
          }
        </IntegrationOrderedListItem>
        <IntegrationOrderedListItem>
          {
            'Go to Amwork Account Settings → API Access. Add a new authorization token and save it. '
          }
        </IntegrationOrderedListItem>
        <IntegrationOrderedListItem>
          {'In ApiX-Drive, choose Authorization Bearer, and paste in your authorization token.'}
        </IntegrationOrderedListItem>
        <IntegrationOrderedListItem>
          {'In the headers field, add your API key from settings: X-Api-Key: your-api-key.'}
        </IntegrationOrderedListItem>
        <IntegrationOrderedListItem>
          {'Add a new header and paste there this value: Content-Type: application/json.'}
        </IntegrationOrderedListItem>
        <IntegrationOrderedListItem>
          {
            'Fill in the body of the request. You can find an example of the body in the API documentation. Body should be in JSON format.'
          }
        </IntegrationOrderedListItem>
        <IntegrationOrderedListItem>{'Finish and test your setup.'}</IntegrationOrderedListItem>
      </IntegrationOrderedList>

      <IntegrationInfoText>
        {
          'Congratulations! You have set up the inbound automation. Remember that ApiX-Drive can take some time to process automation, so it won’t be instant.'
        }
      </IntegrationInfoText>
    </IntegrationInfoModalTemplate>
  );
};

export { ApixDriveManualModal };
