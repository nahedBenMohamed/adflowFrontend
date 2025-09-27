import type { SliderProps } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import {
  ColorRowSelect,
  SwitchBlock,
  type SiteFormModalOverlayDesignFormData,
} from '../../../../../../../../shared';
import { CustomizationBlockTemplate } from '../CustomizationBlockTemplate/CustomizationBlockTemplate';
import { CustomizationSlider } from '../CustomizationSlider/CustomizationSlider';

interface Props {
  modalOverlayDesignFormData: SiteFormModalOverlayDesignFormData;
}

const marks: SliderProps['marks'] = [
  { value: 0, label: '0%' },
  { value: 0.25, label: '25%' },
  { value: 0.5, label: '50%' },
  { value: 0.75, label: '75%' },
  { value: 1, label: '100%' },
];

const ModalOverlayCustomizationBlock = (props: Props) => {
  const {
    modalOverlayDesignFormData: { backgroundColor, enabled, opacity },
  } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix:
      'builder.pages.site_form_builder_page.site_form_builder_step4.sidebar.modal_overlay_customization_block',
  });

  return (
    <CustomizationBlockTemplate title={t('modal_overlay')}>
      <SwitchBlock model={enabled} text={t('overlay_display')} />

      <ColorRowSelect
        model={backgroundColor}
        label={t('background_color')}
        defaultColorOption="dark-background"
        quickColorsOptions="dark-background"
      />

      <CustomizationSlider
        min={0}
        max={1}
        step={0.01}
        marks={marks}
        model={opacity}
        blockLabel={t('opacity')}
        label={v => `${Math.round(v * 100)}%`}
      />
    </CustomizationBlockTemplate>
  );
};

export { ModalOverlayCustomizationBlock };
