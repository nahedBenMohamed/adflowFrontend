import { BooleanModel } from '@/shared';
import { SiteFormDesign } from '../SiteFormDesign/SiteFormDesign';
import { SiteFormButtonDesignFormData } from './Design/SiteFormButtonDesignFormData';
import { SiteFormClientButtonDesignFormData } from './Design/SiteFormClientButtonDesignFormData';
import { SiteFormDesignCustomCSSFormData } from './Design/SiteFormDesignCustomCSSFormData';
import { SiteFormFieldsDesignFormData } from './Design/SiteFormFieldsDesignFormData';
import { SiteFormHeaderDesignFormData } from './Design/SiteFormHeaderDesignFormData';
import { SiteFormLayoutDesignFormData } from './Design/SiteFormLayoutDesignFormData';
import { SiteFormModalOverlayDesignFormData } from './Design/SiteFormModalOverlayDesignFormData';

export class SiteFormDesignFormData {
  headerDesignFormData: SiteFormHeaderDesignFormData;
  fieldsDesignFormData: SiteFormFieldsDesignFormData;
  formLayoutFormData: SiteFormLayoutDesignFormData;
  formButtonDesignFormData: SiteFormButtonDesignFormData;
  modalOverlayDesignFormData: SiteFormModalOverlayDesignFormData;
  formCustomCSSFormData: SiteFormDesignCustomCSSFormData;

  poweredByLogoEnabled: BooleanModel;

  clientButtonDesignFormData: SiteFormClientButtonDesignFormData;

  private constructor({
    formLayoutFormData,
    headerDesignFormData,
    fieldsDesignFormData,
    poweredByLogoEnabled,
    formButtonDesignFormData,
    clientButtonDesignFormData,
    modalOverlayDesignFormData,
    formCustomCSSFormData,
  }: {
    poweredByLogoEnabled: boolean;
    formLayoutFormData: SiteFormLayoutDesignFormData;
    headerDesignFormData: SiteFormHeaderDesignFormData;
    fieldsDesignFormData: SiteFormFieldsDesignFormData;
    formButtonDesignFormData: SiteFormButtonDesignFormData;
    clientButtonDesignFormData: SiteFormClientButtonDesignFormData;
    modalOverlayDesignFormData: SiteFormModalOverlayDesignFormData;
    formCustomCSSFormData: SiteFormDesignCustomCSSFormData;
  }) {
    this.headerDesignFormData = headerDesignFormData;
    this.fieldsDesignFormData = fieldsDesignFormData;
    this.formLayoutFormData = formLayoutFormData;
    this.formButtonDesignFormData = formButtonDesignFormData;
    this.modalOverlayDesignFormData = modalOverlayDesignFormData;
    this.formCustomCSSFormData = formCustomCSSFormData;

    this.poweredByLogoEnabled = BooleanModel.create(poweredByLogoEnabled);

    this.clientButtonDesignFormData = clientButtonDesignFormData;
  }

  static empty({
    defaultFormButtonText,
    defaultClientButtonText,
  }: {
    defaultFormButtonText: string;
    defaultClientButtonText: string;
  }): SiteFormDesignFormData {
    return new SiteFormDesignFormData({
      poweredByLogoEnabled: true,
      formLayoutFormData: SiteFormLayoutDesignFormData.empty(),
      headerDesignFormData: SiteFormHeaderDesignFormData.empty(),
      fieldsDesignFormData: SiteFormFieldsDesignFormData.empty(),
      formButtonDesignFormData: SiteFormButtonDesignFormData.empty(defaultFormButtonText),
      clientButtonDesignFormData: SiteFormClientButtonDesignFormData.empty(defaultClientButtonText),
      modalOverlayDesignFormData: SiteFormModalOverlayDesignFormData.empty(),
      formCustomCSSFormData: SiteFormDesignCustomCSSFormData.empty(),
    });
  }

  static fromModel(design: SiteFormDesign): SiteFormDesignFormData {
    return new SiteFormDesignFormData({
      headerDesignFormData: SiteFormHeaderDesignFormData.fromModel(design.header),
      fieldsDesignFormData: SiteFormFieldsDesignFormData.fromModel(design.fields),
      formLayoutFormData: SiteFormLayoutDesignFormData.fromModel(design.formLayout),
      formButtonDesignFormData: SiteFormButtonDesignFormData.fromModel(design.formButtonDesign),
      poweredByLogoEnabled: design.poweredByLogoEnabled,
      clientButtonDesignFormData: SiteFormClientButtonDesignFormData.fromModel(
        design.clientButtonDesign
      ),
      modalOverlayDesignFormData: SiteFormModalOverlayDesignFormData.fromModel(
        design.modalOverlayDesign
      ),
      formCustomCSSFormData: SiteFormDesignCustomCSSFormData.fromModel(design.formCustomCSS),
    });
  }

  toModel = (): SiteFormDesign => {
    return new SiteFormDesign({
      header: this.headerDesignFormData.toModel(),
      fields: this.fieldsDesignFormData.toModel(),
      formLayout: this.formLayoutFormData.toModel(),
      poweredByLogoEnabled: this.poweredByLogoEnabled.value,
      formButtonDesign: this.formButtonDesignFormData.toModel(),
      clientButtonDesign: this.clientButtonDesignFormData.toModel(),
      modalOverlayDesign: this.modalOverlayDesignFormData.toModel(),
      formCustomCSS: this.formCustomCSSFormData.toModel(),
    });
  };
}
