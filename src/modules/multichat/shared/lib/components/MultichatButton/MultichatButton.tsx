import { MyIndicator, MyTooltip, UnseenCount, envUtil, truncateNumber } from '@/shared';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { useGetMultichatUnseenCount } from '../../../../api';
import { useMultichatContext } from '../../../../context';
import { MultichatIcon } from '../../../assets';

const Root = styled.button<{ $active: boolean }>`
  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg,
  svg path,
  svg rect {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    ${p =>
      !p.$active &&
      css`
        svg {
          fill: var(--graphite-graphite-40);
        }

        svg rect {
          fill: var(--graphite-graphite-840);
        }
      `}
  }

  ${p =>
    p.$active &&
    css`
      svg path {
        stroke: var(--button-text-green-active);
      }

      svg rect {
        fill: var(--graphite-graphite-840);
      }
    `}
`;

const MultichatButton = memo(() => {
  const { opened, toggle } = useMultichatContext();

  const { t } = useTranslation('module.multichat', {
    keyPrefix: 'multichat',
  });

  const { data: unseenCount } = useGetMultichatUnseenCount();

  const moreThanTwoDigits = unseenCount > 99;

  return (
    <MyIndicator
      size={19}
      withBorder
      disabled={unseenCount === 0}
      offset={moreThanTwoDigits ? 2 : 3}
      label={
        <UnseenCount $small={moreThanTwoDigits}>
          {truncateNumber({ num: unseenCount, precision: 3 })}
        </UnseenCount>
      }
    >
      <MyTooltip
        withinPortal
        position="bottom"
        label={t('amwork_messenger', {
          company: envUtil.appName,
        })}
      >
        <Root type="button" $active={opened} onClick={toggle}>
          <MultichatIcon />
        </Root>
      </MyTooltip>
    </MyIndicator>
  );
});

MultichatButton.displayName = 'MultichatButton';
export { MultichatButton };
