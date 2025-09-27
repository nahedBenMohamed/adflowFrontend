import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { noteStore } from '../../../../store';
import { FolderBlock } from './components';

const Root = styled.div<{ $hidden?: boolean }>`
  width: 240px;
  min-width: 240px;
  height: 100%;

  display: flex;
  flex-direction: column;

  padding: 8px 0;
  border-right: 1px solid var(--graphite-graphite-80);
  background: var(--primary-statuses-white-0);
  transition: var(--transition-200);

  ${p =>
    p.$hidden &&
    css`
      width: 0;
      min-width: 0;

      overflow: hidden;
      padding: 0;
      border: none;
    `}
`;

interface Props {
  selectorHidden?: boolean;
}

const NoteFolderSelector = observer((props: Props) => {
  const { selectorHidden } = props;

  const { t } = useTranslation('module.notes', {
    keyPrefix: 'notes.folders',
  });

  const { selectedFolder, selectFolder, allNotesCount, recentlyRemovedNotesCount } = noteStore;

  const selectAllFolder = useCallback(() => {
    selectFolder('all');
  }, [selectFolder]);

  const selectRecentlyDeletedFolder = useCallback(() => {
    selectFolder('recently-deleted');
  }, [selectFolder]);

  return (
    <Root $hidden={selectorHidden}>
      <FolderBlock
        name={t('all')}
        count={allNotesCount}
        isActive={selectedFolder === 'all'}
        onClick={selectAllFolder}
      />

      {recentlyRemovedNotesCount > 0 && (
        <FolderBlock
          name={t('recently_deleted')}
          count={recentlyRemovedNotesCount}
          isActive={selectedFolder === 'recently-deleted'}
          onClick={selectRecentlyDeletedFolder}
        />
      )}
    </Root>
  );
});

NoteFolderSelector.displayName = 'NoteFolderSelector';
export { NoteFolderSelector };
