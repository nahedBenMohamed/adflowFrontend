import { Tabs } from '@mantine/core';
import { ProjectReportType, type RenderTabs, type ReportTabPanelProps } from '../../../../shared';
import {
  ProjectEntitiesReportTemplate,
  ProjectTaskUserReportTemplate,
} from '../../../../templates';

interface Props extends ReportTabPanelProps {
  entityTypeId: number;
  projectReportTabs: RenderTabs<ProjectReportType>[];
}

const ProjectReportTabPanel = (props: Props) => {
  const { projectReportTabs, ...rest } = props;

  return projectReportTabs.map(({ value }) => (
    <Tabs.Panel key={value} w="100%" value={value}>
      {value.includes('_') ? (
        <ProjectTaskUserReportTemplate
          {...rest}
          reportType={ProjectReportType.PROJECT_TASK_USERS}
        />
      ) : (
        <ProjectEntitiesReportTemplate {...rest} reportType={ProjectReportType.PROJECT_ENTITIES} />
      )}
    </Tabs.Panel>
  ));
};

export { ProjectReportTabPanel };
