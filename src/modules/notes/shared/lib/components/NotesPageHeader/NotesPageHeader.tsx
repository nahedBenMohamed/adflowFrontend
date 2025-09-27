import {
  CreateButton,
  DefaultHeader,
  InputModel,
  SearchInput,
  debounce,
  type DefaultHeaderModuleIconProps,
  type Nullable,
} from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { noteStore } from '../../../../store';
import { NotesIcon } from '../../../assets';

const SearchBlockWrapper = styled.div`
  width: 60%;
  min-width: 184px;

  margin: 0 auto;
`;

const moduleIconProps: DefaultHeaderModuleIconProps = {
  icon: <NotesIcon />,
  color: 'var(--primary-statuses-amethyst-360)',
};

const NotesPageHeader = observer(() => {
  const { t } = useTranslation('module.notes', {
    keyPrefix: 'notes.notes_page',
  });

  const [, setSearchQuery] = useState<Nullable<string>>(null);

  const searchModel = useLocalObservable(() => InputModel.create());

  const handleClearSearch = useCallback(() => {
    searchModel.value = '';
    setSearchQuery(null);
  }, [setSearchQuery, searchModel]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearchQuery = useCallback(
    debounce((searchQuery: string) => {
      if (!searchQuery.trim().length) {
        setSearchQuery(null);

        return;
      }

      setSearchQuery(searchQuery);
    }, 750),
    []
  );

  const handleCreate = useCallback(() => {
    noteStore.createNote(t('new_note_heading'));
  }, [t]);

  return (
    <DefaultHeader
      hideNotes
      moduleName={t('module_name')}
      moduleIconProps={moduleIconProps}
      Controls={<CreateButton tooltip={t('add_note')} onClick={handleCreate} />}
      CentralContent={
        <SearchBlockWrapper>
          <SearchInput
            model={searchModel}
            onClear={handleClearSearch}
            onChange={debouncedSearchQuery}
          />
        </SearchBlockWrapper>
      }
    />
  );
});

NotesPageHeader.displayName = 'NotesPageHeader';
export { NotesPageHeader };
