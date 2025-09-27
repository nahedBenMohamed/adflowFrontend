import { routes } from '@/app';
import {
  CardCopiedCountTag,
  InputModel,
  MyInput,
  PencilButton,
  SpanWithEllipsis,
  TruncateMixin,
  debounce,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import type { CellContext } from '@tanstack/react-table';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { RefObject, useCallback, useRef, type KeyboardEventHandler } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useOnClickOutside } from 'usehooks-ts';
import type { SectionTableRow } from '../../../../../models';

const NameWrapper = styled.div<{ $editVisible: boolean }>`
  width: 100%;

  display: flex;
  align-items: center;
  gap: 8px;

  .workspace__PencilButton--Root {
    opacity: ${p => (p.$editVisible ? 1 : 0)};
    scale: ${p => (p.$editVisible ? 1 : 0)};
  }

  &:hover {
    .workspace__PencilButton--Root {
      opacity: 1;
      scale: 1;
    }
  }

  ${TruncateMixin}
`;

const StyledLink = styled(Link)`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--primary-blue);
  transition: var(--transition-200);

  &:hover {
    color: var(--button-text-blue-hover);
  }

  &:active {
    color: var(--button-text-blue-active);
  }

  ${TruncateMixin}
`;

interface Props {
  entityTypeId: number;
  currentPathname: string;
  cellContext: CellContext<SectionTableRow, string>;
  changeName: ({ id, name }: { id: number; name: string }) => void;
}

const NameCell = observer((props: Props) => {
  const { entityTypeId, currentPathname, cellContext, changeName } = props;

  const ref = useRef<HTMLDivElement>(null);

  const name = cellContext.getValue();
  const { entityId, readonly, copiedCount, copiedFrom } = cellContext.row.original;

  const [editMode, { toggle: toggleEditMode, close: hideEditMode }] = useDisclosure(false);

  const model = useLocalObservable(() => InputModel.create(name));

  const handleEnter = useCallback<KeyboardEventHandler<HTMLInputElement>>(
    e => {
      if (e.key !== 'Enter') return;

      hideEditMode();
    },
    [hideEditMode]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChangeName = useCallback(
    debounce(
      ({ name, entityId }: { name: string; entityId: number }) =>
        changeName({ id: entityId, name }),
      500
    ),
    [changeName]
  );

  const onChange = useCallback(
    (name: string) => {
      model.setValue(name);

      handleChangeName({ name, entityId });
    },
    [entityId, model, handleChangeName]
  );

  useOnClickOutside(ref as RefObject<HTMLDivElement>, hideEditMode);

  return (
    <NameWrapper ref={ref} $editVisible={editMode}>
      {editMode && !readonly ? (
        <MyInput
          medium
          autoFocus
          alwaysActive
          model={model}
          variant="outlined"
          handleChange={onChange}
          onKeyDown={handleEnter}
        />
      ) : (
        <StyledLink to={routes.card({ entityTypeId, entityId, from: currentPathname })}>
          <SpanWithEllipsis text={model.value} />
        </StyledLink>
      )}

      {copiedCount && copiedFrom && (
        <CardCopiedCountTag
          copiedFrom={copiedFrom}
          copiedCount={copiedCount}
          entityTypeId={entityTypeId}
        />
      )}

      {!readonly && <PencilButton onClick={toggleEditMode} />}
    </NameWrapper>
  );
});

NameCell.displayName = 'NameCell';
export { NameCell };
