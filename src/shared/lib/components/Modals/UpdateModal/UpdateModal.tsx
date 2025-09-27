import { Portal, Transition } from '@mantine/core';
import { memo, useCallback } from 'react';
import styled from 'styled-components';
import { ControlButton } from '../../Buttons/ControlButton/ControlButton';

const Root = styled.div`
  position: fixed;
  top: calc(var(--header-height) + 8px);
  left: calc(var(--sidebar-width) + 8px);

  z-index: calc(var(--modal-z-index) - 1);

  width: 320px;
  height: fit-content;

  display: flex;
  flex-direction: column;
  gap: 6px;

  padding: 16px 20px;
  border-radius: var(--border-radius-block);
  border: 1px solid var(--graphite-graphite-80);
  background-color: var(--primary-statuses-white-0);
  box-shadow:
    0px 101px 40px rgba(146, 151, 176, 0.01),
    0px 57px 34px rgba(146, 151, 176, 0.05),
    0px 25px 25px rgba(146, 151, 176, 0.09),
    0px 6px 14px rgba(146, 151, 176, 0.1),
    0px 0px 0px rgba(146, 151, 176, 0.1);
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  color: var(--button-text-graphite-priory-text);
`;

const Annotation = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

const Controls = styled.div`
  width: 100%;

  display: flex;
  justify-content: flex-end;
`;

interface Props {
  mounted: boolean;
  title: string;
  annotation: string;
  update: string;
}

const UpdateModal = memo((props: Props) => {
  const { mounted, title, annotation, update } = props;

  const handleUpdateApp = useCallback(() => window.location.reload(), []);

  return (
    <Transition
      duration={300}
      transition="pop-top-left"
      timingFunction="ease-in-out"
      mounted={mounted}
    >
      {transitionStyles => (
        <Portal>
          <Root style={transitionStyles}>
            <Title>{title}</Title>
            <Annotation>{annotation}</Annotation>

            <Controls>
              <ControlButton variant="save" onClick={handleUpdateApp}>
                {update}
              </ControlButton>
            </Controls>
          </Root>
        </Portal>
      )}
    </Transition>
  );
});

UpdateModal.displayName = 'UpdateModal';
export { UpdateModal };
