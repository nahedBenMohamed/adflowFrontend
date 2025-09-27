import { useTranslation } from 'react-i18next';
import { SystemFieldType, type RussianCase } from '../../../../../shared';
import {
  FieldsBlock,
  Root,
  SectionNameBlock,
  SystemFieldsBlock,
} from '../EntityTypeSection/EntityTypeSection';
import { SystemFieldBlock } from '../FieldBlock/SystemFieldBlock';

interface Props {
  generateSystemFieldCode: ({
    systemFieldType,
    caseValue,
  }: {
    systemFieldType: SystemFieldType;
    caseValue?: RussianCase;
  }) => string;
}

const SystemSection = (props: Props) => {
  const { generateSystemFieldCode } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.templates.document_creation_fields_page.ui.system_section',
  });

  return (
    <Root>
      <SectionNameBlock>{t('name')}</SectionNameBlock>

      <FieldsBlock>
        <SystemFieldsBlock>
          <SystemFieldBlock
            name={t('current_date')}
            systemFieldType={SystemFieldType.CURRENT_DATE}
            isRussianLocale={false}
            generateSystemFieldCode={generateSystemFieldCode}
          />

          <SystemFieldBlock
            name={t('document_number')}
            systemFieldType={SystemFieldType.DOCUMENT_NUMBER}
            isRussianLocale={false}
            generateSystemFieldCode={generateSystemFieldCode}
          />
        </SystemFieldsBlock>
      </FieldsBlock>
    </Root>
  );
};

export { SystemSection };
