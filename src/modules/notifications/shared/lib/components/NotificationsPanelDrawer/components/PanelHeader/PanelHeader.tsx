import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { NotificationSettings } from '../NotificationSettings/NotificationSettings';
import { ReadAllButton } from '../ReadAllButton/ReadAllButton';
import { SoundButton } from '../SoundButton/SoundButton';

const RightBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

interface Props {
  isLoaded: boolean;
  readAllDisabled: boolean;
  handleReadAll?: () => void;
}

const PanelHeader = observer((props: Props) => {
  const { isLoaded, readAllDisabled, handleReadAll } = props;

  return (
    <>
      <NotificationSettings />

      <RightBlock>
        <SoundButton />

        <ReadAllButton disabled={readAllDisabled || !isLoaded} handleReadAll={handleReadAll} />
      </RightBlock>
    </>
  );
});

PanelHeader.displayName = 'PanelHeader';
export { PanelHeader };
