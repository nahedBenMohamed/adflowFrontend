import { FieldType, type Nullable } from '@/shared';
import { useCallback, useMemo, type Dispatch, type SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DateIcon,
  FileIcon,
  LinkIcon,
  LongTextIcon,
  MailIcon,
  MultiselectIcon,
  NumberIcon,
  PhoneIcon,
  SelectIcon,
  ShortTextIcon,
  SiteFormFieldTextMeta,
  SiteFormFieldTextView,
  SwitchIcon,
  type AddSiteFormFieldHandler,
  type SiteFormElementsFieldModel,
} from '../../../../../../../../shared';
import { FormElementFieldBlock } from '../FormElementFieldBlock/FormElementFieldBlock';

interface Props {
  entityTypeIds: number[];
  activeElementType: Nullable<string>;
  entityTypesFieldsModels: SiteFormElementsFieldModel[];
  hideAnalyticsFields?: boolean;
  handleAddField: AddSiteFormFieldHandler;
  setActiveElementType: Dispatch<SetStateAction<Nullable<string>>>;
}

enum SyntheticFieldType {
  LINK = 'link',
  PHONE = 'phone',
  EMAIL = 'email',
  NUMBER = 'number',
  VALUE = 'value',
  DATE = 'date',
  SELECT = 'select',
  LONG_TEXT = 'long_text',
  SHORT_TEXT = 'short_text',
  MULTISELECT = 'multiselect',
  COLORED_SELECT = 'colored_select',
  COLORED_MULTISELECT = 'colored_multiselect',
  FILE = 'file',
  SWITCH = 'switch',
}

const FormFieldElements = (props: Props) => {
  const {
    entityTypeIds,
    activeElementType,
    entityTypesFieldsModels,
    hideAnalyticsFields,
    handleAddField,
    setActiveElementType,
  } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix:
      'builder.pages.site_form_builder_page.site_form_builder_step2.sidebar.field_elements',
  });

  const shortTextMeta = useMemo<SiteFormFieldTextMeta>(
    () => new SiteFormFieldTextMeta({ view: SiteFormFieldTextView.INPUT }),
    []
  );
  const longTextMeta = useMemo<SiteFormFieldTextMeta>(
    () => new SiteFormFieldTextMeta({ view: SiteFormFieldTextView.TEXTAREA }),
    []
  );

  const getButtonClickHandler = useCallback(
    (type: SyntheticFieldType) => () => setActiveElementType(prev => (prev === type ? null : type)),
    [setActiveElementType]
  );

  const getCommonProps = useCallback(
    (type: SyntheticFieldType) => ({
      type,
      entityTypeIds,
      entityTypesFieldsModels,
      opened: activeElementType === type,
      meta:
        type === SyntheticFieldType.SHORT_TEXT
          ? shortTextMeta
          : type === SyntheticFieldType.LONG_TEXT
            ? longTextMeta
            : undefined,
      hideAnalyticsFields,
      handleAddField,
      onButtonClick: getButtonClickHandler(type),
    }),
    [
      longTextMeta,
      entityTypeIds,
      shortTextMeta,
      activeElementType,
      entityTypesFieldsModels,
      hideAnalyticsFields,
      handleAddField,
      getButtonClickHandler,
    ]
  );

  return (
    <>
      <FormElementFieldBlock
        title={t('email')}
        Icon={<MailIcon />}
        fieldType={FieldType.EMAIL}
        {...getCommonProps(SyntheticFieldType.EMAIL)}
      />

      <FormElementFieldBlock
        title={t('phone')}
        Icon={<PhoneIcon />}
        fieldType={FieldType.PHONE}
        {...getCommonProps(SyntheticFieldType.PHONE)}
      />

      <FormElementFieldBlock
        title={t('short_text')}
        Icon={<ShortTextIcon />}
        fieldType={FieldType.TEXT}
        {...getCommonProps(SyntheticFieldType.SHORT_TEXT)}
      />

      <FormElementFieldBlock
        title={t('long_text')}
        Icon={<LongTextIcon />}
        fieldType={FieldType.TEXT}
        {...getCommonProps(SyntheticFieldType.LONG_TEXT)}
      />

      <FormElementFieldBlock
        title={t('number')}
        Icon={<NumberIcon />}
        fieldType={FieldType.NUMBER}
        {...getCommonProps(SyntheticFieldType.NUMBER)}
      />

      <FormElementFieldBlock
        title={t('value')}
        Icon={<NumberIcon />}
        fieldType={FieldType.VALUE}
        {...getCommonProps(SyntheticFieldType.VALUE)}
      />

      <FormElementFieldBlock
        title={t('date')}
        Icon={<DateIcon />}
        fieldType={FieldType.DATE}
        {...getCommonProps(SyntheticFieldType.DATE)}
      />

      <FormElementFieldBlock
        Icon={<SelectIcon />}
        title={t('select')}
        fieldType={FieldType.SELECT}
        {...getCommonProps(SyntheticFieldType.SELECT)}
      />

      <FormElementFieldBlock
        Icon={<MultiselectIcon />}
        title={t('multiselect')}
        fieldType={FieldType.MULTISELECT}
        {...getCommonProps(SyntheticFieldType.MULTISELECT)}
      />

      <FormElementFieldBlock
        Icon={<SelectIcon />}
        title={t('colored_select')}
        fieldType={FieldType.COLORED_SELECT}
        {...getCommonProps(SyntheticFieldType.COLORED_SELECT)}
      />

      <FormElementFieldBlock
        Icon={<MultiselectIcon />}
        title={t('colored_multiselect')}
        fieldType={FieldType.COLORED_MULTISELECT}
        {...getCommonProps(SyntheticFieldType.COLORED_MULTISELECT)}
      />

      <FormElementFieldBlock
        title={t('link')}
        Icon={<LinkIcon />}
        fieldType={FieldType.LINK}
        {...getCommonProps(SyntheticFieldType.LINK)}
      />

      <FormElementFieldBlock
        title={t('file')}
        Icon={<FileIcon />}
        fieldType={FieldType.FILE}
        {...getCommonProps(SyntheticFieldType.FILE)}
      />

      <FormElementFieldBlock
        title={t('switch')}
        Icon={<SwitchIcon />}
        fieldType={FieldType.SWITCH}
        {...getCommonProps(SyntheticFieldType.SWITCH)}
      />
    </>
  );
};

export { FormFieldElements };
