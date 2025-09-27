import { entityTypeStore } from '@/app';
import { type Field, FieldsStore } from '@/modules/fields';
import { removeSpecialChars } from '@/modules/settings';
import {
  CopyButton,
  DropdownScrollbarMixin,
  type EntityType,
  PrimaryButton,
  SpanWithEllipsis,
} from '@/shared';
import autoAnimate from '@formkit/auto-animate';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { Fragment, useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const EntityTypeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Tooltip = styled.div`
  width: 250px;

  line-height: 1;
  font-size: 10px;
  font-weight: 400;
  color: var(--button-text-graphite-secondary-text);
`;

const EntityTypeLabel = styled.span`
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  color: var(--button-text-graphite-primary-text);

  padding-bottom: 4px;
  padding-left: 4px;
  border-bottom: 1px solid var(--graphite-graphite-120);
`;

const Content = styled.ul`
  max-height: 200px;
  max-width: 100%;
  overflow-y: auto;

  display: flex;
  flex-direction: column;
  gap: 16px;

  border-radius: var(--border-radius-block);
  border: 1px solid var(--graphite-graphite-120);

  ${DropdownScrollbarMixin}

  padding: 8px;
`;

const TemplatesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 240px max-content;
  grid-auto-rows: auto;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

const Template = styled(SpanWithEllipsis)`
  color: var(--primary-statuses-green-520);
`;

interface Props {
  entityTypeId: number;
}

const TemplateList = observer((props: Props) => {
  const { entityTypeId } = props;

  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.modals.common.template_list',
  });

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current && autoAnimate(ref.current);
  }, [ref]);

  const [isOpened, { toggle }] = useDisclosure(false);

  const entityTypes = entityTypeStore.sortedEntityTypes;
  const entityType = entityTypeStore.getById(entityTypeId);

  const fieldsStore = useMemo(
    () => new FieldsStore({ initialFields: entityType.fields }),
    [entityType.fields]
  );

  const entityTypesWithSameName = useMemo<number[]>(() => {
    const entityTypesWithSameName: number[] = [];

    entityTypes.forEach(et => {
      entityTypes.forEach(et2 => {
        if (et.id !== et2.id && et.name === et2.name) entityTypesWithSameName.push(et.id);
      });
    });

    return entityTypesWithSameName;
  }, [entityTypes]);

  const linkedContactsAndCompanies = useMemo<EntityType[]>(
    () =>
      entityType.sortedLinkedEntityTypes
        .map(l => entityTypeStore.getById(l.targetId))
        .filter(et => et.isContactCategory() || et.isCompanyCategory()),
    [entityType.sortedLinkedEntityTypes]
  );

  const getEntityTypeCode = useCallback(
    (et: EntityType) => {
      const parsedName = removeSpecialChars(et.name);

      if (entityTypesWithSameName.includes(et.id)) return `${parsedName}${et.id}`;

      return parsedName;
    },
    [entityTypesWithSameName]
  );

  const getFieldsWithSameName = useCallback((fields: Field[]) => {
    const fieldsWithSameName: number[] = [];

    fields.forEach(f1 => {
      fields.forEach(f2 => {
        if (f1.id !== f2.id && f1.name === f2.name) fieldsWithSameName.push(f1.id);
      });
    });

    return fieldsWithSameName;
  }, []);

  const generateFieldCode = useCallback(
    (et: EntityType, fields: Field[], field: Field): string => {
      const fieldNameWithoutSlashes = removeSpecialChars(field.name);

      const fieldsWithSameName = getFieldsWithSameName(fields);

      if (fieldsWithSameName.includes(field.id))
        return `{{${getEntityTypeCode(et)}.${fieldNameWithoutSlashes}${field.id}}}`;

      return `{{${getEntityTypeCode(et)}.${fieldNameWithoutSlashes}}}`;
    },
    [getEntityTypeCode, getFieldsWithSameName]
  );

  const getOptions = useCallback(
    (entityType: EntityType) => {
      const result = [
        {
          value: `{{${getEntityTypeCode(entityType)}.name}}`,
          label: t('name'),
        },
        {
          value: `{{${getEntityTypeCode(entityType)}.owner}}`,
          label: t('owner'),
        },
      ];

      fieldsStore.setFields(entityType.fields);

      entityType.fieldGroups.forEach(fg => {
        fieldsStore.getFieldsByGroupId(fg.id).forEach(field => {
          result.push({
            value: generateFieldCode(entityType, fieldsStore.getFieldsByGroupId(fg.id), field),
            label: field.name,
          });
        });
      });

      return result;
    },
    [getEntityTypeCode, t, fieldsStore, generateFieldCode]
  );

  return (
    <Root>
      <ButtonWrapper>
        <PrimaryButton variant="outlined" onClick={toggle}>
          {isOpened ? t('hide_templates') : t('show_templates')}
        </PrimaryButton>

        <Tooltip>{t('tooltip')}</Tooltip>
      </ButtonWrapper>

      <div ref={ref}>
        {isOpened && (
          <Content>
            {linkedContactsAndCompanies.map(linkedEt => (
              <EntityTypeWrapper key={linkedEt.id}>
                <EntityTypeLabel>{linkedEt.name}</EntityTypeLabel>

                <TemplatesGrid>
                  {getOptions(linkedEt).map(o => (
                    <Fragment key={o.value}>
                      <SpanWithEllipsis showTitle={false} text={o.label} />
                      <Template showTitle={false} text={o.value} />
                      <CopyButton copyText={o.value} />
                    </Fragment>
                  ))}
                </TemplatesGrid>
              </EntityTypeWrapper>
            ))}

            <EntityTypeWrapper>
              <EntityTypeLabel>{entityType.name}</EntityTypeLabel>

              <TemplatesGrid>
                {getOptions(entityType).map(o => (
                  <Fragment key={o.value}>
                    <SpanWithEllipsis showTitle={false} text={o.label} />
                    <Template showTitle={false} text={o.value} />
                    <CopyButton copyText={o.value} />
                  </Fragment>
                ))}
              </TemplatesGrid>
            </EntityTypeWrapper>
          </Content>
        )}
      </div>
    </Root>
  );
});

TemplateList.displayName = 'TemplateList';
export { TemplateList };
