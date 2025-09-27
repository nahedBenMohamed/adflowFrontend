import { WholePageLoaderWithLogo, type ToggleControl } from '@/shared';
import { observer } from 'mobx-react-lite';
import { ProductsSectionType } from '../../shared';
import { RentalShipmentsComponent, ShipmentsComponent } from './components';

interface Props {
  sectionId: number;
  currentPage: number;
  sectionType: ProductsSectionType;
  isProductsSectionLoading: boolean;
  tableSettingsControl: ToggleControl;
  handleChangePage: (page: number) => void;
}

const Shipments = observer((props: Props) => {
  const {
    sectionId,
    currentPage,
    sectionType,
    isProductsSectionLoading,
    handleChangePage,
    tableSettingsControl,
  } = props;

  if (isProductsSectionLoading) return <WholePageLoaderWithLogo ensureSubheaderWithOffset />;

  return sectionType === ProductsSectionType.SALE ? (
    <ShipmentsComponent
      sectionId={sectionId}
      currentPage={currentPage}
      tableSettingsControl={tableSettingsControl}
      handleChangePage={handleChangePage}
    />
  ) : (
    <RentalShipmentsComponent sectionId={sectionId} tableSettingsControl={tableSettingsControl} />
  );
});

Shipments.displayName = 'Shipments';
export { Shipments };
