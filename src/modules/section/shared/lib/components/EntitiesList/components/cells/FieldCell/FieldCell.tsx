import { FieldValueSwitch, type Field, type PossibleFieldValue } from '@/modules/fields';
import { debounce, type Nullable } from '@/shared';
import type { CellContext } from '@tanstack/react-table';
import { observer } from 'mobx-react-lite';
import { useCallback, useLayoutEffect, useState } from 'react';
import type { SectionTableRow } from '../../../../../models';
import { FieldUnavailable } from '../FieldUnavailable/FieldUnavailable';

export type ChangeFieldValueHandler = ({
  fieldValue,
  entityId,
}: {
  fieldValue: PossibleFieldValue;
  entityId: number;
}) => Promise<void>;

interface Props {
  field: Field;
  fieldSyntheticId: string;
  cellContext: CellContext<SectionTableRow, unknown>;
  handleChangeFieldValue: ChangeFieldValueHandler;
}

const FieldCell = observer((props: Props) => {
  const { field, fieldSyntheticId, cellContext, handleChangeFieldValue } = props;

  const { readonly, fields, entityId } = cellContext.row.original;

  const [fieldValue, setFieldValue] = useState<Nullable<PossibleFieldValue>>(null);

  useLayoutEffect(() => {
    setFieldValue(fields[fieldSyntheticId] ?? null);
  }, [fields, fieldSyntheticId]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChangeField = useCallback(
    debounce(
      ({ fieldValue, entityId }: { fieldValue: PossibleFieldValue; entityId: number }) =>
        handleChangeFieldValue({ entityId, fieldValue }),
      350
    ),
    []
  );

  const onChange = useCallback(
    (fieldValue: PossibleFieldValue) => {
      setFieldValue(fieldValue);

      handleChangeField({ fieldValue, entityId });
    },
    [entityId, handleChangeField]
  );

  if (!fieldValue) return <FieldUnavailable />;

  return (
    <FieldValueSwitch
      tableView
      field={field}
      readonly={readonly}
      fieldValue={fieldValue}
      onChange={onChange}
    />
  );
});

FieldCell.displayName = 'FieldCell';
export { FieldCell };
