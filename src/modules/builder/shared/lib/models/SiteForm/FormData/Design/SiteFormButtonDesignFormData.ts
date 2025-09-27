import { InputModel, SelectModel } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { SiteFormBorder } from '../../SiteFormDesign/SiteFormBorder';
import { SiteFormDesignFormButton } from '../../SiteFormDesign/SiteFormDesignFormButton';
import { SiteFormFontSize } from '../../SiteFormDesign/SiteFormFontSize';

export class SiteFormButtonDesignFormData {
  backgroundColor: SelectModel;
  textColor: SelectModel;
  buttonSize: SelectModel;
  buttonText: InputModel;
  border: InputModel;

  private constructor({
    backgroundColor,
    textColor,
    buttonSize,
    buttonText,
    border,
  }: {
    backgroundColor: string;
    textColor: string;
    buttonSize: SiteFormFontSize;
    buttonText: string;
    border: SiteFormBorder;
  }) {
    this.backgroundColor = SelectModel.create(backgroundColor);
    this.textColor = SelectModel.create(textColor);
    this.buttonSize = SelectModel.create(buttonSize);
    this.buttonText = InputModel.create(buttonText);
    this.border = InputModel.create(border);

    makeAutoObservable(this);
  }

  static fromModel(buttonDesign: SiteFormDesignFormButton): SiteFormButtonDesignFormData {
    return new SiteFormButtonDesignFormData({
      backgroundColor: buttonDesign.backgroundColor,
      textColor: buttonDesign.textColor,
      buttonSize: buttonDesign.buttonSize,
      buttonText: buttonDesign.buttonText,
      border: buttonDesign.border,
    });
  }

  static empty(defaultButtonText: string): SiteFormButtonDesignFormData {
    return new SiteFormButtonDesignFormData({
      backgroundColor: '#50b810',
      textColor: '#ffffff',
      buttonSize: SiteFormFontSize.MEDIUM,
      buttonText: defaultButtonText,
      border: SiteFormBorder.ROUNDED,
    });
  }

  toModel = (): SiteFormDesignFormButton => {
    return new SiteFormDesignFormButton({
      backgroundColor: this.backgroundColor.value,
      textColor: this.textColor.value,
      buttonSize: this.buttonSize.value,
      buttonText: this.buttonText.value,
      border: this.border.value as SiteFormBorder,
    });
  };
}
