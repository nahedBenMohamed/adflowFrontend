import { ProductCategoriesBlock, ProductCategoryStore } from '@/modules/products';
import { observer } from 'mobx-react-lite';
import { useLayoutEffect, useMemo } from 'react';
import type { BuilderNavStore } from '../../../../store';
import { BuilderStepTemplate } from '../../../../templates';

interface Props {
  sectionId: number;
  navStore: BuilderNavStore;
  moduleId?: number;
  saveError?: string;
  onSave?: () => void;
}

const ProductsSectionBuilderStep2 = observer((props: Props) => {
  const { sectionId, navStore, moduleId, saveError, onSave } = props;

  const productCategoryStore = useMemo(() => new ProductCategoryStore(sectionId), [sectionId]);

  useLayoutEffect(() => {
    if (moduleId) {
      productCategoryStore.loadData();
    } else {
      productCategoryStore.isLoaded = true;
    }
  }, [moduleId, productCategoryStore]);

  const { getStepByOrder, navigateToNextStep, setStepOrder } = navStore;

  const currentStep = getStepByOrder(2);

  return (
    <BuilderStepTemplate
      canGoBack
      error={saveError}
      navStore={navStore}
      currentStep={currentStep}
      onSave={onSave}
      onNext={navigateToNextStep}
      setStepOrder={setStepOrder}
    >
      <ProductCategoriesBlock
        showSkeleton={Boolean(moduleId)}
        productCategoryStore={productCategoryStore}
      />
    </BuilderStepTemplate>
  );
});

export { ProductsSectionBuilderStep2 };
