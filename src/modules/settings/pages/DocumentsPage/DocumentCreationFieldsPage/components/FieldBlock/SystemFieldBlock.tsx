import { SelectModel, SpanWithEllipsis } from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import type { RussianCase, SystemFieldType } from '../../../../../shared';
import { FieldCodeBlock } from '../FieldCodeBlock/FieldCodeBlock';
import { RussianCaseSelector } from '../RussianCaseSelector/RussianCaseSelector';
import { FieldBlockRoot } from './FieldBlockRoot';
import { FieldName } from './FieldName';

interface Props {
  systemFieldType: SystemFieldType;
  isRussianLocale: boolean;
  name: string;
  generateSystemFieldCode: ({
    systemFieldType,
    caseValue,
  }: {
    systemFieldType: SystemFieldType;
    caseValue?: RussianCase;
  }) => string;
}

const SystemFieldBlock = observer((props: Props) => {
  const { systemFieldType, isRussianLocale, name, generateSystemFieldCode } = props;

  const caseModel = useLocalObservable(() => SelectModel.create());

  const fieldCode = generateSystemFieldCode({
    systemFieldType,
    caseValue: caseModel.value ?? undefined,
  });

  return (
    <FieldBlockRoot>
      <FieldName>
        <SpanWithEllipsis text={name} />

        {isRussianLocale && <RussianCaseSelector model={caseModel} />}
      </FieldName>

      <FieldCodeBlock fieldCode={fieldCode} />
    </FieldBlockRoot>
  );
});

SystemFieldBlock.displayName = 'SystemFieldBlock';
export { SystemFieldBlock };
