import type { Entity, Nullable } from '@/shared';
import { useMemo, useState, type ReactNode } from 'react';
import { MakeCallContext } from './MakeCallContext';

interface Props {
  children: ReactNode;
}

const MakeCallProvider = (props: Props) => {
  const { children } = props;

  const [entity, setEntity] = useState<Nullable<Entity>>(null);
  const [linkedEntity, setLinkedEntity] = useState<Nullable<Entity>>(null);

  const contextValue = useMemo(
    () => ({
      entity,
      linkedEntity,
      setEntity,
      setLinkedEntity,
    }),
    [entity, linkedEntity]
  );

  return <MakeCallContext.Provider value={contextValue}>{children}</MakeCallContext.Provider>;
};

export { MakeCallProvider };
