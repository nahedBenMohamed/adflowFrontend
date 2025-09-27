import { DialogModalSecondary, type DialogModalSecondaryProps } from '@/shared';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  padding: 16px 24px;
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HeaderIconWrapper = styled.div`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

type OmittedDialogModalSecondaryProps = Omit<DialogModalSecondaryProps, 'Header' | 'maxHeight'>;

export interface IntegrationInfoModalTemplateProps extends OmittedDialogModalSecondaryProps {
  Icon: ReactNode;
  headerTitle: string;
  maxHeight?: string;
}

const IntegrationInfoModalTemplate = (props: IntegrationInfoModalTemplateProps) => {
  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page',
  });

  const {
    Icon,
    children,
    headerTitle,
    maxHeight = '568px',
    approveTitle = t('continue'),
    ...rest
  } = props;

  return (
    <DialogModalSecondary
      {...rest}
      width="100%"
      maxWidth="640px"
      maxHeight={maxHeight}
      approveTitle={approveTitle}
      Header={
        <HeaderWrapper>
          <HeaderIconWrapper>{Icon}</HeaderIconWrapper>

          {headerTitle}
        </HeaderWrapper>
      }
    >
      <Root>{children}</Root>
    </DialogModalSecondary>
  );
};

export { IntegrationInfoModalTemplate };
