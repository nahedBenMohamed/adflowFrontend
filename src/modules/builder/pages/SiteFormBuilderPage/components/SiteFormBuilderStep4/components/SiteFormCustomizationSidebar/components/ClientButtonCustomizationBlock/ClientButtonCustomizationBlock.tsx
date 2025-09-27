import { NumberModel, type Option } from '@/shared';
import type { SliderProps } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BorderRoundedIcon,
  BorderSquareIcon,
  ColorRowSelect,
  SiteFormBorder,
  SiteFormFontSize,
  type SiteFormClientButtonDesignFormData,
} from '../../../../../../../../shared';
import { CustomizationBlockTemplate } from '../CustomizationBlockTemplate/CustomizationBlockTemplate';
import { CustomizationSlider } from '../CustomizationSlider/CustomizationSlider';
import { RadioGroupControl } from '../RadioGroupControl/RadioGroupControl';
import { SiteFormCustomizationTextInput } from '../SiteFormCustomizationTextInput/SiteFormCustomizationTextInput';

interface Props {
  buttonDesignFormData: SiteFormClientButtonDesignFormData;
}

const ClientButtonCustomizationBlock = observer((props: Props) => {
  const { buttonDesignFormData } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix:
      'builder.pages.site_form_builder_page.site_form_builder_step4.sidebar.client_button_customization_block',
  });

  const marks = useMemo<SliderProps['marks']>(
    () => [
      { value: 0, label: t('small') },
      { value: 0.5, label: t('medium') },
      { value: 1, label: t('large') },
    ],
    [t]
  );

  const borderOptions = useMemo<Option<SiteFormBorder, { Icon: ReactNode }>[]>(
    () => [
      {
        label: t('border_rounded'),
        value: SiteFormBorder.ROUNDED,
        extra: { Icon: <BorderRoundedIcon /> },
      },
      {
        label: t('border_squared'),
        value: SiteFormBorder.NONE,
        extra: { Icon: <BorderSquareIcon /> },
      },
    ],
    [t]
  );

  const sizeModel = useMemo<NumberModel>(() => {
    let size = 0;

    switch (buttonDesignFormData.buttonSize.value) {
      case SiteFormFontSize.SMALL: {
        size = 0;

        break;
      }

      case SiteFormFontSize.MEDIUM: {
        size = 0.5;

        break;
      }

      case SiteFormFontSize.LARGE: {
        size = 1;

        break;
      }
    }

    return NumberModel.create(size);
  }, [buttonDesignFormData.buttonSize.value]);

  const handleChangeButtonSize = useCallback(
    (val: number) => {
      if (val <= 0.1) {
        buttonDesignFormData.buttonSize.setValue(SiteFormFontSize.SMALL);
      } else if (val >= 0.9) {
        buttonDesignFormData.buttonSize.setValue(SiteFormFontSize.LARGE);
      } else {
        buttonDesignFormData.buttonSize.setValue(SiteFormFontSize.MEDIUM);
      }
    },
    [buttonDesignFormData.buttonSize]
  );

  return (
    <CustomizationBlockTemplate title={t('title')} hint={t('hint')}>
      <ColorRowSelect
        label={t('background_color')}
        defaultColorOption="fancy-background"
        quickColorsOptions="fancy-background"
        model={buttonDesignFormData.backgroundColor}
      />

      <ColorRowSelect
        label={t('text_color')}
        defaultColorOption="#ffffff"
        quickColorsOptions="background"
        model={buttonDesignFormData.textColor}
      />

      <CustomizationSlider
        min={0}
        max={1}
        step={0.5}
        label={null}
        marks={marks}
        model={sizeModel}
        blockLabel={t('size')}
        onChangeEnd={handleChangeButtonSize}
      />

      <SiteFormCustomizationTextInput
        title={t('text_input')}
        model={buttonDesignFormData.buttonText}
        placeholder={t('placeholders.text_input')}
      />

      <RadioGroupControl
        label={t('border')}
        options={borderOptions}
        model={buttonDesignFormData.border}
      />
    </CustomizationBlockTemplate>
  );
});

ClientButtonCustomizationBlock.displayName = 'ClientButtonCustomizationBlock';
export { ClientButtonCustomizationBlock };
