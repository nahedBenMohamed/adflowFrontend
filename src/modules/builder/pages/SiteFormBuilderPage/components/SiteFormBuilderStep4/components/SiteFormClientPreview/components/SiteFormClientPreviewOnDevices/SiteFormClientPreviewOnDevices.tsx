import { ModalCloseCrossSecondaryIcon } from '@/shared';
import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { PreviewDevice, PreviewTab } from '../../../../../../../../shared';
import { DeviceSelector } from '../DeviceSelector/DeviceSelector';
import { SiteFormComputerPreview } from '../SiteFormComputerPreview/SiteFormComputerPreview';
import { SiteFormContentTabs } from '../SiteFormContentTabs/SiteFormContentTabs';
import { SiteFormPhonePreview } from '../SiteFormPhonePreview/SiteFormPhonePreview';
import { SiteFormTabletPreview } from '../SiteFormTabletPreview/SiteFormTabletPreview';

const Root = styled.div`
  position: relative;

  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
`;

const CloseCrossIconWrapper = styled.button`
  position: absolute;
  top: 0;
  right: 0;

  width: 20px;
  height: 20px;

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg path {
      fill: var(--button-text-red-default);
    }
  }

  &:active {
    svg path {
      fill: var(--button-text-red-active);
    }
  }
`;

interface Props {
  onClose: () => void;
}

const SiteFormClientPreviewOnDevices = (props: Props) => {
  const { onClose } = props;

  const [device, setDevice] = useState<PreviewDevice>(PreviewDevice.PHONE);
  const [tab, setTab] = useState<PreviewTab>(PreviewTab.FORM);

  const content = useMemo<string>(() => {
    switch (tab) {
      case PreviewTab.FORM:
        return 'Здесь будет превью формы.';

      case PreviewTab.GRATITUDE:
        return 'Здесь будет превью страницы благодарности.';

      case PreviewTab.BUTTON:
        return 'Здесь будет превью кнопки.';
    }
  }, [tab]);

  return (
    <Root>
      <CloseCrossIconWrapper onClick={onClose}>
        <ModalCloseCrossSecondaryIcon />
      </CloseCrossIconWrapper>

      <DeviceSelector value={device} onChange={setDevice} />

      <SiteFormContentTabs value={tab} onChange={setTab} />

      {device === PreviewDevice.PHONE && <SiteFormPhonePreview>{content}</SiteFormPhonePreview>}

      {device === PreviewDevice.TABLET && <SiteFormTabletPreview>{content}</SiteFormTabletPreview>}

      {device === PreviewDevice.COMPUTER && (
        <SiteFormComputerPreview>{content}</SiteFormComputerPreview>
      )}
    </Root>
  );
};

export { SiteFormClientPreviewOnDevices };
