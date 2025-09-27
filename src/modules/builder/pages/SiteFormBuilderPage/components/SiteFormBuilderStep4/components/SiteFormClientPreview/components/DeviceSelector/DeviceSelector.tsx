import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import {
  ComputerPreviewIcon,
  PhonePreviewIcon,
  PreviewDevice,
  TabletPreviewIcon,
} from '../../../../../../../../shared';

const Root = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;

  padding: 4px;
  border-radius: 16px;
  border: 1px solid var(--graphite-graphite-80);
`;

const Device = styled.button<{ $active?: boolean }>`
  min-width: 80px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;

  font-size: 12px;
  font-weight: 400;
  line-height: 17px;
  text-align: center;
  color: var(--button-text-graphite-primary-text);

  padding: 8px;
  border-radius: 12px;
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;
  }

  ${p =>
    p.$active &&
    css`
      color: var(--button-text-graphite-priory-text);

      background: #e6fbda;

      svg path {
        fill: var(--button-text-green-default);
      }
    `}
`;

const DeviceIconWrapper = styled.div`
  width: 40px;
  height: 40px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

interface Props {
  value: PreviewDevice;
  onChange: (value: PreviewDevice) => void;
}

const DeviceSelector = (props: Props) => {
  const { value, onChange } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.site_form_builder_page.site_form_builder_step4.preview',
  });

  const getOnClickHandler = useCallback((val: PreviewDevice) => () => onChange(val), [onChange]);

  return (
    <Root>
      <Device
        type="button"
        $active={value === PreviewDevice.PHONE}
        onClick={getOnClickHandler(PreviewDevice.PHONE)}
      >
        <DeviceIconWrapper>
          <PhonePreviewIcon />
        </DeviceIconWrapper>
        {t('phone')}
      </Device>

      <Device
        type="button"
        $active={value === PreviewDevice.TABLET}
        onClick={getOnClickHandler(PreviewDevice.TABLET)}
      >
        <DeviceIconWrapper>
          <TabletPreviewIcon />
        </DeviceIconWrapper>
        {t('tablet')}
      </Device>

      <Device
        type="button"
        $active={value === PreviewDevice.COMPUTER}
        onClick={getOnClickHandler(PreviewDevice.COMPUTER)}
      >
        <DeviceIconWrapper>
          <ComputerPreviewIcon />
        </DeviceIconWrapper>
        {t('computer')}
      </Device>
    </Root>
  );
};

export { DeviceSelector };
