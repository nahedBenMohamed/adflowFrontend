import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ModalControl } from './useModalControl';

export const useQueryParamModalControl = (queryParam: string): ModalControl => {
  const [searchParams, setSearchParams] = useSearchParams();

  const modalOpened = searchParams.get(queryParam) === 'true';

  const handleOpenModal = useCallback(() => {
    setSearchParams(prev => {
      prev.set(queryParam, 'true');

      return prev;
    });
  }, [queryParam, setSearchParams]);

  const handleCloseModal = useCallback(() => {
    setSearchParams(prev => {
      prev.delete(queryParam);

      return prev;
    });
  }, [queryParam, setSearchParams]);

  return useMemo(
    () => new ModalControl({ opened: modalOpened, open: handleOpenModal, close: handleCloseModal }),
    [modalOpened, handleOpenModal, handleCloseModal]
  );
};
