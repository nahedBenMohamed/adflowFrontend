import { BooleanModel, InputModel, SelectModel } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { SiteFormBorder } from '../../SiteFormDesign/SiteFormBorder';
import { SiteFormDesignClientButton } from '../../SiteFormDesign/SiteFormDesignClientButton';
import { SiteFormFontSize } from '../../SiteFormDesign/SiteFormFontSize';

export class SiteFormClientButtonDesignFormData {
  enabled: BooleanModel;

  backgroundColor: SelectModel;
  textColor: SelectModel;
  buttonSize: SelectModel;
  buttonText: InputModel;

  border: InputModel;

  private constructor({
    enabled,
    backgroundColor,
    textColor,
    buttonSize,
    buttonText,
    border,
  }: {
    enabled: boolean;
    backgroundColor: string;
    textColor: string;
    buttonSize: SiteFormFontSize;
    buttonText: string;
    border: SiteFormBorder;
  }) {
    this.enabled = BooleanModel.create(enabled);
    this.backgroundColor = SelectModel.create(backgroundColor);
    this.textColor = SelectModel.create(textColor);
    this.buttonSize = SelectModel.create(buttonSize);
    this.buttonText = InputModel.create(buttonText);
    this.border = InputModel.create(border);

    makeAutoObservable(this);
  }

  static fromModel(
    clientButtonDesign: SiteFormDesignClientButton
  ): SiteFormClientButtonDesignFormData {
    return new SiteFormClientButtonDesignFormData({
      enabled: clientButtonDesign.enabled,
      backgroundColor: clientButtonDesign.backgroundColor,
      textColor: clientButtonDesign.textColor,
      buttonSize: clientButtonDesign.buttonSize,
      buttonText: clientButtonDesign.buttonText,
      border: clientButtonDesign.border,
    });
  }

  static empty(defaultButtonText: string): SiteFormClientButtonDesignFormData {
    return new SiteFormClientButtonDesignFormData({
      enabled: false,
      backgroundColor: '#50b810',
      textColor: '#ffffff',
      buttonSize: SiteFormFontSize.MEDIUM,
      buttonText: defaultButtonText,
      border: SiteFormBorder.ROUNDED,
    });
  }

  toModel = (): SiteFormDesignClientButton => {
    return new SiteFormDesignClientButton({
      enabled: this.enabled.value,
      backgroundColor: this.backgroundColor.value,
      textColor: this.textColor.value,
      buttonSize: this.buttonSize.value,
      buttonText: this.buttonText.value,
      border: this.border.value as SiteFormBorder,
    });
  };
}
