import {
  AddSmallCircleButton,
  SpanWithEllipsis,
  TruncateMixin,
  type EntityType,
  type Nullable,
} from '@/shared';
import { useCallback, useMemo, type Dispatch, type SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  CardNameIcon,
  type AddSiteFormCardNameHandler,
  type AddSiteFormCardNameHandlerArgs,
} from '../../../../../../../../shared';
import { EntityTypeBlockTemplate } from '../EntityTypeBlockTemplate/EntityTypeBlockTemplate';
import { FormElementCollapsibleBlock } from '../FormElementCollapsibleBlock/FormElementCollapsibleBlock';

const NameItem = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  padding: 4px 8px 6px;

  ${TruncateMixin}
`;

type FormElementCardNameBlockType = 'card' | 'company' | 'contact';

interface Props {
  type: FormElementCardNameBlockType;
  entityTypes: EntityType[];
  activeElementType: Nullable<string>;
  handleAddCardName: AddSiteFormCardNameHandler;
  setActiveElementType: Dispatch<SetStateAction<Nullable<string>>>;
}

const FormElementCardNameBlock = (props: Props) => {
  const { type, entityTypes, activeElementType, setActiveElementType, handleAddCardName } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix:
      'builder.pages.site_form_builder_page.site_form_builder_step2.sidebar.card_name_block',
  });

  const getAddCardNameHandler = useCallback(
    (args: AddSiteFormCardNameHandlerArgs) => () => handleAddCardName(args),
    [handleAddCardName]
  );

  const handleButtonClick = useCallback(
    () => setActiveElementType(prev => (prev === type ? null : type)),
    [type, setActiveElementType]
  );

  const { title, text } = useMemo<{ title: string; text: string }>(() => {
    switch (type) {
      case 'card':
        return { title: t('card_title'), text: t('card_text') };

      case 'company':
        return { title: t('company_title'), text: t('company_text') };

      case 'contact':
        return { title: t('contact_title'), text: t('contact_text') };
    }
  }, [type, t]);

  if (!entityTypes.length) return null;

  return (
    <FormElementCollapsibleBlock
      title={title}
      Icon={<CardNameIcon />}
      opened={activeElementType === type}
      onClick={handleButtonClick}
    >
      {entityTypes.map(et => (
        <EntityTypeBlockTemplate key={et.id} et={et}>
          <NameItem>
            <SpanWithEllipsis text={`${text} ${et.name}`} />

            <AddSmallCircleButton
              bigger
              onClick={getAddCardNameHandler({ entityTypeId: et.id, entityTypeName: et.name })}
            />
          </NameItem>
        </EntityTypeBlockTemplate>
      ))}
    </FormElementCollapsibleBlock>
  );
};

export { FormElementCardNameBlock };
