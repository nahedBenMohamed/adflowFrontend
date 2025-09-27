import type { Option } from '@/shared';
import type { TFunction } from 'i18next';
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BorderRoundedIcon,
  BorderSquareIcon,
  OrientationHorizontalIcon,
  OrientationVerticalIcon,
} from '../../assets';
import { SiteFormBorder, SiteFormOrientation, SiteFormPosition, SiteFormView } from '../models';

interface LayoutRadioOptions {
  viewOptions: Option<SiteFormView>[];
  positionOptions: Option<SiteFormPosition>[];
  borderOptions: Option<SiteFormBorder>[];
  orientationOptions: Option<SiteFormOrientation>[];
}

export const generateFormLayoutRadioOptions = (t: TFunction): LayoutRadioOptions => {
  return {
    viewOptions: [
      { value: SiteFormView.BUILT_IN, label: t('view_built_in') },
      { value: SiteFormView.MODAL, label: t('view_modal') },
    ],
    positionOptions: [
      {
        label: t('position_left'),
        value: SiteFormPosition.LEFT,
        extra: { icon: <AlignLeftIcon /> },
      },
      {
        label: t('position_center'),
        value: SiteFormPosition.CENTER,
        extra: { icon: <AlignCenterIcon /> },
      },
      {
        label: t('position_right'),
        value: SiteFormPosition.RIGHT,
        extra: { icon: <AlignRightIcon /> },
      },
    ],
    borderOptions: [
      {
        label: t('border_rounded'),
        value: SiteFormBorder.ROUNDED,
        extra: { icon: <BorderRoundedIcon /> },
      },
      {
        label: t('border_none'),
        value: SiteFormBorder.NONE,
        extra: { icon: <BorderSquareIcon /> },
      },
    ],
    orientationOptions: [
      {
        label: t('orientation_horizontal'),
        value: SiteFormOrientation.HORIZONTAL,
        extra: { icon: <OrientationHorizontalIcon /> },
      },
      {
        label: t('orientation_vertical'),
        value: SiteFormOrientation.VERTICAL,
        extra: { icon: <OrientationVerticalIcon /> },
      },
    ],
  };
};
