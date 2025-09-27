import type { Field, FieldGroup, FieldsStore } from '@/modules/fields';
import styled from 'styled-components';
import type { RussianCase } from '../../../../../shared';
import { FieldBlock } from '../FieldBlock/FieldBlock';
import { FieldsGroupWrapper } from '../FieldsGroupWrapper/FieldsGroupWrapper';

const FieldGroupName = styled.p`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

interface Props {
  fieldsStore: FieldsStore;
  fieldGroup: FieldGroup;
  isRussianLocale: boolean;
  generateFieldCode: ({
    field,
    caseValue,
    numberToWord,
  }: {
    field: Field;
    caseValue?: RussianCase;
    numberToWord?: string;
  }) => string;
}

const FieldGroupSection = (props: Props) => {
  const { fieldGroup, fieldsStore, isRussianLocale, generateFieldCode } = props;

  return (
    <FieldsGroupWrapper>
      <FieldGroupName>{fieldGroup.name}</FieldGroupName>

      {fieldsStore.getFieldsByGroupId(fieldGroup.id).map(f => (
        <FieldBlock
          key={f.id}
          field={f}
          isRussianLocale={isRussianLocale}
          generateFieldCode={generateFieldCode}
        />
      ))}
    </FieldsGroupWrapper>
  );
};

export { FieldGroupSection };
