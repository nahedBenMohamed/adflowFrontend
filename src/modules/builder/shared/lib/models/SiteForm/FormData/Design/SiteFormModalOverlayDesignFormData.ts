import { BooleanModel, NumberModel, SelectModel } from '@/shared';
import { SiteFormDesignModalOverlay } from '../../SiteFormDesign/SiteFormDesignModalOverlay';

export class SiteFormModalOverlayDesignFormData {
  enabled: BooleanModel;
  backgroundColor: SelectModel;
  opacity: NumberModel;

  constructor({
    enabled,
    backgroundColor,
    opacity,
  }: {
    enabled: boolean;
    backgroundColor: string;
    opacity: number;
  }) {
    this.enabled = BooleanModel.create(enabled);
    this.backgroundColor = SelectModel.create(backgroundColor);
    this.opacity = NumberModel.create(opacity);
  }

  static empty(): SiteFormModalOverlayDesignFormData {
    return new SiteFormModalOverlayDesignFormData({
      enabled: false,
      backgroundColor: '#000000',
      opacity: 0.4,
    });
  }

  static fromModel(model: SiteFormDesignModalOverlay): SiteFormModalOverlayDesignFormData {
    return new SiteFormModalOverlayDesignFormData({
      enabled: model.enabled,
      backgroundColor: model.backgroundColor,
      opacity: model.opacity,
    });
  }

  toModel = (): SiteFormDesignModalOverlay => {
    return new SiteFormDesignModalOverlay({
      enabled: this.enabled.value,
      backgroundColor: this.backgroundColor.value,
      opacity: this.opacity.value ?? 0,
    });
  };
}
