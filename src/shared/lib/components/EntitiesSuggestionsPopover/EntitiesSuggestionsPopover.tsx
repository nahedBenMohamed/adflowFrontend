import styled from 'styled-components';
import { DropdownScrollbarMixin } from '../../mixins';
import type { Entity } from '../../models';
import type { Nullable } from '../../types';
import { AddAsNewButton, EntitiesSuggestionItem, type DuplicateSuggestionType } from './components';

const Root = styled.div<{ width: number }>`
  width: ${p => p.width}px;
  min-width: 224px;

  display: flex;
  flex-direction: column;
`;

const SuggestionsList = styled.ul`
  max-height: 240px;

  display: flex;
  flex-direction: column;

  ${DropdownScrollbarMixin}
`;

interface Props {
  width: number;
  entities: Entity[];
  duplicateType: DuplicateSuggestionType;
  search: Nullable<string>;
  canAddAsNew?: boolean;
  showDuplicatesWarning: () => void;
  changeEntityCb: (duplicateId: number) => void;
}

const EntitiesSuggestionsPopover = (props: Props) => {
  const {
    width,
    entities,
    duplicateType,
    search,
    canAddAsNew,
    showDuplicatesWarning,
    changeEntityCb,
  } = props;

  return (
    <Root width={width}>
      {canAddAsNew && <AddAsNewButton onClick={showDuplicatesWarning} />}

      <SuggestionsList>
        {entities.map(e => (
          <EntitiesSuggestionItem
            key={e.id}
            entity={e}
            search={search}
            suggestionType={duplicateType}
            disabled={!e.userRights.canView}
            changeEntityCb={() => changeEntityCb(e.id)}
          />
        ))}
      </SuggestionsList>
    </Root>
  );
};

export { EntitiesSuggestionsPopover };
