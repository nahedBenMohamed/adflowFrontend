import type { FileLink } from '@/shared';
import { ProductImageItem } from '../ProductImageItem/ProductImageItem';

interface Props {
  photoFileLinks: FileLink[];
}

const ProductMainImage = (props: Props) => {
  const { photoFileLinks } = props;

  const firstPhotoFileLink = photoFileLinks[0] ? photoFileLinks[0].fileInfo : undefined;

  return firstPhotoFileLink ? <ProductImageItem photoFileLink={firstPhotoFileLink} /> : null;
};

export { ProductMainImage };
