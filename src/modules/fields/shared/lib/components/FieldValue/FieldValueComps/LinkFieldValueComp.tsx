import { UrlUtil } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { LinkIcon } from '../../../../assets';
import type { FieldValueBaseProps, LinkFieldValue } from '../../../models';
import { FieldLinkWrapper } from '../../FieldLinkWrapper/FieldLinkWrapper';
import { FieldTextInput } from '../../FieldTextInput/FieldTextInput';
import { FieldValueTemplate } from '../FieldValueTemplate';

const LinkFieldValueComp = observer((props: FieldValueBaseProps<LinkFieldValue>) => {
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

  const handleChange = useCallback(
    (value: string) => {
      fieldValue.changeValue(value);

      onChange?.(fieldValue);
    },
    [fieldValue, onChange]
  );

  const url = UrlUtil.getUrlFromText(model.value);

  return (
    <FieldValueTemplate
      tableView={tableView}
      settings={fieldSettings}
      filled={fieldValue.filled()}
      alwaysHideIndicator={alwaysHideIndicator}
      rightIndicatorOnMobile={rightIndicatorOnMobile}
    >
      <FieldTextInput
        model={model}
        noActiveShadow
        renderAs="input"
        readonly={readonly}
        placeholder="domain.com"
        Controls={
          url && (
            <FieldLinkWrapper to={url} target="_blank" rel="noopener noreferrer">
              <LinkIcon />
            </FieldLinkWrapper>
          )
        }
        onChange={handleChange}
      />
    </FieldValueTemplate>
  );
});

LinkFieldValueComp.displayName = 'LinkFieldValueComp';
export { LinkFieldValueComp };
