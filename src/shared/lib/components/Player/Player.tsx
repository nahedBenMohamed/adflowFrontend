import { RecordStateStore, fileApi, recordSingularityStore } from '@/app';
import { MediaBreakpoints } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ChangeEvent,
  type MouseEventHandler,
  type ReactNode,
} from 'react';
import ReactPlayer from 'react-player';
import type { OnProgressProps } from 'react-player/base';
import styled, { css } from 'styled-components';
import { getTimeString } from '../../helpers';
import type { Nullable } from '../../types';
import { ClearRoundButton } from '../Buttons/ClearRoundButton/ClearRoundButton';
import { DownloadButton } from '../Buttons/DownloadButton/DownloadButton';
import { PlayerControls, PlayerPlaybackSelect, PlayerTrack } from './components';

interface PlayerWrapperProps {
  $expandable: boolean;
  $playerExpanded?: boolean;
  $width?: CSSProperties['width'];
}

const PlayerWrapper = styled.div<PlayerWrapperProps>`
  position: relative;

  width: ${p => p.$width};

  display: flex;
  align-items: center;
  gap: 8px;

  .react-player {
    position: absolute;
    top: 0;
    left: 0;
  }

  transition: var(--transition-200);

  ${p => p.$expandable && 'width: 78px'};
  ${p => p.$playerExpanded && 'width: 100%'};

  @media ${MediaBreakpoints.SM} {
    width: 100%;
  }
`;

interface ControlWithTrackWrapperProps {
  $minified?: boolean;
  $removeControlPadding?: boolean;
}

const ControlWithTrackWrapper = styled.div<ControlWithTrackWrapperProps>`
  width: 100%;

  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;

  padding-right: ${p => (p.$removeControlPadding ? 0 : 16)}px;
  transition: var(--transition-200);

  ${p =>
    !p.$minified &&
    css`
      border-radius: 16px;
      background-color: #f3fded;
    `}
`;

const ControlsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  gap: 16px;
`;

const FullDuration = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
`;

interface TimeProps {
  valid?: boolean;
  minified?: boolean;
}

const Time = styled.p<TimeProps>`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  font-variant: tabular-nums;
  color: ${p =>
    !p.valid
      ? `var(--button-text-graphite-secondary-text)`
      : p.minified
        ? `var(--button-text-graphite-priory-text)`
        : `var(--button-text-graphite-primary-text)`};
  transition: var(--transition-200);
`;

export interface PlayerDownloadProps {
  canDownload: boolean;
  getFileName: () => string;
}

interface Props {
  recordUrl: string;
  duration: Nullable<number>;
  width?: CSSProperties['width'];
  minifiedView?: boolean;
  removeControlPadding?: boolean;
  displayDurationBeforePlay?: boolean;
  downloadProps?: PlayerDownloadProps;
  setDuration?: (duration: number) => void;
}

