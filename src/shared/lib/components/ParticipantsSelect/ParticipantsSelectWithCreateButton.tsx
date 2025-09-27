import { userStore } from '@/app';
import { useDisclosure } from '@mantine/hooks';
import styled from 'styled-components';
import { useWindowSize } from 'usehooks-ts';
import type { MultiselectModel } from '../../models';
import { CreateButton } from '../Buttons/CreateButton/CreateButton';
import { UsersMultiselectDropdown } from '../UsersMultiselectDropdown/UsersMultiselectDropdown';
import { ParticipantsAvatarRows } from './components';

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    cursor: pointer;
  }
`;

interface Props {
  model: MultiselectModel<number>;
  maxAvatarCount?: number;
  handleChange?: (selectedIds: number[]) => void;
}

const ParticipantsSelectWithCreateButton = (props: Props) => {
  const { model, maxAvatarCount, handleChange } = props;

  const [opened, { close, open }] = useDisclosure(false);

  const { width } = useWindowSize();
  const minified = width < 1340;

  const MAX_INDEX = minified ? 4 : 6;

  return (
    <UsersMultiselectDropdown
      width={248}
      withinPortal
      model={model}
      opened={opened}
      disabled={false}
      users={userStore.activeUsers}
      show={open}
      hide={close}
      handleChange={handleChange}
    >
      <Root>
        <CreateButton titleType="add" isButtonFrame active={opened} />

        {model.values.length ? (
          <ParticipantsAvatarRows
            model={model}
            maxAvatarCount={maxAvatarCount ?? MAX_INDEX}
            onChange={handleChange}
          />
        ) : null}
      </Root>
    </UsersMultiselectDropdown>
  );
};

export { ParticipantsSelectWithCreateButton };
