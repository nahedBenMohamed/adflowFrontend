import { routes } from '@/app';
import {
  DraggableResizableControl,
  type DraggableResizableControlBounds,
  UriCodingUtil,
  useMobile,
} from '@/shared';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useMultichatContext } from '../../../../context';
import { getDefaultModalBounds } from '../../helpers';
import { MultichatControl } from '../MultichatControl/MultichatControl';

const Root = styled.div`
  position: fixed;
  inset: 0;
  top: 0;
  left: 0;

  pointer-events: none;
  z-index: var(--modal-z-index);
`;

const MultichatModal = () => {
  const { opened, hide } = useMultichatContext();

  const [modalBounds, setModalBounds] = useState<DraggableResizableControlBounds>(() =>
    getDefaultModalBounds()
  );

  const isMobile = useMobile();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isMobile && opened) {
      hide();

      navigate(routes.multichat(UriCodingUtil.encode(location.pathname)));
    }
  }, [hide, isMobile, location.pathname, navigate, opened]);

  if (!opened || isMobile) return null;

  return (
    <Root>
      <DraggableResizableControl
        modalBounds={modalBounds}
        dragHandleClassName="workspace__MultichatControlHeader--Root"
        setModalBounds={setModalBounds}
      >
        <MultichatControl modalView modalWidth={modalBounds.size.width} />
      </DraggableResizableControl>
    </Root>
  );
};

export { MultichatModal };
