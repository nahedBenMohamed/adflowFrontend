import { entityTypeStore } from '@/app';
import { HideScrollbarMixin, type EntityType, type Nullable } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useWindowSize } from 'usehooks-ts';
import {
  SiteFormElementsFieldModel,
  SiteFormFieldEntityField,
  SiteFormFieldEntityName,
  SiteFormFieldType,
  getSiteFormElementPlaceholderByFieldType,
  type AddSiteFormCardNameHandler,
  type AddSiteFormFieldHandler,
  type HeadlessSiteFormElementsFormData,
} from '../../../../../../shared';
import {
  FormElementCardNameBlock,
  FormFieldElements,
} from '../../../../../SiteFormBuilderPage/components';

const Root = styled.div<{ $navigationHeight: number }>`
  position: sticky;
  top: ${p => p.$navigationHeight + 107}px;

  height: calc(
    100dvh - var(--header-with-subheader-height) -
      ${p => p.$navigationHeight}px - var(--fixed-builder-step-controls-height) - 28px
  );
  width: 320px;

  display: flex;
  flex-direction: column;
  gap: 24px;

  padding: 16px;
  overflow-y: auto;
  border-radius: var(--border-radius-block);
  background: var(--primary-statuses-white-0);
  box-shadow:
    0px 0px 2px 0px #eef4fe,
    0px 1px 2px 0px #d0daeb;

  ${HideScrollbarMixin};
`;

const Title = styled.h4`
  font-size: 18px;
  font-weight: 600;
  line-height: 28px;
  color: var(--button-text-graphite-priory-text);
`;

const FormElementsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

interface Props {
  entityTypeIds: number[];
  fieldsModels: SiteFormElementsFieldModel[];
  siteFormElementsFormData: HeadlessSiteFormElementsFormData;
}

interface EntityTypes {
  cardEntityTypes: EntityType[];
  contactEntityTypes: EntityType[];
  companyEntityTypes: EntityType[];
}

