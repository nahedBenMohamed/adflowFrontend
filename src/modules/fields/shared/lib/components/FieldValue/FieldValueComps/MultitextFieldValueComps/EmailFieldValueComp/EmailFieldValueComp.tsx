import { AddFilledButton, InputModel } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import {
  useCardFieldHelperContext,
  useDuplicatesContext,
  useSendEmailContext,
} from '../../../../../../../context';
import { SendEmailIcon } from '../../../../../../assets';
import type { FieldValueBaseProps, MultitextFieldValue } from '../../../../../models';
import { FieldLinkWrapper } from '../../../../FieldLinkWrapper/FieldLinkWrapper';
import { MultitextFieldValueCompTemplate, MultitextFieldsWrapper } from '../components';
import { EmailFieldInput } from './components';

interface Props extends FieldValueBaseProps<MultitextFieldValue> {
  hideEmailAction?: boolean;
}

const EmailFieldValueComp = observer((props: Props) => {
  const {
    readonly,
    tableView,
    fieldValue,
    fieldSettings,
    hideEmailAction,
    alwaysHideIndicator,
    rightIndicatorOnMobile,
    onChange,
  } = props;

  const models = fieldValue.model;

  const emailContextValue = useSendEmailContext();
  const helperContext = useCardFieldHelperContext();
  const duplicatesContextValue = useDuplicatesContext();

  const handleChange = useCallback(() => {
    const values = models.map(m => m.value);

    fieldValue.changeValues(values.filter(i => i.length > 0));

    onChange?.(fieldValue);
  }, [fieldValue, models, onChange]);

  const handleAddField = useCallback(
    () => models.push(InputModel.create().emailRFC5322()),
    [models]
  );

  const isListView = helperContext?.isListView ?? false;

  return (
    <MultitextFieldsWrapper>
      {models.map((m, idx) => {
        if (tableView && idx > 0) return null;

        return (
          <MultitextFieldValueCompTemplate
            key={idx}
            tableView={tableView}
            filled={m.value.length > 0}
            fieldSettings={fieldSettings}
            alwaysHideIndicator={alwaysHideIndicator}
            rightIndicatorOnMobile={rightIndicatorOnMobile}
          >
            <EmailFieldInput
              model={m}
              readonly={readonly}
              searchDuplicateProps={
                duplicatesContextValue
                  ? {
                      entityTypeId: duplicatesContextValue.entityTypeId,
                      searchDuplicates: duplicatesContextValue.searchDuplicates,
                      excludeEntitiesId: duplicatesContextValue.excludeEntitiesIds,
                      changeEntityCb: duplicatesContextValue.changeEntityCb,
                    }
                  : undefined
              }
              Controls={
                !tableView &&
                !hideEmailAction && (
                  <FieldLinkWrapper
                    as="div"
                    onClick={
                      emailContextValue
                        ? () => emailContextValue.openSendEmailModal(m.value)
                        : undefined
                    }
                  >
                    <SendEmailIcon />
                  </FieldLinkWrapper>
                )
              }
              handleChange={handleChange}
            />
          </MultitextFieldValueCompTemplate>
        );
      })}

      {(!tableView || !models.length) && !readonly && (
        <AddFilledButton withLeftMargin={!isListView && !tableView} onClick={handleAddField} />
      )}
    </MultitextFieldsWrapper>
  );
});

EmailFieldValueComp.displayName = 'EmailFieldValueComp';
export { EmailFieldValueComp };
