import { observer } from 'mobx-react-lite';
import React from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import styled from 'styled-components';

interface StyledScrollbarsProps {
  $rightIndent: boolean;
  $dark?: boolean;
}

const StyledScrollbars = styled(Scrollbars)<StyledScrollbarsProps>`
  .track-vertical {
    background-color: transparent;
    top: 0;
    right: ${p => (p.$rightIndent ? `7px` : 0)};
    bottom: 16px;
    width: 4px !important;
  }

  .thumb-vertical {
    background-color: ${p =>
      p.$dark
        ? `var(--button-text-graphite-priory-text)`
        : `var(--button-text-graphite-secondary-text)`};
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--border-radius-element);
    width: 4px !important;
    z-index: 3;
  }

  .track-horizontal {
    //display: none;

    background-color: var(--button-text-graphite-secondary-text);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--border-radius-element);
    //width: 4px !important;
    height: 4px;
    z-index: 3;
  }
`;

interface Props {
  children: React.ReactNode;
  dark?: boolean;
  autoHeight?: boolean;
  autoHeightMax?: number | string;
  rightIndent?: boolean;
  onScroll?: (e: any) => void;
}

const Scrollbar = observer((props: Props) => {
  const { children, dark, onScroll, rightIndent = true, ...rest } = props;

  return (
    <StyledScrollbars
      universal
      onScroll={onScroll}
      renderTrackVertical={(_props: any) => <div {..._props} className="track-vertical" />}
      renderThumbVertical={(_props: any) => <div {..._props} className="thumb-vertical" />}
      renderTrackHorizontal={(_props: any) => <div {..._props} className="track-horizontal" />}
      renderView={(_props: any) => <div {..._props} className="view" />}
      hideTracksWhenNotNeeded
      autoHide
      $dark={dark}
      $rightIndent={rightIndent}
      {...rest}
    >
      {children}
    </StyledScrollbars>
  );
});

Scrollbar.displayName = 'Scrollbar';
export { Scrollbar };
