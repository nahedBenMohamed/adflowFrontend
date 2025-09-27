import styled, { css } from 'styled-components';
import { BrokenPlayerIcon, PauseIcon, PlayIcon } from '../../../../../assets';

interface RootProps {
  $playable: boolean;
  $minified?: boolean;
}

const Root = styled.button<RootProps>`
  width: ${p => (p.$minified ? 24 : 32)}px;
  height: ${p => (p.$minified ? 24 : 32)}px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  border-radius: 50%;
  border: ${p => !p.$minified && `2px solid var(--primary-statuses-white-0)`};
  background-color: var(--primary-statuses-green-520);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    background-color: var(--button-text-green-active);
  }

  &:active {
    background-color: var(--button-text-green-hover);
  }

  ${p =>
    !p.$playable &&
    css`
      background-color: transparent;

      &:hover {
        cursor: default;

        background-color: transparent;
      }

      &:active {
        background-color: transparent;
      }
    `}
`;

interface Props {
  playing: boolean;
  isPlayable: boolean;
  isValidRecord: boolean;
  minifiedView?: boolean;
  handlePlayRecord: () => void;
}

const PlayerControls = (props: Props) => {
  const { playing, isPlayable, isValidRecord, minifiedView, handlePlayRecord } = props;

  return (
    <Root
      $minified={minifiedView}
      $playable={isPlayable && isValidRecord}
      onClick={handlePlayRecord}
    >
      {isPlayable && isValidRecord ? playing ? <PauseIcon /> : <PlayIcon /> : <BrokenPlayerIcon />}
    </Root>
  );
};

export { PlayerControls };
