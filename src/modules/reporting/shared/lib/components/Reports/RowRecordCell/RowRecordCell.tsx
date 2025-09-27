import { userStore } from '@/app';
import type { CallDirection } from '@/modules/telephony';
import { Player, type PlayerDownloadProps } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import styled from 'styled-components';

const Root = styled.div`
  width: 100%;
  min-width: 200px;
`;

interface Props {
  userId: number;
  duration: number;
  recordUrl: string;
  direction: CallDirection;
  entityName?: string;
}

const RowRecordCell = observer((props: Props) => {
  const { userId, duration, recordUrl, direction, entityName } = props;

  const downloadProps = useMemo<PlayerDownloadProps>(
    () => ({
      canDownload: true,
      getFileName: () =>
        `${userStore.getById(userId).fullName}-${direction}${
          entityName ? `-${entityName}` : ''
        }`.trim() + '.mp3',
    }),
    [direction, entityName, userId]
  );

  return (
    <Root>
      <Player
        minifiedView
        duration={duration}
        removeControlPadding
        recordUrl={recordUrl}
        downloadProps={downloadProps}
      />
    </Root>
  );
});

export { RowRecordCell };
