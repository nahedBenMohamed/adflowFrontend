import { useDisclosure } from '@mantine/hooks';
import { useCallback, type FocusEvent } from 'react';
import styled from 'styled-components';
import { MyPopover } from '../../../MyPopover/MyPopover';
import { MyInput, type MyInputProps } from '../MyInput/MyInput';

const Hint = styled.div`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: var(--primary-statuses-white-0);

  padding: 8px;
  background-color: var(--button-text-graphite-primary-text);
`;

interface Props extends MyInputProps {
  hint: string;
  maxLength: number;
}

const MyInputWithLimitedLength = (props: Props) => {
  const { ref, hint, maxLength, handleChange, onFocus, onBlur, ...rest } = props;

  const [hintOpened, { close: hideHint, open: showHint }] = useDisclosure(false);

  const onChange = useCallback(
    (value: string) => {
      if (!hintOpened && value.length === maxLength) {
        showHint();
      } else {
        hideHint();
      }

      handleChange?.(value);
    },
    [hintOpened, maxLength, handleChange, hideHint, showHint]
  );

  const handleFocus = useCallback(
    (e: FocusEvent<HTMLInputElement, Element>) => {
      if (e.target.value.length >= maxLength) showHint();

      onFocus?.(e);
    },
    [maxLength, onFocus, showHint]
  );

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLInputElement, Element>) => {
      if (hintOpened) hideHint();

      onBlur?.(e);
    },
    [hintOpened, onBlur, hideHint]
  );

  return (
    <MyPopover
      withinPortal
      rootWidth="100%"
      borderRadius={4}
      opened={hintOpened}
      position="bottom-start"
      Target={
        <MyInput
          ref={ref}
          {...rest}
          maxLength={maxLength}
          onBlur={handleBlur}
          onFocus={handleFocus}
          handleChange={onChange}
        />
      }
    >
      <Hint>{hint}</Hint>
    </MyPopover>
  );
};

export { MyInputWithLimitedLength };
