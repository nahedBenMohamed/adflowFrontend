import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { ColorRowSelect, type SiteFormHeaderDesignFormData } from '../../../../../../../../shared';
import { CustomizationBlockTemplate } from '../CustomizationBlockTemplate/CustomizationBlockTemplate';
import { OrientationRowSelect } from '../OrientationRowSelect/OrientationRowSelect';

interface Props {
  headerDesignFormData: SiteFormHeaderDesignFormData;
}

const HeaderCustomizationBlock = observer((props: Props) => {
  const {
    headerDesignFormData: { textColor, orientation },
  } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix:
      'builder.pages.site_form_builder_page.site_form_builder_step4.sidebar.header_customization_block',
  });

  return (
    <CustomizationBlockTemplate title={t('title')}>
      <ColorRowSelect
        model={textColor}
        label={t('text_color')}
        defaultColorOption="text"
        quickColorsOptions="text"
      />

      <OrientationRowSelect model={orientation} label={t('text_align_title')} />
    </CustomizationBlockTemplate>
  );
});

HeaderCustomizationBlock.displayName = 'HeaderCustomizationBlock';
export { HeaderCustomizationBlock };
