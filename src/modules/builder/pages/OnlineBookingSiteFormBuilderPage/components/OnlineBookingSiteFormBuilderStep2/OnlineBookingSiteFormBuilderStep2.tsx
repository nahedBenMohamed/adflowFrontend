import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import styled from 'styled-components';
import {
  type OnlineBookingSiteFormElementsFormData,
  type SiteFormElementsFieldModel,
  SiteFormBuilderPageStepRoot,
} from '../../../../shared';
import {
  SiteFormElementsSidebar,
  SiteFormElementsTree,
} from '../../../SiteFormBuilderPage/components/SiteFormBuilderStep2/components';

const Root = styled(SiteFormBuilderPageStepRoot)`
  position: relative;

  height: 100%;

  display: flex;
`;

interface Props {
  entityTypeIds: number[];
  siteFormElementsFormData: OnlineBookingSiteFormElementsFormData;
}

const OnlineBookingSiteFormBuilderStep2 = observer((props: Props) => {
  const { entityTypeIds, siteFormElementsFormData } = props;

  const {
    pages,
    firstPageId,
    activePageId,
    titleFormData,
    fieldLabelEnabled,
    fieldPlaceholderEnabled,
    deleteElementsFieldModelFromPage,
  } = siteFormElementsFormData;

  const getDeleteFieldHandler = useCallback(
    (fieldId: number) =>
      deleteElementsFieldModelFromPage({ pageId: activePageId, fieldModelId: fieldId }),
    [activePageId, deleteElementsFieldModelFromPage]
  );

  return (
    <Root>
      <SiteFormElementsSidebar
        entityTypeIds={entityTypeIds}
        siteFormElementsFormData={siteFormElementsFormData}
        fieldsModels={pages.flatMap<SiteFormElementsFieldModel>(p => p.fields)}
      />

      {pages.map(
        p =>
          p.id === activePageId && (
            <SiteFormElementsTree
              key={p.id}
              fieldsModels={p.fields}
              titleFormData={titleFormData}
              isFirstPage={activePageId === firstPageId}
              fieldLabelEnabled={fieldLabelEnabled.value}
              fieldPlaceholderEnabled={fieldPlaceholderEnabled.value}
              handleDeleteField={getDeleteFieldHandler}
            />
          )
      )}
    </Root>
  );
});

OnlineBookingSiteFormBuilderStep2.displayName = 'OnlineBookingSiteFormBuilderStep2';
export { OnlineBookingSiteFormBuilderStep2 };
