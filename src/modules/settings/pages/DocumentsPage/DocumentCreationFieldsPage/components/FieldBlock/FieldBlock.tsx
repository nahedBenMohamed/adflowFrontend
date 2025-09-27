import type { Field } from '@/modules/fields';
import { FieldType, SelectModel, SpanWithEllipsis } from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import type { RussianCase } from '../../../../../shared';
import { FieldCodeBlock } from '../FieldCodeBlock/FieldCodeBlock';
import { NumberToWordSelector } from '../NumberToWordSelector/NumberToWordSelector';
import { RussianCaseSelector } from '../RussianCaseSelector/RussianCaseSelector';
import { FieldBlockRoot } from './FieldBlockRoot';
import { FieldName } from './FieldName';

interface Props {
  field: Field;
  isRussianLocale: boolean;
  name?: string;
  defaultLanguage?: string;
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

const FieldBlock = observer((props: Props) => {
  const { field, isRussianLocale, name, generateFieldCode } = props;

  const showCaseSelector = isRussianLocale && field.type === FieldType.TEXT;
  const caseModel = useLocalObservable(() => SelectModel.create());

  const showNumberToWordSelector =
    field.type === FieldType.NUMBER || field.type === FieldType.VALUE;
  const numberToWordModel = useLocalObservable(() => SelectModel.create());

  const fieldCode = generateFieldCode({
    field,
    caseValue: caseModel.value ?? undefined,
    numberToWord: numberToWordModel.value ?? undefined,
  });

  return (
    <FieldBlockRoot>
      <FieldName>
        <SpanWithEllipsis text={name ?? field.name} />

        {showCaseSelector && <RussianCaseSelector model={caseModel} />}

        {showNumberToWordSelector && <NumberToWordSelector model={numberToWordModel} />}
      </FieldName>

      <FieldCodeBlock fieldCode={fieldCode} />
    </FieldBlockRoot>
  );
});

FieldBlock.displayName = 'FieldBlock';
export { FieldBlock };
