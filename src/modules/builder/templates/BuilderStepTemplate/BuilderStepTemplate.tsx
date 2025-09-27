import { observer } from 'mobx-react-lite';
import { useCallback, type ReactNode } from 'react';
import styled from 'styled-components';
import { BuilderStepBox, BuilderStepControls, type BuilderNavStep } from '../../shared';
import { type BuilderNavStore } from '../../store';

const Root = styled(BuilderStepBox)`
  position: relative;

  min-height: 200px;
  max-width: 960px;
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: 24px;
`;

interface Props {
  children: ReactNode;
  navStore: BuilderNavStore;
  currentStep: BuilderNavStep;
  canGoBack?: boolean;
  nextLoading?: boolean;
  saveLoading?: boolean;
  dangerousSave?: boolean;
  error?: string;
  setStepOrder: (order: number) => void;
  onNext?: () => void;
  onSave?: () => void;
}

export const STEP_ORDER_DATA_ATTRIBUTE = 'data-step-order';

const BuilderStepTemplate = observer((props: Props) => {
  const {
    children,
    currentStep,
    navStore,
    canGoBack,
    nextLoading,
    dangerousSave,
    saveLoading,
    error,
    setStepOrder,
    onNext,
    onSave,
  } = props;

  const { stepOrder, navigateToPreviousStep } = navStore;
  const { locked, order } = currentStep;

  const notCurrentStep = stepOrder !== order;

  const handleSetCurrentStep = useCallback(() => {
    setStepOrder(currentStep.order);
  }, [currentStep, setStepOrder]);

  return locked ? null : (
    <Root {...{ [STEP_ORDER_DATA_ATTRIBUTE]: order }}>
      <Content onClick={handleSetCurrentStep}>{children}</Content>

      <BuilderStepControls
        error={error}
        hidden={notCurrentStep}
        saveAndLeavePropsProps={
          onSave
            ? {
                variant: dangerousSave ? 'danger' : undefined,
                disabled: saveLoading,
                onClick: onSave,
              }
            : undefined
        }
        nextProps={
          onNext
            ? {
                disabled: nextLoading,
                onClick: onNext,
              }
            : undefined
        }
        backProps={
          canGoBack
            ? {
                onClick: navigateToPreviousStep,
              }
            : undefined
        }
      />
    </Root>
  );
});

export { BuilderStepTemplate };
