import { BooleanModel, InputModel, SelectModel, type Nullable } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { SiteFormBorder } from '../../SiteFormDesign/SiteFormBorder';
import { SiteFormDesignFormLayout } from '../../SiteFormDesign/SiteFormDesignFormLayout';
import { SiteFormOrientation } from '../../SiteFormDesign/SiteFormOrientation';
import { SiteFormPosition } from '../../SiteFormDesign/SiteFormPosition';
import { SiteFormView } from '../../SiteFormDesign/SiteFormView';

export class SiteFormLayoutDesignFormData {
  view: InputModel;
  position: InputModel;
  border: InputModel;
  orientation: InputModel;

  maxWidthEnabled: BooleanModel;
  maxWidth: InputModel;

  maxHeightEnabled: BooleanModel;
  maxHeight: InputModel;

  backgroundColor: SelectModel;

  private constructor({
    view,
    position,
    border,
    orientation,
    maxWidthEnabled,
    maxWidth,
    maxHeightEnabled,
    maxHeight,
    backgroundColor,
  }: {
    view: SiteFormView;
    position: SiteFormPosition;
    border: SiteFormBorder;
    orientation: SiteFormOrientation;
    maxWidthEnabled: boolean;
    maxWidth: Nullable<string>;
    maxHeightEnabled: boolean;
    maxHeight: Nullable<string>;
    backgroundColor: string;
  }) {
    this.view = InputModel.create(view);
    this.position = InputModel.create(position);
    this.border = InputModel.create(border);
    this.orientation = InputModel.create(orientation);

    this.maxWidthEnabled = BooleanModel.create(maxWidthEnabled);
    this.maxWidth = InputModel.create(maxWidth);

    this.maxHeightEnabled = BooleanModel.create(maxHeightEnabled);
    this.maxHeight = InputModel.create(maxHeight);

    this.backgroundColor = SelectModel.create(backgroundColor);

    makeAutoObservable(this);
  }

  static fromModel(formLayout: SiteFormDesignFormLayout): SiteFormLayoutDesignFormData {
    return new SiteFormLayoutDesignFormData({
      view: formLayout.view,
      position: formLayout.position,
      border: formLayout.border,
      orientation: formLayout.orientation,
      maxWidthEnabled: formLayout.maxWidthEnabled,
      maxWidth: formLayout.maxWidth,
      maxHeightEnabled: formLayout.maxHeightEnabled,
      maxHeight: formLayout.maxHeight,
      backgroundColor: formLayout.backgroundColor,
    });
  }

  static empty(): SiteFormLayoutDesignFormData {
    return new SiteFormLayoutDesignFormData({
      view: SiteFormView.BUILT_IN,
      border: SiteFormBorder.ROUNDED,
      position: SiteFormPosition.CENTER,
      orientation: SiteFormOrientation.HORIZONTAL,
      maxWidthEnabled: false,
      maxWidth: null,
      maxHeightEnabled: false,
      maxHeight: null,
      backgroundColor: '#ffffff',
    });
  }

  toModel = (): SiteFormDesignFormLayout => {
    return new SiteFormDesignFormLayout({
      view: this.view.value as SiteFormView,
      position: this.position.value as SiteFormPosition,
      border: this.border.value as SiteFormBorder,
      orientation: this.orientation.value as SiteFormOrientation,
      maxWidthEnabled: this.maxWidthEnabled.value,
      maxWidth: this.maxWidth.trimmedValue,
      maxHeightEnabled: this.maxHeightEnabled.value,
      maxHeight: this.maxHeight.trimmedValue,
      backgroundColor: this.backgroundColor.value,
    });
  };
}
