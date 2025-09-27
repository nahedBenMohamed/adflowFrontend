import { Hint } from '@/shared';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

interface Props {
  label: string;
  hint?: string;
}

const BuilderStepItemLabel = (props: Props) => {
  const { label, hint } = props;

  return (
    <Root>
      {label}

      {hint && <Hint text={hint} />}
    </Root>
  );
};

export { BuilderStepItemLabel };
