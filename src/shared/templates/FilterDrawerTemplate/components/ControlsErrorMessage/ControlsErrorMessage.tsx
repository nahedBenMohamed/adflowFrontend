import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { WarningIcon } from '../../../../assets';

const Root = styled.div`
  display: flex;
  gap: 4px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-red-default);
`;

const WarningIconWrapper = styled.div`
  width: 20px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ControlsErrorMessage = memo(() => {
  const { t } = useTranslation('common', {
    keyPrefix: 'filter_drawer_controls',
  });

  return (
    <Root>
      <WarningIconWrapper>
        <WarningIcon />
      </WarningIconWrapper>

      {t('error_message')}
    </Root>
  );
});

export { ControlsErrorMessage };
