import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { ColorRowSelect, type SiteFormFieldsDesignFormData } from '../../../../../../../../shared';
import { CustomizationBlockTemplate } from '../CustomizationBlockTemplate/CustomizationBlockTemplate';

interface Props {
  fieldsDesignFormData: SiteFormFieldsDesignFormData;
}

const FieldsCustomizationBlock = observer((props: Props) => {
  const {
    fieldsDesignFormData: { labelColor, backgroundColor, fieldColor },
  } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix:
      'builder.pages.site_form_builder_page.site_form_builder_step4.sidebar.fields_customization_block',
  });

  return (
    <CustomizationBlockTemplate title={t('title')}>
      <ColorRowSelect
        label={t('background_color')}
        model={backgroundColor}
        defaultColorOption="background"
        quickColorsOptions="background"
      />

      <ColorRowSelect
        model={labelColor}
        label={t('title_color')}
        quickColorsOptions="text"
        defaultColorOption="text"
      />

      <ColorRowSelect
        model={fieldColor}
        defaultColorOption="text"
        label={t('text_color')}
        quickColorsOptions="text"
      />
    </CustomizationBlockTemplate>
  );
});

FieldsCustomizationBlock.displayName = 'FieldsCustomizationBlock';
export { FieldsCustomizationBlock };
