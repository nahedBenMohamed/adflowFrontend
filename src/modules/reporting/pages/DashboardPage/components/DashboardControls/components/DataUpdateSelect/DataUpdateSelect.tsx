import { MySelect, type Option, type SelectModel } from '@/shared';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css, keyframes } from 'styled-components';
import { AutoUpdateMode, UpdateIcon } from '../../../../../../shared';

const Root = styled.div`
  display: flex;
  align-items: center;
  justify-self: flex-end;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: #acb4c3;
`;

const spinningAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(359deg);
  }
`;

const ManualUpdateButton = styled.button<{ $spinning: boolean }>`
  padding: 4px;

  &:hover {
    cursor: pointer;
  }

  ${p =>
    p.$spinning &&
    css`
      svg {
        transition: var(--transition-200);
        animation: ${spinningAnimation} 1s linear infinite;
      }
    `}
`;

interface Props {
  model: SelectModel;
  onSelect: (mode: AutoUpdateMode) => void;
  handleManualUpdate: () => void;
}

const DataUpdateSelect = (props: Props) => {
  const { model, onSelect, handleManualUpdate } = props;

  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.pages.dashboard_page.auto_update_select',
  });

  const [animationPlaying, setAnimationPlaying] = useState(false);

  const options = useMemo<Option<AutoUpdateMode>[]>(
    () =>
      Object.values(AutoUpdateMode).map(m => ({
        label: t(`modes.${m}`),
        value: m,
      })),
    [t]
  );

  const handlePlayAnimation = () => {
    setAnimationPlaying(true);

    setTimeout(() => setAnimationPlaying(false), 1000);
  };

  const handleUpdate = () => {
    handlePlayAnimation();
    handleManualUpdate();
  };

  return (
    <Root>
      {t('auto_update')}

      <MySelect
        width="110px"
        model={model}
        titleMinWidth={0}
        options={options}
        variant="outlined"
        handleChange={onSelect}
      />

      <ManualUpdateButton $spinning={animationPlaying} onClick={handleUpdate}>
        <UpdateIcon />
      </ManualUpdateButton>
    </Root>
  );
};

export { DataUpdateSelect };
