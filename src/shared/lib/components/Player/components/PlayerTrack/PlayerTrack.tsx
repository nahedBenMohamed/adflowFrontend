import type { ChangeEventHandler, MouseEventHandler } from 'react';
import styled from 'styled-components';

const Root = styled.div`
  position: relative;

  width: 100%;
  height: 20px;

  display: flex;
  align-items: center;

  transition: var(--transition-200);

  &:hover {
    cursor: pointer;
  }
`;

const FullTrack = styled.div`
  position: relative;

  width: 100%;
  height: 4px;

  border-radius: 2px;
  background-color: var(--graphite-graphite-80);
  overflow: hidden;
`;

const Progress = styled.div`
  height: 4px;

  border-radius: 2px;
  background-color: var(--primary-statuses-green-520);
`;

const Track = styled.input`
  opacity: 0;
  appearance: none !important;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;

  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  &:hover {
    cursor: pointer;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none !important;
    height: 1px;
    width: 1px;
  }

  &::-moz-range-thumb {
    height: 1px;
    width: 1px;
  }
`;

interface Props {
  played: number;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onMouseUp: MouseEventHandler<HTMLInputElement>;
  onMouseDown: MouseEventHandler<HTMLInputElement>;
}

const PlayerTrack = (props: Props) => {
  const { played, onChange, onMouseUp, onMouseDown } = props;

  return (
    <Root>
      <FullTrack>
        <Progress style={{ width: `${played * 100}%` }} />
      </FullTrack>

      <Track
        min={0}
        step="any"
        max={0.999}
        type="range"
        onChange={onChange}
        onMouseUp={onMouseUp}
        onMouseDown={onMouseDown}
      />
    </Root>
  );
};

export { PlayerTrack };
