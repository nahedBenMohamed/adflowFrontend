import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ColorRowSelect,
  generateFormLayoutRadioOptions,
  SiteFormView,
  type SiteFormLayoutDesignFormData,
} from '../../../../../../../../shared';
import { CustomizationBlockTemplate } from '../CustomizationBlockTemplate/CustomizationBlockTemplate';
import { RadioGroupControl } from '../RadioGroupControl/RadioGroupControl';
import { SizeCustomizationElementTemplate } from '../SizeCustomizationElementTemplate/SizeCustomizationElementTemplate';

interface Props {
  formLayoutFormData: SiteFormLayoutDesignFormData;
}

const FormLayoutCustomizationBlock = observer((props: Props) => {
  const {
    formLayoutFormData: {
      view,
      border,
      maxWidth,
      maxHeight,
      backgroundColor,
      maxWidthEnabled,
      maxHeightEnabled,
    },
  } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix:
      'builder.pages.site_form_builder_page.site_form_builder_step4.sidebar.form_layout_customization_block',
  });

  const { viewOptions, borderOptions } = useMemo(() => generateFormLayoutRadioOptions(t), [t]);

  return (
    <CustomizationBlockTemplate title={t('title')}>
      <RadioGroupControl label={t('view_title')} model={view} options={viewOptions} />

      {/* COMING SOON... */}
      {/* <RadioGroupControl label={t('position_title')} model={position} options={positionOptions} /> */}

      <RadioGroupControl label={t('border_radius_title')} model={border} options={borderOptions} />

      {/* COMING SOON... */}
      {/* <RadioGroupControl
        model={orientation}
        options={orientationOptions}
        label={t('orientation_title')}
      /> */}

      <SizeCustomizationElementTemplate
        model={maxWidth}
        title={t('max_width')}
        enabled={maxWidthEnabled}
      />

      {view.value === SiteFormView.MODAL && (
        <SizeCustomizationElementTemplate
          model={maxHeight}
          title={t('max_height')}
          enabled={maxHeightEnabled}
        />
      )}

      <ColorRowSelect
        model={backgroundColor}
        label={t('background_color')}
        quickColorsOptions="background"
        defaultColorOption="background"
      />
    </CustomizationBlockTemplate>
  );
});

FormLayoutCustomizationBlock.displayName = 'FormLayoutCustomizationBlock';
export { FormLayoutCustomizationBlock };
