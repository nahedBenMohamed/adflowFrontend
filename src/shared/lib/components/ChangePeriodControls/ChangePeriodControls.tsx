import { ChevronLeftIcon } from '@/shared';
import { memo } from 'react';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  align-items: center;

  border-radius: 100px;
  border: 1px solid var(--graphite-graphite-80);
  background: var(--primary-statuses-white-0);
`;

const Button = styled.button<{ $rotate?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: ${p => (p.$rotate ? '0 100px 100px 0' : '100px 0 0 100px')};
  padding: 4px 8px;
  overflow: hidden;
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    background: var(--graphite-graphite-40);
  }

  &:active {
    background: var(--graphite-graphite-80);
  }
`;

const ChevronIcon = styled(ChevronLeftIcon)<{ $rotate?: boolean }>`
  width: 24px;
  height: 24px;

  ${p => p.$rotate && `transform: rotate(180deg)`};
`;

const Divider = styled.div`
  width: 1px;
  height: 24px;

  background: var(--graphite-graphite-80);
`;

interface Props {
  onClickPrev: () => void;
  onClickNext: () => void;
}

const ChangePeriodControls = memo((props: Props) => {
  const { onClickPrev, onClickNext } = props;

  return (
    <Root>
      <Button type="button" onClick={onClickPrev}>
        <ChevronIcon />
      </Button>

      <Divider />

      <Button type="button" onClick={onClickNext} $rotate>
        <ChevronIcon $rotate />
      </Button>
    </Root>
  );
});

ChangePeriodControls.displayName = 'ChangePeriodControls';
export { ChangePeriodControls };
