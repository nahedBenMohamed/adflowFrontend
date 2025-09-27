import { useGanttContext } from '@/modules/gantt/context';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div`
  width: 100%;
  height: 60%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;

  padding: 40px 24px;
`;

const EmptyAnnotation = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: center;
  color: var(--button-text-graphite-primary-text);
`;

const EmptyTableBody = () => {
  const { tasksProps } = useGanttContext();

  const { t: t1 } = useTranslation('page.tasks', {
    keyPrefix: 'tasks_page.common.ui.empty_list_block',
  });

  const { t: t2 } = useTranslation('component.section', {
    keyPrefix: 'section.empty_projects_block',
  });

  const annotation = tasksProps ? t1('annotation1') : t2('annotation');

  return (
    <Root>
      <EmptyAnnotation>{annotation}</EmptyAnnotation>
    </Root>
  );
};

export { EmptyTableBody };
