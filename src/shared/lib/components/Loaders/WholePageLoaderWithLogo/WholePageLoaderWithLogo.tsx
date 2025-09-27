import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { keyframes } from 'styled-components';
import { LogoFlowerRoundIcon } from '../../../../assets';
import { envUtil } from '../../../utils';
import { SquaresLoader } from '../SquaresLoader/SquaresLoader';

interface RootProps {
  $height?: CSSProperties['height'];
  $extraOffset?: string;
  $ensureHeader?: boolean;
  $ensureSubheader?: boolean;
  $ensureHeaderWithOffset?: boolean;
  $ensureSubheaderWithOffset?: boolean;
}

const Root = styled.div<RootProps>`
  height: ${p => p.$height ?? '100dvh'};
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  ${p =>
    p.$ensureHeader && `height: calc(100dvh - var(--header-height) - ${p.$extraOffset ?? '0px'})`};

  ${p =>
    p.$ensureSubheader &&
    `height: calc(100dvh - var(--header-with-subheader-height) - ${p.$extraOffset ?? '0px'}`};

  ${p =>
    p.$ensureHeaderWithOffset &&
    `height: calc(100dvh - var(--header-height) - var(--board-offset) - ${p.$extraOffset ?? '0px'})`};

  ${p =>
    p.$ensureSubheaderWithOffset &&
    `height: calc(
        100dvh - var(--header-with-subheader-height) - var(--board-offset) -
          ${p.$extraOffset ?? '0px'}
      )`};
`;

const dualRing = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`;

const Loader = styled.div`
  position: relative;

  width: 56px;
  height: 56px;

  display: flex;
  justify-content: center;
  align-items: center;

  &:after {
    content: ' ';

    position: absolute;
    top: 0;
    left: 0;

    width: 56px;
    height: 56px;

    border-radius: 50%;
    border: 2px solid var(--button-text-green-default);
    border-color: var(--button-text-green-default) var(--graphite-graphite-80)
      var(--button-text-green-default) var(--graphite-graphite-80);

    animation: ${dualRing} 1.2s linear infinite;
  }
`;

interface Props {
  height?: CSSProperties['height'];
  ensureHeader?: boolean;
  ensureSubheader?: boolean;
  ensureHeaderWithOffset?: boolean;
  ensureSubheaderWithOffset?: boolean;
  extraOffset?: string;
}

const WholePageLoaderWithLogo = (props: Props) => {
  const {
    height,
    ensureHeader,
    ensureSubheader,
    ensureHeaderWithOffset,
    ensureSubheaderWithOffset,
    extraOffset,
  } = props;

  const { t } = useTranslation();

  return (
    <Root
      $height={height}
      $extraOffset={extraOffset}
      $ensureHeader={ensureHeader}
      $ensureSubheader={ensureSubheader}
      $ensureHeaderWithOffset={ensureHeaderWithOffset}
      $ensureSubheaderWithOffset={ensureSubheaderWithOffset}
    >
      {envUtil.appName === 'Proma' ? (
        <SquaresLoader />
      ) : (
        <Loader title={t('loading_title')}>
          <LogoFlowerRoundIcon width={40} height={40} />
        </Loader>
      )}
    </Root>
  );
};

export { WholePageLoaderWithLogo };
