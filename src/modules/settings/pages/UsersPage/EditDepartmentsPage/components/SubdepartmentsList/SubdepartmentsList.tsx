import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { AddItemForm } from '../../../../../../../shared';
import { CreateDepartmentDto, type UpdateDepartmentDto } from '../../../../../api';
import type { Department } from '../../../../../shared';
import { SubdepartmentItem } from '../SubdepartmentItem/SubdepartmentItem';

const Root = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

interface Props {
  parentId: number;
  subdepartments: Department[];
  onAdd: (dto: CreateDepartmentDto) => Promise<void>;
  onUpdate: ({ id, dto }: { id: number; dto: UpdateDepartmentDto }) => Promise<void>;
  onDelete: ({ id, newDepartmentId }: { id: number; newDepartmentId?: number }) => Promise<void>;
}

const SubdepartmentsList = observer((props: Props) => {
  const { parentId, subdepartments, onAdd, onUpdate, onDelete } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.edit_groups_page',
  });

  const add = async (name: string): Promise<void> => {
    const dto = new CreateDepartmentDto({ name, parentId });

    await onAdd(dto);
  };

  return (
    <Root>
      {subdepartments.map(s => (
        <SubdepartmentItem key={s.id} subdepartment={s} onUpdate={onUpdate} onDelete={onDelete} />
      ))}

      <AddItemForm
        placeholder={t('placeholders.new_subgroup')}
        buttonText={t('add_subgroup')}
        onAdd={add}
      />
    </Root>
  );
});

SubdepartmentsList.displayName = 'SubdepartmentsList';
export { SubdepartmentsList };
