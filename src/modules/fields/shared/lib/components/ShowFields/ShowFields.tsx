import type { DadataBankRequisitesSuggestion, DadataOrgRequisitesSuggestion } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { Field } from '../../../../shared';
import type { FieldSettingsStore, FieldValuesStore } from '../../../../store';
import { FieldValueFormGroup } from '../FieldValue/FieldValueFormGroup';

const Root = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const NoItems = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);

  padding: 4px 0 24px;
`;

interface Props {
  fields: Field[];
  fieldValuesStore: FieldValuesStore;
  disabled?: boolean;
  miniCardView?: boolean;
  mobileColumn?: boolean;
  miniCardStageId?: number;
  hideEmailAction?: boolean;
  fieldSettingsStore?: FieldSettingsStore;
  onSelectBankRequisitesSuggestion?: (suggestion: DadataBankRequisitesSuggestion) => void;
  onSelectOrgRequisitesSuggestion?: (suggestion: DadataOrgRequisitesSuggestion) => void;
}

const ShowFields = observer((props: Props) => {
  const {
    fields,
    fieldValuesStore,
    fieldSettingsStore,
    disabled,
    mobileColumn,
    hideEmailAction,
    onSelectBankRequisitesSuggestion,
    onSelectOrgRequisitesSuggestion,
  } = props;

  const { t } = useTranslation('module.fields', {
    keyPrefix: 'fields.components.show_fields',
  });

  return (
    <Root>
      {fields.length > 0 ? (
        fields.map(f => (
          <FieldValueFormGroup
            key={f.id}
            field={f}
            disabled={disabled}
            mobileColumn={mobileColumn}
            hideEmailAction={hideEmailAction}
            fieldSettingsStore={fieldSettingsStore}
            fieldValue={fieldValuesStore.getOrCreateByField(f)}
            onSelectOrgRequisitesSuggestion={onSelectOrgRequisitesSuggestion}
            onSelectBankRequisitesSuggestion={onSelectBankRequisitesSuggestion}
          />
        ))
      ) : (
        <NoItems>{t('no_fields')}</NoItems>
      )}
    </Root>
  );
});

ShowFields.displayName = 'ShowFields';
export { ShowFields };
