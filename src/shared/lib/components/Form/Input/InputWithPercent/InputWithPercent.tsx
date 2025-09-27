import { MyInput, MyTooltip, type MyInputProps } from '@/shared';
import { observer } from 'mobx-react-lite';
import styled, { type CSSProperties } from 'styled-components';
import { PercentIcon } from '../../../../../assets';

interface RootProps {
  $width?: CSSProperties['width'];
}

const Root = styled.div<RootProps>`
  position: relative;

  width: ${p => p.$width ?? `100%`};

  input {
    padding-right: 24px;
  }
`;

const PercentIconWrapper = styled.div`
  position: absolute;
  right: 6px;
  top: 50%;

  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;

  transform: translateY(-50%);
`;

interface Props extends MyInputProps {
  label?: string;
}

const InputWithPercent = observer((props: Props) => {
  const { width, variant, label, ...rest } = props;

  return (
    <MyTooltip label={label} disabled={!Boolean(label)}>
      <Root $width={width}>
        <MyInput variant="outlined" {...rest} />

        <PercentIconWrapper>
          <PercentIcon />
        </PercentIconWrapper>
      </Root>
    </MyTooltip>
  );
});

InputWithPercent.displayName = 'InputWithPercent';
export { InputWithPercent };
