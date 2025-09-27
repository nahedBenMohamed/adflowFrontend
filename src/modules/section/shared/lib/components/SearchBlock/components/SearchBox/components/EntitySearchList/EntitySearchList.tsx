import { DropdownScrollbarMixin } from '@/shared';
import type { Ref } from 'react';
import styled from 'styled-components';
import type { EntitySearchModel } from '../../../../../../models';
import { EntitySearchItem } from '../EntitySearchItem/EntitySearchItem';
import { LoadMoreButton } from '../LoadMoreButton/LoadMoreButton';

const Root = styled.ul`
  max-height: 400px;

  display: flex;
  flex-direction: column;

  background: var(--primary-statuses-white-0);

  ${DropdownScrollbarMixin}
`;

interface Props {
  ref?: Ref<HTMLUListElement>;
  filter: string;
  current: number;
  isLoading: boolean;
  canLoadMore: boolean;
  entities: EntitySearchModel[];
  handleLoadMore: () => void;
}

const EntitySearchList = (props: Props) => {
  const { ref, filter, current, isLoading, canLoadMore, entities, handleLoadMore } = props;

  return (
    <Root ref={ref}>
      {entities.map((e, idx) => (
        <EntitySearchItem key={e.id} entity={e} filter={filter} isFocused={idx === current} />
      ))}

      {entities.length > 0 && canLoadMore && (
        <LoadMoreButton loading={isLoading} onClick={handleLoadMore} />
      )}
    </Root>
  );
};

export { EntitySearchList };
