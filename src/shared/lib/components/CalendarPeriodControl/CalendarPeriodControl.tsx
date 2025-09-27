import type { ReactNode } from 'react';
import styled from 'styled-components';
import { CaretIcon } from '../../../../shared';

const CalendarToolbarNavBar = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  * {
    font-variant: tabular-nums;
  }
`;

const NavControlButton = styled.button`
  width: 32px;
  height: 24px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  border-radius: var(--border-radius-element);
  transition: var(--transition-200);

  svg path {
    fill: var(--button-text-graphite-secondary-text);
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    background-color: var(--graphite-graphite-20);

    svg path {
      fill: var(--button-text-graphite-primary-text);
    }
  }

  &:active {
    background-color: var(--graphite-graphite-40);

    svg path {
      fill: var(--button-text-graphite-secondary-text);
    }
  }
`;

const ArrowIconWrapper = styled.div<{ $rotate?: boolean }>`
  width: 16px;
  height: 16px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  transform: ${p => (p.$rotate ? 'rotate(90deg)' : 'rotate(-90deg)')};
`;

interface Props {
  children: ReactNode;
  onNext: () => void;
  onPrev: () => void;
}

const CalendarPeriodControl = (props: Props) => {
  const { children, onNext, onPrev } = props;

  return (
    <CalendarToolbarNavBar>
      <NavControlButton onClick={onPrev}>
        <ArrowIconWrapper $rotate>
          <CaretIcon />
        </ArrowIconWrapper>
      </NavControlButton>

      {children}

      <NavControlButton onClick={onNext}>
        <ArrowIconWrapper>
          <CaretIcon />
        </ArrowIconWrapper>
      </NavControlButton>
    </CalendarToolbarNavBar>
  );
};

export { CalendarPeriodControl };
