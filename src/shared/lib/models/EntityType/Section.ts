import type { IconName } from '../Icon/IconName';
import type { SectionView } from '../Section/SectionView';

export interface Section {
  name: string;
  view: SectionView.BOARD | SectionView.LIST;
  icon: IconName;
}
