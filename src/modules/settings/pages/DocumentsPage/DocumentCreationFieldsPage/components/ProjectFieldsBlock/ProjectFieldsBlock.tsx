import { FieldCode, type Field, type FieldsStore } from '@/modules/fields';
import { useTranslation } from 'react-i18next';
import { FieldBlock } from '../FieldBlock/FieldBlock';

interface Props {
  fieldsStore: FieldsStore;
  isRussianLocale: boolean;
  generateFieldCode: ({ field }: { field: Field }) => string;
}

const ProjectFieldsBlock = (props: Props) => {
  const { fieldsStore, isRussianLocale, generateFieldCode } = props;

  const { t } = useTranslation('module.fields', {
    keyPrefix: 'fields.project_fields_block',
  });

  const valueField = fieldsStore.findByCode(FieldCode.VALUE);
  const startDateField = fieldsStore.findByCode(FieldCode.START_DATE);
  const endDateField = fieldsStore.findByCode(FieldCode.END_DATE);
  const participantsField = fieldsStore.findByCode(FieldCode.PARTICIPANTS);
  const descriptionField = fieldsStore.findByCode(FieldCode.DESCRIPTION);

  return (
    <>
      {valueField && (
        <FieldBlock
          name={t('value')}
          field={valueField}
          isRussianLocale={isRussianLocale}
          generateFieldCode={generateFieldCode}
        />
      )}

      {startDateField && (
        <FieldBlock
          name={t('start_date')}
          field={startDateField}
          isRussianLocale={isRussianLocale}
          generateFieldCode={generateFieldCode}
        />
      )}

      {endDateField && (
        <FieldBlock
          name={t('end_date')}
          field={endDateField}
          isRussianLocale={isRussianLocale}
          generateFieldCode={generateFieldCode}
        />
      )}

      {participantsField && (
        <FieldBlock
          name={t('participants')}
          field={participantsField}
          isRussianLocale={isRussianLocale}
          generateFieldCode={generateFieldCode}
        />
      )}

      {descriptionField && (
        <FieldBlock
          name={t('description')}
          field={descriptionField}
          isRussianLocale={isRussianLocale}
          generateFieldCode={generateFieldCode}
        />
      )}
    </>
  );
};

export { ProjectFieldsBlock };
