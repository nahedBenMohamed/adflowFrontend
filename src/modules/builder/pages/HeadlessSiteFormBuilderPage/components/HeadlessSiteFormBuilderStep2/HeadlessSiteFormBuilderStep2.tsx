import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import styled from 'styled-components';
import {
  type HeadlessSiteFormElementsFormData,
  type SiteFormElementsFieldModel,
  SiteFormBuilderPageStepRoot,
} from '../../../../shared';
import { HeadlessSiteFormElementsSidebar, HeadlessSiteFormElementsTree } from './components';

const Root = styled(SiteFormBuilderPageStepRoot)`
  position: relative;

  height: 100%;

  display: flex;
`;

interface Props {
  entityTypeIds: number[];
  siteFormElementsFormData: HeadlessSiteFormElementsFormData;
}

const HeadlessSiteFormBuilderStep2 = observer((props: Props) => {
  const { entityTypeIds, siteFormElementsFormData } = props;

  const { pages, activePageId, deleteElementsFieldModelFromPage } = siteFormElementsFormData;

  const getDeleteFieldHandler = useCallback(
    (fieldId: number) =>
      deleteElementsFieldModelFromPage({ pageId: activePageId, fieldModelId: fieldId }),
    [activePageId, deleteElementsFieldModelFromPage]
  );

  return (
    <Root>
      <HeadlessSiteFormElementsSidebar
        entityTypeIds={entityTypeIds}
        siteFormElementsFormData={siteFormElementsFormData}
        fieldsModels={pages.flatMap<SiteFormElementsFieldModel>(p => p.fields)}
      />

      {pages.map(
        p =>
          p.id === activePageId && (
            <HeadlessSiteFormElementsTree
              key={p.id}
              fieldsModels={p.fields}
              handleDeleteField={getDeleteFieldHandler}
            />
          )
      )}
    </Root>
  );
});

HeadlessSiteFormBuilderStep2.displayName = 'HeadlessSiteFormBuilderStep2';
export { HeadlessSiteFormBuilderStep2 };
