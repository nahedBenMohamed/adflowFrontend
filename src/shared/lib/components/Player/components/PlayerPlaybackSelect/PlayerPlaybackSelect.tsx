import { useDisclosure } from '@mantine/hooks';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { Option } from '../../../../models';
import type { PlayerPlaybackRate } from '../../../../types';
import { MySelectCustomTemplate } from '../../../Form/MySelect/MySelectCustomTemplate/MySelectCustomTemplate';
import { SelectOptionItem, SelectOptionsList } from '../../../Form/components';

const PlaybackRateButton = styled.button`
  width: 26px;

  display: flex;

  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  &:hover {
    cursor: pointer;
  }
`;

const SelectItemWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SelectItemLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
`;

const SelectItemExtra = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
`;

interface Props {
  playbackRate: PlayerPlaybackRate;
  setPlaybackRate: (rate: PlayerPlaybackRate) => void;
}

const playbackRateOptions: Option<PlayerPlaybackRate, string>[] = [
  { label: '1.0x', value: 1, extra: 'default' },
  { label: '1.5x', value: 1.5, extra: 'fast' },
  { label: '2.0x', value: 2, extra: 'super_fast' },
];

const PlayerPlaybackSelect = (props: Props) => {
  const { playbackRate, setPlaybackRate } = props;

  const { t } = useTranslation();

  const [dropdownOpened, { close: hideDropdown, open: showDropdown }] = useDisclosure(false);

  const getPlaybackRateHandler = useCallback(
    (option: Option<PlayerPlaybackRate, string>) => () => {
      setPlaybackRate(option.value);

      hideDropdown();
    },
    [hideDropdown, setPlaybackRate]
  );

  return (
    <MySelectCustomTemplate
      withinPortal
      dropdownPadding={0}
      position="bottom-end"
      opened={dropdownOpened}
      customButton={
        <PlaybackRateButton>
          {playbackRate}
          {playbackRate === 1.5 ? 'x' : '.0x'}
        </PlaybackRateButton>
      }
      hide={hideDropdown}
      show={showDropdown}
    >
      <SelectOptionsList padding="8px">
        {playbackRateOptions.map(o => (
          <SelectOptionItem
            key={o.value}
            active={playbackRate === o.value}
            label={
              <SelectItemWrapper>
                <SelectItemLabel>{o.label}</SelectItemLabel>

                <SelectItemExtra>{t(`player.${o.extra}`)}</SelectItemExtra>
              </SelectItemWrapper>
            }
            onSelect={getPlaybackRateHandler(o)}
          />
        ))}
      </SelectOptionsList>
    </MySelectCustomTemplate>
  );
};

export { PlayerPlaybackSelect };
