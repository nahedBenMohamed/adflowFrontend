import { TextEditorWrapper } from '@/modules/card';
import { FunctionalTextEditor } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import type { FieldValueBaseProps, TextFieldValue } from '../../../models';
import { FieldValueTemplate } from '../FieldValueTemplate';

const RichTextFieldValueComp = observer((props: FieldValueBaseProps<TextFieldValue>) => {
  const {
    readonly,
    tableView,
    fieldValue,
    fieldSettings,
    alwaysHideIndicator,
    rightIndicatorOnMobile,
    onChange,
  } = props;

  const model = fieldValue.model;

  const [focused, { open: handleFocus, close: handleBlur }] = useDisclosure(false);

  const handleChange = useCallback(
    (value: string) => {
      fieldValue.changeValue(value);

      onChange?.(fieldValue);
    },
    [fieldValue, onChange]
  );

  return (
    <FieldValueTemplate
      tableView={tableView}
      settings={fieldSettings}
      filled={fieldValue.filled()}
      alwaysHideIndicator={alwaysHideIndicator}
      rightIndicatorOnMobile={rightIndicatorOnMobile}
    >
      <TextEditorWrapper $padding="4px 8px" $focused={focused}>
        <FunctionalTextEditor
          model={model}
          placeholder="..."
          disabled={readonly}
          toolbarWithoutHeadings
          hideToolbarContainer={tableView}
          forceRootContentHeight={tableView}
          contentMaxHeight={tableView ? '18px' : '80px'}
          variant="without-border"
          onBlur={handleBlur}
          onFocus={handleFocus}
          showSubControls={!tableView}
          handleChange={handleChange}
        />
      </TextEditorWrapper>
    </FieldValueTemplate>
  );
});

RichTextFieldValueComp.displayName = 'RichTextFieldValueComp';
export { RichTextFieldValueComp };
