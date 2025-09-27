import { MiniLoader } from '@/shared';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { entitiesImportStore } from '../../../../../../store';
import { DownloadExampleIcon } from '../../../../../assets';
import { ButtonIconWrapper } from './IconWrapper';

const Root = styled.button`
  position: relative;

  height: 60px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--primary-statuses-white-0);

  padding: 14px 16px;
  background: var(--button-text-green-default);
  border-radius: var(--border-radius-element);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    background: var(--button-text-green-hover);
  }

  &:active {
    background: var(--button-text-green-active);
  }

  &:disabled {
    pointer-events: none;

    opacity: 0.8;
  }
`;

interface Props {
  entityTypeId: number;
  entityTypeName: string;
}

const DownloadExampleButton = (props: Props) => {
  const { entityTypeId, entityTypeName } = props;

  const { t } = useTranslation('component.section', {
    keyPrefix: 'section.common.settings_button',
  });

  const [downloading, setDownloading] = useState(false);

  const handleClick = async (): Promise<void> => {
    try {
      setDownloading(true);

      await entitiesImportStore.getImportTemplate({ entityTypeId, entityTypeName });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Root type="button" disabled={downloading} onClick={handleClick}>
      <ButtonIconWrapper>
        {downloading ? <MiniLoader /> : <DownloadExampleIcon />}
      </ButtonIconWrapper>

      {t('get_import_template')}
    </Root>
  );
};

export { DownloadExampleButton };
