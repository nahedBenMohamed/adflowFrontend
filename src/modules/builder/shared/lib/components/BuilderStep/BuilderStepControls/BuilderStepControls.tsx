import { PrimaryButton, WarningIcon, type PrimaryButtonVariant } from '@/shared';
import { Transition } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { StepBackIcon, StepNextIcon } from '../../../../assets';

const ErrorWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-red-default);

  margin-right: auto;
`;

const WarningIconWrapper = styled.div`
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;

  scale: 1;
  opacity: 1;
  transition: var(--transition-200);
`;

const StepButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

interface RootProps {
  $danger?: boolean;
  $fixed?: boolean;
  $hidden?: boolean;
}

const Root = styled.div<RootProps>`
  position: sticky;
  bottom: 0;

  width: 100%;

  display: flex;
  align-items: center;
  justify-content: flex-end;

  z-index: calc(var(--subheader-z-index) - 1);

  padding: 12px 24px;
  background-color: var(--primary-statuses-white-0);
  border-top: 1px solid var(--graphite-graphite-80);
  border-radius: 0 0 var(--border-radius-block) var(--border-radius-block);
  transition: var(--transition-200);

  ${p =>
    p.$fixed &&
    css`
      bottom: 0;
      position: fixed;
      left: var(--sidebar-width);

      width: calc(100vw - var(--sidebar-width));
      height: var(--fixed-builder-step-controls-height);

      padding: 16px 48px;
      border-top: 1px solid var(--graphite-graphite-80);
      background-color: var(--graphite-graphite-20);

      &:hover {
        background-color: var(--primary-statuses-white-0);
        border-top: 1px solid
          ${p.$danger ? 'var(--button-text-red-default)' : 'var(--primary-statuses-green-520)'};
        box-shadow: 0px 0px 12px 0px
          ${p.$danger ? 'rgba(248, 101, 79, 0.48)' : 'rgba(105, 210, 34, 0.48)'};

        // to make border look bigger without changing it's width
        &::after {
          content: '';

          position: absolute;
          top: 0;
          left: 0;
          right: 0;

          height: 1px;
          background-color: ${p.$danger
            ? 'var(--button-text-red-default)'
            : 'var(--primary-statuses-green-520)'};
        }
      }
    `}

  ${p => p.$hidden && 'display: none'};
`;

const StepControlButton = styled.button`
  height: 32px;

  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 4px;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  padding: 0 12px;
  background-color: transparent;
  border-radius: var(--border-radius-element);
  border: 1px solid var(--graphite-graphite-80);
  transition: var(--transition-200);

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    color: var(--button-text-graphite-primary-text);

    border-color: #e6fbda;
    background-color: #e6fbda;

    svg path {
      stroke: var(--button-text-green-hover);
    }
  }

  &:active {
    color: var(--graphite-graphite-840);

    border-color: #f3fded;
    background-color: #f3fded;

    svg path {
      stroke: var(--button-text-green-active);
    }
  }

  &:disabled {
    opacity: 0.5;

    pointer-events: none;
  }
`;

const StepControlButtonIconWrapper = styled.div`
  width: 24px;
  height: 24px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export interface BuilderStepControlsButtonProps {
  label?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export interface BuilderStepControlsSaveButtonProps extends BuilderStepControlsButtonProps {
  variant?: PrimaryButtonVariant;
}

interface Props {
  error?: string;
  fixed?: boolean;
  hidden?: boolean;
  nextProps?: BuilderStepControlsButtonProps;
  backProps?: BuilderStepControlsButtonProps;
  saveProps?: BuilderStepControlsSaveButtonProps;
  saveAndLeavePropsProps?: BuilderStepControlsSaveButtonProps;
}

const BuilderStepControls = (props: Props) => {
  const { error, fixed, hidden, nextProps, backProps, saveProps, saveAndLeavePropsProps } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.components.common',
  });

  return (
    <Root $hidden={hidden} $fixed={fixed} $danger={Boolean(error)}>
      <Transition transition="pop" mounted={Boolean(error)}>
        {transitionStyles => (
          <ErrorWrapper style={{ ...transitionStyles }}>
            <WarningIconWrapper>
              <WarningIcon />
            </WarningIconWrapper>

            {error}
          </ErrorWrapper>
        )}
      </Transition>

      <ButtonsWrapper>
        <StepButtonsWrapper>
          {backProps && (
            <StepControlButton {...backProps}>
              <StepControlButtonIconWrapper>
                <StepBackIcon />
              </StepControlButtonIconWrapper>

              {backProps.label || t('back')}
            </StepControlButton>
          )}

          {nextProps && (
            <StepControlButton {...nextProps}>
              <StepControlButtonIconWrapper>
                <StepNextIcon />
              </StepControlButtonIconWrapper>

              {nextProps.label || t('next')}
            </StepControlButton>
          )}
        </StepButtonsWrapper>

        {saveProps && <PrimaryButton {...saveProps}>{saveProps.label || t('save')}</PrimaryButton>}

        {saveAndLeavePropsProps && (
          <PrimaryButton {...saveAndLeavePropsProps}>
            {saveAndLeavePropsProps.label || t('save')}
          </PrimaryButton>
        )}
      </ButtonsWrapper>
    </Root>
  );
};

export { BuilderStepControls };
