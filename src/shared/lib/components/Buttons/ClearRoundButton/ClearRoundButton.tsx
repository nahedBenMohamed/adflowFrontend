import { observer } from 'mobx-react-lite';
import type { ButtonHTMLAttributes, CSSProperties } from 'react';
import styled from 'styled-components';
import { ClearCircledIcon } from '../../../../assets';

interface RootProps {
  marginTop?: CSSProperties['marginTop'];
  zIndex?: CSSProperties['zIndex'];
}

const Root = styled.button<RootProps>`
  width: 20px;
  height: 20px;

  margin-top: ${p => p.marginTop};

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg path {
      fill: var(--button-text-red-hover);
    }
  }

  &:active {
    svg path {
      fill: var(--button-text-red-active);
    }
  }
`;

export const CLEAR_ROUND_BUTTON_CLASS = 'workspace__ClearRoundButton--Root';

type OmittedButtonHTMLAttributes = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'type' | 'className'
>;

interface Props extends OmittedButtonHTMLAttributes {
  marginTop?: CSSProperties['marginTop'];
  zIndex?: CSSProperties['zIndex'];
}

const ClearRoundButton = observer((props: Props) => {
  const { marginTop, zIndex, ...rest } = props;

  return (
    <Root
      {...rest}
      type="button"
      zIndex={zIndex}
      marginTop={marginTop}
      className={CLEAR_ROUND_BUTTON_CLASS}
    >
      <ClearCircledIcon />
    </Root>
  );
});

ClearRoundButton.displayName = 'ClearRoundButton';
export { ClearRoundButton };
