import { BooleanModel, MySwitchWithModel, throttle } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FieldCode, PROJECT_FIELDS_CODES, ProjectFieldsSettings } from '../../../../../models';

const Root = styled.div`
  width: 200px;

  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ItemLabel = styled.label`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

interface FieldSettings {
  name: string;
  code: string;
  active: boolean;
}

interface Props {
  activeProjectFieldCodes: FieldCode[];
  onChange: (fieldsSettings: ProjectFieldsSettings) => void;
}

const ProjectFieldsSettingsComponent = observer((props: Props) => {
  const { activeProjectFieldCodes, onChange } = props;

  const { t } = useTranslation('module.fields', {
    keyPrefix: 'fields.project_fields_block',
  });

  const getField = useCallback(
    ({ name, code }: { name: string; code: FieldCode }): FieldSettings => ({
      name,
      code,
      active: activeProjectFieldCodes.includes(code),
    }),
    [activeProjectFieldCodes]
  );

  const fields = useMemo<FieldSettings[]>(
    () => [
      getField({ name: t('value'), code: FieldCode.VALUE }),
      getField({ name: t('participants'), code: FieldCode.PARTICIPANTS }),
      getField({ name: t('start_date'), code: FieldCode.START_DATE }),
      getField({ name: t('end_date'), code: FieldCode.END_DATE }),
      getField({ name: t('description'), code: FieldCode.DESCRIPTION }),
    ],
    [getField, t]
  );

  const getThrottledChangeHandler = useCallback(
    (field: FieldSettings) =>
      throttle((active: boolean) => {
        field.active = active;

        const activeCodes = PROJECT_FIELDS_CODES.filter(
          c => fields.find(f => f.code === c)?.active
        );

        onChange(new ProjectFieldsSettings(activeCodes));
      }, 300),
    [fields, onChange]
  );

  return (
    <Root>
      {fields.map(ef => (
        <Item key={ef.code}>
          <ItemLabel htmlFor={ef.code}>{ef.name}</ItemLabel>

          <MySwitchWithModel
            inputId={ef.code}
            model={BooleanModel.create(ef.active)}
            onChange={getThrottledChangeHandler(ef)}
          />
        </Item>
      ))}
    </Root>
  );
});

ProjectFieldsSettingsComponent.displayName = 'ProjectFieldsSettingsComponent';
export { ProjectFieldsSettingsComponent };
