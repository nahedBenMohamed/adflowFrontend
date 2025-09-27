import styled, { css } from 'styled-components';
import type { MyInputVariant } from '../../../../../../models';
import { MiniLoader } from '../../../../../Loaders/MiniLoader/MiniLoader';

interface RootProps {
  $variant: MyInputVariant;
  $offset?: number;
}

const Root = styled.div<RootProps>`
  position: absolute;
  right: ${p => (p.$offset ? p.$offset : p.$variant === `outlined` ? 6 : -2)}px;
  top: 4px;

  ${p =>
    p.$variant === 'outlined' &&
    css`
      top: 50%;

      transform: translateY(-50%);
    `}

  width: fit-content;
  height: fit-content;
`;

interface Props {
  variant: MyInputVariant;
  offset?: number;
}

const Loader = (props: Props) => {
  const { variant, offset } = props;

  return (
    <Root $variant={variant} $offset={offset}>
      <MiniLoader color="var(--primary-statuses-green-520)" size="small" />
    </Root>
  );
};

export { Loader };