const Player = observer((props: Props) => {
  const {
    recordUrl,
    minifiedView,
    width,
    removeControlPadding,
    displayDurationBeforePlay,
    duration,
    downloadProps,
    setDuration,
  } = props;

  const ref = useRef<ReactPlayer>(null);
  const player = ref.current;

  const {
    recordState,
    setPlayed,
    setPlaying,
    setExpanded,
    togglePlaying,
    toggleExpanded,
    setPlaybackRate,
    setSeekingStatus,
    setDuration: setRecordStateDuration,
  } = useMemo(
    () =>
      new RecordStateStore({
        recordUrl,
        played: 0,
        duration: 0,
        playing: false,
        expanded: false,
        playbackRate: 1,
        seekingStatus: false,
      }),
    [recordUrl]
  );

  const [isPlayable, setIsPlayable] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [durationDisplayed, { close: hideDuration }] = useDisclosure(displayDurationBeforePlay);

  const isValidRecord = Boolean(recordUrl && duration);

  useLayoutEffect(() => {
    if (recordSingularityStore.currentRecordUrl === recordUrl) return;

    setPlayed(0);
    setPlaying(false);
    setExpanded(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordSingularityStore.currentRecordUrl, recordUrl, setPlayed, setPlaying]);

  const handleDownload = useCallback(async (): Promise<void> => {
    if (!isValidRecord || !downloadProps) return;

    const fileName = downloadProps.getFileName();

    try {
      setIsLoadingFile(true);

      await fileApi.downloadFile({
        url: recordUrl,
        fileName,
      });
    } catch (e) {
      console.error(`Failed to load audio ${fileName}: ${e}`);
    } finally {
      setIsLoadingFile(false);
    }
  }, [downloadProps, isValidRecord, recordUrl]);

  const handlePlayRecord = useCallback(() => {
    if (!isPlayable) return;

    recordSingularityStore.setCurrentRecordUrl(recordUrl);

    togglePlaying();
    toggleExpanded();

    if (displayDurationBeforePlay && durationDisplayed) hideDuration();
  }, [
    recordUrl,
    isPlayable,
    durationDisplayed,
    displayDurationBeforePlay,
    hideDuration,
    togglePlaying,
    toggleExpanded,
  ]);

  const handleProgress = useCallback(
    (progress: OnProgressProps) => {
      if (recordState.seekingStatus) return;

      setPlayed(progress.played);
    },
    [recordState.seekingStatus, setPlayed]
  );

  const handleSeekMouseDown = useCallback(() => setSeekingStatus(true), [setSeekingStatus]);

  const handleSeekChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const played = parseFloat(e.target.value);

      if (isNaN(played)) {
        console.error('Failed to parse played value from the track in seek change handler');

        return;
      }

      setPlayed(played);
    },
    [setPlayed]
  );

  const handleSeekMouseUp: MouseEventHandler<HTMLInputElement> = useCallback(
    e => {
      if (player) player.seekTo(parseFloat(e.currentTarget.value));

      setSeekingStatus(false);
    },
    [player, setSeekingStatus]
  );

  const handleEnded = useCallback(() => setPlaying(false), [setPlaying]);

  const handleReactPlayerError = useCallback(
    (e: unknown) => {
      setIsPlayable(false);

      console.error(`Error while playing record: ${e}`);
    },
    [setIsPlayable]
  );

  const handleReady = useCallback(() => {
    if (isValidRecord) setIsPlayable(true);
  }, [isValidRecord, setIsPlayable]);

  const handleDuration = useCallback(
    (duration: number) => {
      setRecordStateDuration(duration);
      setDuration?.(duration);
    },
    [setRecordStateDuration, setDuration]
  );

  const handleClearButtonPress = useCallback(() => {
    setExpanded(false);
    setPlaying(false);
  }, [setExpanded, setPlaying]);

  const TimeComponent = useMemo<ReactNode>(
    () => (
      <Time minified={minifiedView} valid={isValidRecord && isPlayable}>
        {durationDisplayed
          ? getTimeString(Math.round(duration ?? 0))
          : getTimeString(Math.round(recordState.duration * recordState.played))}
      </Time>
    ),
    [
      minifiedView,
      isValidRecord,
      isPlayable,
      durationDisplayed,
      duration,
      recordState.duration,
      recordState.played,
    ]
  );

  return (
    <PlayerWrapper
      $width={width}
      $playerExpanded={!width && recordState.expanded}
      $expandable={Boolean(minifiedView)}
    >
      <>
        <ControlWithTrackWrapper
          $minified={minifiedView}
          $removeControlPadding={removeControlPadding}
        >
          <PlayerControls
            isPlayable={isPlayable}
            minifiedView={minifiedView}
            playing={recordState.playing}
            isValidRecord={isValidRecord}
            handlePlayRecord={handlePlayRecord}
          />

          {(recordState.expanded || !minifiedView) && (
            <PlayerTrack
              played={recordState.played}
              onChange={handleSeekChange}
              onMouseUp={handleSeekMouseUp}
              onMouseDown={handleSeekMouseDown}
            />
          )}

          {minifiedView ? recordState.expanded && TimeComponent : TimeComponent}
        </ControlWithTrackWrapper>

        {(recordState.expanded || !minifiedView) && (
          <PlayerPlaybackSelect
            playbackRate={recordState.playbackRate}
            setPlaybackRate={setPlaybackRate}
          />
        )}

        {recordState.expanded && minifiedView && (
          <ClearRoundButton onClick={handleClearButtonPress} />
        )}
      </>

      <ReactPlayer
        // react-player has it's own played state management under the hood,
        // so when currentRecordUrl changes we need to make sure that player's inner played state is reset
        key={recordSingularityStore.currentRecordUrl}
        ref={ref}
        width={0}
        height={0}
        stopOnUnmount
        url={recordUrl}
        progressInterval={100}
        playing={recordState.playing}
        playbackRate={recordState.playbackRate}
        onReady={handleReady}
        onEnded={handleEnded}
        onDuration={handleDuration}
        onProgress={handleProgress}
        onError={handleReactPlayerError}
      />

      {minifiedView && !recordState.expanded && (
        <ControlsWrapper>
          {isValidRecord && isPlayable && (
            <>
              <FullDuration>{getTimeString(duration ?? 0)}</FullDuration>

              <DownloadButton loading={isLoadingFile} onClick={handleDownload} />
            </>
          )}
        </ControlsWrapper>
      )}
    </PlayerWrapper>
  );
});

Player.displayName = 'Player';
export { Player };
