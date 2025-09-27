import { generalSettingsStore } from '@/app';
import {
  AddFilledButton,
  InputModel,
  PhoneFormat,
  type Optional,
  type SearchDuplicatesProps,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useCardFieldHelperContext, useDuplicatesContext } from '../../../../../../../context';
import type { FieldValueBaseProps, MultitextFieldValue } from '../../../../../models';
import { MultitextFieldsWrapper } from '../components';
import { PhoneFieldValueCompItem } from './components';

const PhoneFieldValueComp = observer((props: FieldValueBaseProps<MultitextFieldValue>) => {
  const {
    readonly,
    tableView,
    fieldValue,
    fieldSettings,
    alwaysHideIndicator,
    rightIndicatorOnMobile,
    onChange,
  } = props;

  const models = fieldValue.model;

  const { accountSettings } = generalSettingsStore;

  const duplicatesContextValue = useDuplicatesContext();
  const helperContext = useCardFieldHelperContext();

  const handleChange = useCallback(() => {
    const values = models.map<string>(m => m.value);

    fieldValue.changeValues(values.filter(i => i.length > 0));

    onChange?.(fieldValue);
  }, [fieldValue, models, onChange]);

  const isInternationalPhoneFormat = accountSettings?.phoneFormat === PhoneFormat.INTERNATIONAL;

  const handleAddField = useCallback(
    () =>
      models.push(
        isInternationalPhoneFormat ? InputModel.create().phoneInternational() : InputModel.create()
      ),
    [models, isInternationalPhoneFormat]
  );
  const searchDuplicatesProps = useMemo<Optional<SearchDuplicatesProps>>(
    () =>
      duplicatesContextValue
        ? {
            entityTypeId: duplicatesContextValue.entityTypeId,
            searchDuplicates: duplicatesContextValue.searchDuplicates,
            excludeEntitiesId: duplicatesContextValue.excludeEntitiesIds,
            changeEntityCb: duplicatesContextValue.changeEntityCb,
          }
        : undefined,
    [duplicatesContextValue]
  );

  const isListView = helperContext?.isListView ?? false;

  return (
    <MultitextFieldsWrapper>
      {models.map((m, idx) => {
        if (tableView && idx > 0) return null;

        return (
          <PhoneFieldValueCompItem
            key={idx}
            idx={idx}
            model={m}
            disabled={readonly}
            tableView={tableView}
            fieldSettings={fieldSettings}
            alwaysHideIndicator={alwaysHideIndicator}
            searchDuplicatesProps={searchDuplicatesProps}
            rightIndicatorOnMobile={rightIndicatorOnMobile}
            handleChange={handleChange}
          />
        );
      })}

      {(!tableView || !models.length) && !readonly && (
        <AddFilledButton withLeftMargin={!isListView && !tableView} onClick={handleAddField} />
      )}
    </MultitextFieldsWrapper>
  );
});

PhoneFieldValueComp.displayName = 'PhoneFieldValueComp';
export { PhoneFieldValueComp };
