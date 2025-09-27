import { DropdownScrollbarMixin, PrimaryButton } from '@/shared';
import { FocusTrap } from '@mantine/core';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div`
  position: fixed;
  right: 16px;
  bottom: calc(var(--bpmn-automation-process-save-controls-height) + 16px);

  z-index: var(--modal-z-index);

  width: 500px;
  min-height: 420px;
  height: fit-content;
  max-height: calc(
    100dvh - var(--header-with-subheader-height) - 16px *
      2 - var(--bpmn-automation-process-save-controls-height)
  );

  display: flex;
  flex-direction: column;

  box-shadow: var(--dropdown-box-shadow);
  border-radius: var(--border-radius-block);
  border: 1px solid var(--graphite-graphite-80);
  background-color: var(--primary-statuses-white-0);
`;

const HeaderBlock = styled.div`
  display: flex;
  gap: 12px;

  padding: 12px 16px;
  border-bottom: 1px solid var(--graphite-graphite-120);
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;

  ${DropdownScrollbarMixin}

  padding: 12px 16px;
`;

const Title = styled.h2`
  font-size: 16px;
  font-weight: 600;
  line-height: 32px;
  color: var(--button-text-graphite-priory-text);
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;

  padding: 12px 16px;
  border-top: 1px solid var(--graphite-graphite-120);
`;

interface Props {
  title: string;
  isOpened: boolean;
  children: ReactNode;
  Icon?: ReactNode;
  isSaving?: boolean;
  handleSave: () => void;
  handleCancel: () => void;
}

const ProcessElementPopup = (props: Props) => {
  const { title, isOpened, children, Icon, isSaving, handleSave, handleCancel } = props;

  const { t } = useTranslation('common', {
    keyPrefix: 'buttons',
  });

  return (
    <FocusTrap active={isOpened}>
      <Root>
        <HeaderBlock>
          {Icon}

          <Title>{title}</Title>
        </HeaderBlock>

        <Content>{children}</Content>

        <Controls>
          <PrimaryButton disabled={isSaving} loading={isSaving} onClick={handleSave}>
            {t('save')}
          </PrimaryButton>

          <PrimaryButton disabled={isSaving} variant="outlined" onClick={handleCancel}>
            {t('cancel')}
          </PrimaryButton>
        </Controls>
      </Root>
    </FocusTrap>
  );
};

export { ProcessElementPopup };
