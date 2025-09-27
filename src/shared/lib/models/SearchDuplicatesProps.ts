export interface SearchDuplicatesProps {
  searchDuplicates: boolean;
  entityTypeId: number;
  excludeEntitiesId?: number[];
  changeEntityCb: (duplicateId: number) => void;
}
