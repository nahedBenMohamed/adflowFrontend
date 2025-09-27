import { entityTypeStore } from '@/app';
import { type LinkedEntityStore } from '@/modules/card';
import {
  type FieldsStore,
  type MultitextFieldValue,
  type PossibleFieldValue,
} from '@/modules/fields';
import { useMemo } from 'react';
import { FieldType, type Entity } from '../models';
import type { Option } from '../models/Option';
import type { Nullable } from '../types';
import { UuidUtil } from '../utils';

export const useGetEntityEmailOptions = ({
  entity,
  fieldsStore,
  linkedEntityStore,
}: {
  entity: Nullable<Entity>;
  fieldsStore: FieldsStore;
  linkedEntityStore: LinkedEntityStore;
}): Option<string>[] =>
  useMemo(() => {
    if (!entity) return [];

    // entity email field values
    const entityEmailFields = fieldsStore.findByType(FieldType.EMAIL);
    const entityEmailFieldsOptions = entity.fieldValues
      .filter(fv => entityEmailFields.map<number>(f => f.id).includes(fv.fieldId))
      .flatMap<
        Option<string>
      >(fv => (fv as MultitextFieldValue).values.map(v => ({ value: UuidUtil.generate(), label: v })));

    // linked entities email field values
    const linkedEntitiesEmailFieldsIds = entityTypeStore
      .getById(entity.entityTypeId)
      .linkedEntityTypes.flatMap(linkedEt =>
        entityTypeStore
          .getById(linkedEt.targetId)
          .fields.filter(f => f.type === FieldType.EMAIL)
          .map<number>(f => f.id)
      );

    const linkedEntitiesEmails = linkedEntityStore.entityForms
      .flatMap<PossibleFieldValue>(f =>
        f.fieldValuesStore.fieldValues.filter(fv =>
          linkedEntitiesEmailFieldsIds.includes(fv.fieldId)
        )
      )
      .flatMap<
        Option<string>
      >(fv => (fv as MultitextFieldValue).values.map(v => ({ value: UuidUtil.generate(), label: v })));

    return [...entityEmailFieldsOptions, ...linkedEntitiesEmails];
  }, [entity, fieldsStore, linkedEntityStore.entityForms]);
