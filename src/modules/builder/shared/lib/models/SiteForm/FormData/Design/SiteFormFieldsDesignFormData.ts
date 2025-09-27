import { SelectModel } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { SiteFormDesignFields } from '../../SiteFormDesign/SiteFormDesignFields';
import { SiteFormFontSize } from '../../SiteFormDesign/SiteFormFontSize';

export class SiteFormFieldsDesignFormData {
  backgroundColor: SelectModel;

  // label –> above fields
  labelColor: SelectModel;
  labelFontSize: SelectModel;

  // text -> inside fields
  fieldColor: SelectModel;
  fieldFontSize: SelectModel;

  private constructor({
    backgroundColor,
    labelColor,
    labelFontSize,
    fieldColor,
    fieldFontSize,
  }: {
    backgroundColor: string;
    labelColor: string;
    labelFontSize: SiteFormFontSize;
    fieldColor: string;
    fieldFontSize: SiteFormFontSize;
  }) {
    this.backgroundColor = SelectModel.create(backgroundColor);
    this.labelColor = SelectModel.create(labelColor);
    this.labelFontSize = SelectModel.create(labelFontSize);
    this.fieldColor = SelectModel.create(fieldColor);
    this.fieldFontSize = SelectModel.create(fieldFontSize);

    makeAutoObservable(this);
  }

  static fromModel(fieldsDesign: SiteFormDesignFields): SiteFormFieldsDesignFormData {
    return new SiteFormFieldsDesignFormData({
      backgroundColor: fieldsDesign.backgroundColor,
      labelColor: fieldsDesign.labelColor,
      labelFontSize: fieldsDesign.labelFontSize,
      fieldColor: fieldsDesign.fieldColor,
      fieldFontSize: fieldsDesign.fieldFontSize,
    });
  }

  static empty(): SiteFormFieldsDesignFormData {
    return new SiteFormFieldsDesignFormData({
      backgroundColor: '#ffffff',
      labelColor: '#454f5e',
      labelFontSize: SiteFormFontSize.MEDIUM,
      fieldColor: '#454f5e',
      fieldFontSize: SiteFormFontSize.MEDIUM,
    });
  }

  toModel = (): SiteFormDesignFields => {
    return new SiteFormDesignFields({
      backgroundColor: this.backgroundColor.value,
      labelColor: this.labelColor.value,
      labelFontSize: this.labelFontSize.value,
      fieldColor: this.fieldColor.value,
      fieldFontSize: this.fieldFontSize.value,
    });
  };
}
