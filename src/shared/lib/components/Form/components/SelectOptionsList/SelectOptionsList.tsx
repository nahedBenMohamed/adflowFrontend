import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react';
import styled from 'styled-components';
import { DropdownScrollbarMixin } from '../../../../mixins';

interface RootProps {
  $transparentScrollbarTrack: boolean;
  $padding?: CSSProperties['padding'];
  $maxHeight?: CSSProperties['maxHeight'];
}

const Root = styled.ul<RootProps>`
  width: 100%;
  max-height: ${p => p.$maxHeight ?? '250px'};

  overflow-y: auto;
  overflow-x: hidden;

  ${DropdownScrollbarMixin}

  padding: ${p => (p.$padding ? p.$padding : '4px 0')};
`;

interface Props extends HTMLAttributes<HTMLUListElement> {
  ref?: Ref<HTMLUListElement>;
  children: ReactNode;
  padding?: CSSProperties['padding'];
  maxHeight?: CSSProperties['maxHeight'];
  transparentScrollbarTrack?: boolean;
}

const SelectOptionsList = (props: Props) => {
  const { ref, children, padding, transparentScrollbarTrack = false, maxHeight, ...rest } = props;

  return (
    <Root
      ref={ref}
      $padding={padding}
      $maxHeight={maxHeight}
      $transparentScrollbarTrack={transparentScrollbarTrack}
      {...rest}
    >
      {children}
    </Root>
  );
};

export { SelectOptionsList };
