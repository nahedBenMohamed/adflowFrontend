import { SelectModel, SpanWithEllipsis, type Nullable } from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { FieldCodeBlock } from '../FieldCodeBlock/FieldCodeBlock';
import { NumberToWordSelector } from '../NumberToWordSelector/NumberToWordSelector';
import { FieldBlockRoot } from './FieldBlockRoot';
import { FieldName } from './FieldName';

interface Props {
  name?: string;
  defaultCode?: string;
  boldName?: boolean;
  showNumberToWordSelector?: boolean;
  generateFieldCode?: ({
    defaultCode,
    numberToWord,
  }: {
    defaultCode: string;
    numberToWord?: string;
  }) => string;
}

const OrderFieldBlock = observer((props: Props) => {
  const { name = '', defaultCode, boldName, showNumberToWordSelector, generateFieldCode } = props;

  const numberToWordModel = useLocalObservable(() => SelectModel.create());

  const fieldCode: Nullable<string> =
    defaultCode && generateFieldCode
      ? generateFieldCode({
          defaultCode,
          numberToWord: numberToWordModel.value ?? undefined,
        })
      : null;

  return (
    <FieldBlockRoot>
      <FieldName>
        <SpanWithEllipsis bold={boldName} text={name} />

        {showNumberToWordSelector && <NumberToWordSelector model={numberToWordModel} />}
      </FieldName>

      {fieldCode && <FieldCodeBlock fieldCode={fieldCode} />}
    </FieldBlockRoot>
  );
});

OrderFieldBlock.displayName = 'OrderFieldBlock';
export { OrderFieldBlock };
