import { RequestSetupFormButton } from '@/modules/settings';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { AddItemForm } from '../../../../../shared';
import { CreateDepartmentDto } from '../../../api';
import { departmentsSettingsStore } from '../../../store';
import { SettingsPageTemplate } from '../../../templates';
import { DepartmentBlock } from './components';

const Root = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 16px;

  padding-bottom: 16px;
`;

const TopBlock = styled.div`
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`;

const WorkingTimeHeadingWrapper = styled.div`
  min-width: 152px;

  display: flex;
  justify-content: center;
  align-items: center;

  margin-right: 88px;
`;

const WorkingTimeHeading = styled.p`
  font-size: 14px;
  font-weight: 500;
  line-height: 17px;
  white-space: nowrap;
  color: var(--graphite-graphite-840);
`;

const EditDepartmentsPage = observer(() => {
  const { departments, addDepartment, updateDepartment, deleteDepartment } =
    departmentsSettingsStore;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.edit_groups_page',
  });

  const [workingTimeHeadingShown, { open: showWorkingTimeHeading, close: hideWorkingTimeHeading }] =
    useDisclosure(true);

  const handleAddDepartment = async (name: string): Promise<void> => {
    const dto = new CreateDepartmentDto({ name, parentId: null });

    await addDepartment(dto);
  };

  return (
    <SettingsPageTemplate
      pageTitleKey="settings.user_departments"
      Controls={<RequestSetupFormButton titleKey="request_setup" />}
    >
      <Root>
        <TopBlock>
          <AddItemForm
            placeholder={t('placeholders.group')}
            buttonText={t('add_new_group')}
            onAdd={handleAddDepartment}
            onOpen={hideWorkingTimeHeading}
            onClose={showWorkingTimeHeading}
          />

          {Boolean(workingTimeHeadingShown && departments.length > 0) && (
            <WorkingTimeHeadingWrapper>
              <WorkingTimeHeading>{t('working_time')}</WorkingTimeHeading>
            </WorkingTimeHeadingWrapper>
          )}
        </TopBlock>

        {departments.map((d, idx) => (
          <DepartmentBlock
            key={d.id}
            department={d}
            defaultOpened={idx === 0}
            addDepartment={addDepartment}
            updateDepartment={updateDepartment}
            deleteDepartment={deleteDepartment}
          />
        ))}
      </Root>
    </SettingsPageTemplate>
  );
});

EditDepartmentsPage.displayName = 'EditDepartmentsPage';
export { EditDepartmentsPage };
