import type { EntitySearchFilter, SearchByValueResult } from '../../models';
import { SectionHeaderCenterBlock } from '../SectionHeaderCenterBlock/SectionHeaderCenterBlock';
import { SearchBox } from './components';

interface Props {
  entityTypeId: number;
  searchEntities: (dto: EntitySearchFilter) => Promise<SearchByValueResult>;
}

const SearchBlock = (props: Props) => {
  const { entityTypeId, searchEntities } = props;

  return (
    <SectionHeaderCenterBlock>
      <SearchBox entityTypeId={entityTypeId} searchEntities={searchEntities} />
    </SectionHeaderCenterBlock>
  );
};

export { SearchBlock };
