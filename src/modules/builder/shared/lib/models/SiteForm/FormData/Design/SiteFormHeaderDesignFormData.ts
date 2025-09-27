import { SelectModel } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { SiteFormDesignHeader } from '../../SiteFormDesign/SiteFormDesignHeader';
import { SiteFormFontSize } from '../../SiteFormDesign/SiteFormFontSize';
import { SiteFormTextOrientation } from '../../SiteFormDesign/SiteFormTextOrientation';

export class SiteFormHeaderDesignFormData {
  textColor: SelectModel;
  fontSize: SelectModel;
  orientation: SelectModel;

  private constructor({
    textColor,
    fontSize,
    orientation,
  }: {
    textColor: string;
    fontSize: SiteFormFontSize;
    orientation: SiteFormTextOrientation;
  }) {
    this.textColor = SelectModel.create(textColor);
    this.fontSize = SelectModel.create(fontSize);
    this.orientation = SelectModel.create(orientation);

    makeAutoObservable(this);
  }

  static fromModel(headerDesign: SiteFormDesignHeader): SiteFormHeaderDesignFormData {
    return new SiteFormHeaderDesignFormData({
      textColor: headerDesign.textColor,
      fontSize: headerDesign.fontSize,
      orientation: headerDesign.orientation,
    });
  }

  static empty(): SiteFormHeaderDesignFormData {
    return new SiteFormHeaderDesignFormData({
      textColor: '#454f5e',
      fontSize: SiteFormFontSize.MEDIUM,
      orientation: SiteFormTextOrientation.CENTER,
    });
  }

  toModel = (): SiteFormDesignHeader => {
    return new SiteFormDesignHeader({
      textColor: this.textColor.value,
      fontSize: this.fontSize.value,
      orientation: this.orientation.value,
    });
  };
}
