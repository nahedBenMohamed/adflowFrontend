import { OverlayingModal } from '../../Modals/OverlayingModal/OverlayingModal';
import { WholePageLoaderWithLogo } from '../WholePageLoaderWithLogo/WholePageLoaderWithLogo';

const ModalLoader = () => {
  return (
    <OverlayingModal isOpened onClose={() => {}} animation={false}>
      <WholePageLoaderWithLogo />
    </OverlayingModal>
  );
};

export { ModalLoader };
