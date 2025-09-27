import type { ProductsSectionType } from '@/modules/products';
import { Tabs } from '@mantine/core';
import type { ProductsReportType, RenderTabs, ReportTabPanelProps } from '../../../../shared';
import { ProductsGeneralReportTemplate } from '../../../../templates';

interface Props extends ReportTabPanelProps {
  productsGeneralReportTabs: RenderTabs<ProductsReportType>[];
}

const ProductsGeneralReportTabPanel = (props: Props) => {
  const { productsGeneralReportTabs, ...rest } = props;

  return productsGeneralReportTabs.map(({ value, reportType }) => {
    const [, entityTypeIdExtracted, productsSectionIdExtracted, productsSectionTypeExtracted] =
      value.split('_');

    const entityTypeId = entityTypeIdExtracted ? Number(entityTypeIdExtracted) : null;
    const productsSectionId = productsSectionIdExtracted
      ? Number(productsSectionIdExtracted)
      : null;

    if (!entityTypeId || !productsSectionId || !productsSectionTypeExtracted)
      throw new Error(
        `Failed to extract entityTypeId and productsSectionId from value ${value}, unable to render ProductsGeneralReportTabPanel`
      );

    return (
      <Tabs.Panel key={value} w="100%" value={value}>
        <ProductsGeneralReportTemplate
          {...rest}
          reportType={reportType}
          entityTypeId={entityTypeId}
          productsSectionId={productsSectionId}
          sectionType={productsSectionTypeExtracted as ProductsSectionType}
        />
      </Tabs.Panel>
    );
  });
};

export { ProductsGeneralReportTabPanel };
