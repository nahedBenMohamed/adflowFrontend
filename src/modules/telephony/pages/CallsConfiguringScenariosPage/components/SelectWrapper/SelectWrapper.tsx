import type { Option } from '@/shared';
import { MySelect, type MySelectProps } from '@/shared';
import {
  SelectWrapperTemplate,
  type SelectWrapperTemplateProps,
} from '../SelectWrapperTemplate/SelectWrapperTemplate';

interface Props<O extends Option> extends Omit<SelectWrapperTemplateProps, 'children'> {
  selectProps: MySelectProps<O>;
}

const SelectWrapper = <O extends Option>(props: Props<O>) => {
  const { selectProps, disabledProps, ...rest } = props;

  return (
    <SelectWrapperTemplate disabledProps={disabledProps} {...rest}>
      <MySelect
        width="272px"
        variant="outlined"
        hiddenlyDisabled={disabledProps?.disabled}
        {...selectProps}
      />
    </SelectWrapperTemplate>
  );
};

export { SelectWrapper };