const HeadlessSiteFormElementsSidebar = observer((props: Props) => {
  const {
    entityTypeIds,
    fieldsModels,
    siteFormElementsFormData: {
      activePageId,
      generateTemporaryFieldModelIdForPage,
      addElementsFieldModelToPage,
      getMaxFieldModelSortOrderForPage,
    },
  } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.site_form_builder_page.site_form_builder_step2.sidebar',
  });

  // used for accordion logic, type can be anything unique
  const [activeElementType, setActiveElementType] = useState<Nullable<string>>(null);

  const { cardEntityTypes, contactEntityTypes, companyEntityTypes } = useMemo<EntityTypes>(() => {
    const {
      entityTypesExceptContactAndCompanies: cardEntityTypes,
      contacts: contactEntityTypes,
      companies: companyEntityTypes,
    } = entityTypeStore;

    // we can use only one entity type name field per form
    return {
      cardEntityTypes: cardEntityTypes.filter(
        et =>
          entityTypeIds.includes(et.id) &&
          !fieldsModels.find(
            fm => fm.settings?.entityTypeId === et.id && fm.type === SiteFormFieldType.ENTITY_NAME
          )
      ),
      contactEntityTypes: contactEntityTypes.filter(
        et =>
          entityTypeIds.includes(et.id) &&
          !fieldsModels.find(
            fm => fm.settings?.entityTypeId === et.id && fm.type === SiteFormFieldType.ENTITY_NAME
          )
      ),
      companyEntityTypes: companyEntityTypes.filter(
        et =>
          entityTypeIds.includes(et.id) &&
          !fieldsModels.find(
            fm => fm.settings?.entityTypeId === et.id && fm.type === SiteFormFieldType.ENTITY_NAME
          )
      ),
    };
  }, [entityTypeIds, fieldsModels]);

  const [navigationHeight, setNavigationHeight] = useState(0);
  const { width: windowWidth } = useWindowSize();

  useLayoutEffect(() => {
    const navigation = document.getElementById('workspace__NavStepsList--Root');

    if (navigation) setNavigationHeight(navigation.clientHeight);
  }, [windowWidth]);

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleScrollToWindowBottom = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      });
    }, 200);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleAddCardNameElement = useCallback<AddSiteFormCardNameHandler>(
    ({ entityTypeId, entityTypeName }) => {
      const id = generateTemporaryFieldModelIdForPage(activePageId);

      addElementsFieldModelToPage({
        pageId: activePageId,
        fieldModel: new SiteFormElementsFieldModel({
          id,
          isRequired: true,
          label: entityTypeName,
          placeholder: entityTypeName,
          type: SiteFormFieldType.ENTITY_NAME,
          sortOrder: getMaxFieldModelSortOrderForPage(activePageId) + 1,
          settings: new SiteFormFieldEntityName({
            entityTypeId,
          }),
        }),
      });

      handleScrollToWindowBottom();
    },
    [
      activePageId,
      handleScrollToWindowBottom,
      addElementsFieldModelToPage,
      getMaxFieldModelSortOrderForPage,
      generateTemporaryFieldModelIdForPage,
    ]
  );

  const handleAddFieldElement = useCallback<AddSiteFormFieldHandler>(
    ({ fieldId, fieldLabel, fieldType, meta, entityTypeId }) => {
      const id = generateTemporaryFieldModelIdForPage(activePageId);

      addElementsFieldModelToPage({
        pageId: activePageId,
        fieldModel: new SiteFormElementsFieldModel({
          id,
          isRequired: false,
          type: SiteFormFieldType.ENTITY_FIELD,
          sortOrder: getMaxFieldModelSortOrderForPage(activePageId) + 1,
          label: fieldLabel,
          placeholder: getSiteFormElementPlaceholderByFieldType({
            fieldType,
            fallback: fieldLabel,
          }),
          settings: new SiteFormFieldEntityField({
            meta,
            fieldId,
            entityTypeId,
            isValidationRequired: null,
          }),
        }),
      });

      handleScrollToWindowBottom();
    },
    [
      activePageId,
      handleScrollToWindowBottom,
      addElementsFieldModelToPage,
      getMaxFieldModelSortOrderForPage,
      generateTemporaryFieldModelIdForPage,
    ]
  );

  const activeElementTypeProps = useMemo(
    () => ({
      activeElementType,
      setActiveElementType,
    }),
    [activeElementType, setActiveElementType]
  );

  return (
    <Root $navigationHeight={navigationHeight}>
      <Title>{t('title')}</Title>

      <FormElementsWrapper>
        {cardEntityTypes.length > 0 && (
          <FormElementCardNameBlock
            type="card"
            {...activeElementTypeProps}
            entityTypes={cardEntityTypes}
            handleAddCardName={handleAddCardNameElement}
          />
        )}

        {contactEntityTypes.length > 0 && (
          <FormElementCardNameBlock
            type="contact"
            {...activeElementTypeProps}
            entityTypes={contactEntityTypes}
            handleAddCardName={handleAddCardNameElement}
          />
        )}

        {companyEntityTypes.length > 0 && (
          <FormElementCardNameBlock
            type="company"
            {...activeElementTypeProps}
            entityTypes={companyEntityTypes}
            handleAddCardName={handleAddCardNameElement}
          />
        )}

        <FormFieldElements
          {...activeElementTypeProps}
          entityTypeIds={entityTypeIds}
          entityTypesFieldsModels={fieldsModels.filter(
            fm => fm.type === SiteFormFieldType.ENTITY_FIELD
          )}
          handleAddField={handleAddFieldElement}
        />
      </FormElementsWrapper>
    </Root>
  );
});

HeadlessSiteFormElementsSidebar.displayName = 'HeadlessSiteFormElementsSidebar';
export { HeadlessSiteFormElementsSidebar };
