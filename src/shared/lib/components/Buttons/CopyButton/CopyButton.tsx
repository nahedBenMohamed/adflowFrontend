import { useClipboard } from '@mantine/hooks';
import { useCallback } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { CheckDoneIcon, CopyContentIcon } from '../../../../assets';

const rotate = keyframes`
  0% {
    transform: rotate(-5deg);
  }
  
  50% {
    transform: rotate(5deg);
  }

  100% {
    transform: rotate(-5deg);
  }
`;

const Root = styled.button<{ $copied: boolean }>`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:hover {
    cursor: pointer;

    svg {
      animation: ${p =>
        p.$copied
          ? 'none'
          : css`
              ${rotate} 0.5s ease infinite
            `};
    }
  }
`;

interface Props {
  copyText: string;
}

const CopyButton = (props: Props) => {
  const { copyText } = props;

  const clipboard = useClipboard({ timeout: 1500 });

  const handleCopyCode = useCallback(() => clipboard.copy(copyText), [copyText, clipboard]);

  return (
    <Root $copied={clipboard.copied} onClick={clipboard.copied ? undefined : handleCopyCode}>
      {clipboard.copied ? <CheckDoneIcon /> : <CopyContentIcon />}
    </Root>
  );
};

export { CopyButton };
