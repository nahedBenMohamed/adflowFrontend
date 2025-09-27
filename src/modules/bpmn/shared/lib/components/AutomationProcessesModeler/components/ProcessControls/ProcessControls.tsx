import { PrimaryButton } from '@/shared';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { StartProcessIcon, StopProcessIcon } from '../../../../../assets';

const hoverStyle = css`
  background-color: var(--primary-statuses-white-0);
  border-top: 1px solid var(--primary-statuses-green-520);
  box-shadow: 0px 0px 12px 0px rgba(105, 210, 34, 0.48);

  // to make border look bigger without changing it's width
  &::after {
    content: '';

    position: absolute;
    top: 0;
    left: 0;
    right: 0;

    height: 1px;
    background-color: var(--primary-statuses-green-520);
  }
`;

const Root = styled.div<{ $loading: boolean }>`
  bottom: 0;
  position: fixed;

  width: calc(100vw - var(--sidebar-width));
  height: var(--bpmn-automation-process-save-controls-height);

  display: flex;
  align-items: center;
  justify-content: flex-end;

  z-index: calc(var(--subheader-z-index) - 1);

  padding: 0 48px 0 16px;
  background-color: var(--graphite-graphite-20);
  border-top: 1px solid var(--graphite-graphite-80);
  border-radius: 0 0 var(--border-radius-block) var(--border-radius-block);
  transition: var(--transition-200);

  &:hover {
    ${hoverStyle}
  }

  ${p =>
    p.$loading &&
    css`
      cursor: wait;

      ${hoverStyle}

      && * {
        pointer-events: none;
      }
    `}
`;

const LeftControlsWrapper = styled.div`
  display: flex;
  align-items: center;

  margin-left: auto;
`;

const ControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

interface Props {
  isActive: boolean;
  isUpdating: boolean;
  handleCancel: () => void;
  handleSaveDraft: () => void;
  handleSaveAndRun: ({ withRedirect }: { withRedirect: boolean }) => void;
}

const ProcessControls = memo((props: Props) => {
  const { isActive, isUpdating, handleCancel, handleSaveDraft, handleSaveAndRun } = props;

  const { t } = useTranslation('module.bpmn', {
    keyPrefix:
      'bpmn.pages.bpmn_automations_page.bpmn_automations_processes_modeler.process_controls',
  });

  const getChangeProcessStatusHandler = useCallback(
    (isActive: boolean) => () => {
      if (isActive) {
        // we need to save process as well when we're starting it
        handleSaveAndRun({ withRedirect: false });
      } else {
        handleSaveDraft();
      }
    },
    [handleSaveDraft, handleSaveAndRun]
  );

  const handleSaveAndRunHandlerWithRedirect = useCallback(
    () => handleSaveAndRun({ withRedirect: true }),
    [handleSaveAndRun]
  );

  return (
    <Root $loading={isUpdating}>
      <PrimaryButton
        variant={isActive ? 'danger' : 'filled'}
        iconProps={{ Icon: isActive ? <StopProcessIcon /> : <StartProcessIcon /> }}
        onClick={getChangeProcessStatusHandler(!isActive)}
      >
        {isActive ? t('stop_process') : t('start_process')}
      </PrimaryButton>

      <LeftControlsWrapper>
        <PrimaryButton variant="empty" onClick={handleCancel}>
          {t('cancel')}
        </PrimaryButton>

        <ControlsWrapper>
          {!isActive && (
            <PrimaryButton variant="outlined" onClick={handleSaveDraft}>
              {t('save_draft')}
            </PrimaryButton>
          )}

          <PrimaryButton onClick={handleSaveAndRunHandlerWithRedirect}>
            {t('save_and_run')}
          </PrimaryButton>
        </ControlsWrapper>
      </LeftControlsWrapper>
    </Root>
  );
});

ProcessControls.displayName = 'ProcessControls';
export { ProcessControls };
