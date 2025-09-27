import { appStore } from '@/app';
import { MultichatButton } from '@/modules/multichat';
import { NotificationsButton } from '@/modules/notifications';
import { TutorialButton } from '@/modules/tutorial';
import { Tooltip } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import type { TutorialProductType } from '../../../../models';
import { AvatarBlock } from '../AvatarBlock/AvatarBlock';
import { AccountBlockSkeleton } from './AccountBlockSkeleton';

const Root = styled(Tooltip.Group)`
  display: flex;
  align-items: center;
  gap: 16px;
`;

interface Props {
  hideMultichat?: boolean;
  hideNotes?: boolean;
  // objectId – either an entityTypeId, scheduleId or productsSectionId
  objectId?: number;
  productType?: TutorialProductType;
}

const AccountBlock = observer((props: Props) => {
  const { hideMultichat, objectId, productType } = props;

  return (
    <Root>
      {appStore.isLoaded ? (
        <>
          {/*{!hideNotes && <NotesButton />} // TODO: Show notes when the backend is ready  */}

          <NotificationsButton />

          {!hideMultichat && <MultichatButton />}

          {productType && <TutorialButton objectId={objectId} productType={productType} />}

          <AvatarBlock />
        </>
      ) : (
        <AccountBlockSkeleton />
      )}
    </Root>
  );
});

AccountBlock.displayName = 'AccountBlock';
export { AccountBlock };
