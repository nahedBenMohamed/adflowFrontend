import { entityTypeStore } from '@/app';
import { useGetProductsSections } from '@/modules/products';
import { useGetSchedules } from '@/modules/scheduler';
import { DragFieldIcon, envUtil, MathUtil, MyCheckbox, type Option } from '@/shared';
import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  BuilderStepCheckboxItemWrapper,
  BuilderStepItemLabel,
  BuilderStepOutlinedSection,
  BuilderStepTitle,
  NoLinksBlock,
} from '../../../../shared';
import type { BuilderNavStore, EtSectionBuilderStore } from '../../../../store';
import { BuilderStepTemplate } from '../../../../templates';

const CheckboxesList = styled.div<{ $withoutGap?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LinkedEntitiesWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const SectionItemWrapper = styled.div<{ $dragging?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;

  margin-bottom: 12px;
  transition: opacity var(--transition-200);

  &:last-child {
    margin-bottom: 0;
  }

  ${p => p.$dragging && `opacity: 0.5`};
`;

const DragIconWrapper = styled.div<{ $disabled?: boolean }>`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  ${p => p.$disabled && `opacity: 0.5`};
`;

interface Props {
  sectionBuilderStore: EtSectionBuilderStore;
  navStore: BuilderNavStore;
  saveError?: string;
  onSave: () => void;
}

const EtSectionBuilderStep4 = observer((props: Props) => {
  const { sectionBuilderStore, navStore, saveError, onSave } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.et_section_builder_page.et_section_builder_step4',
  });

  const { getStepByOrder, setStepOrder } = navStore;
  const { data, currentEntityTypeId } = sectionBuilderStore;

  const {
    linkedEntities,
    linkedProductsSectionIds,
    linkedSchedulerIds,
    setLinkedEntities,
    setLinkedSchedulerIds,
    setLinkedProductsSectionIds,
  } = data;

  const { data: productSections, isLoading: areProductSectionsLoading } = useGetProductsSections();

  const { data: schedulers, isLoading: areSchedulesLoading } = useGetSchedules();

  let etSectionsOptions = entityTypeStore.entityTypesOptions.filter(
    o => !linkedEntities.map<number>(l => l.targetId).includes(o.value)
  );

  const productSectionsOptions =
    productSections?.map<Option<number>>(ps => ({
      label: ps.name,
      value: ps.id,
    })) ?? [];

  const schedulersOptions =
    schedulers?.map<Option<number>>(s => ({ label: s.name, value: s.id })) ?? [];

  if (currentEntityTypeId)
    etSectionsOptions = etSectionsOptions.filter(o => o.value !== currentEntityTypeId);

  const currentStep = getStepByOrder(4);

  const handleEtCheckboxChange = (etId: number) => {
    if (linkedEntities.map<number>(l => l.targetId).includes(etId)) {
      setLinkedEntities(linkedEntities.filter(l => l.targetId !== etId));
    } else {
      const maxSortOrder = MathUtil.maxOrZero(linkedEntities.map<number>(b => b.sortOrder));

      setLinkedEntities([
        ...linkedEntities,
        {
          targetId: etId,
          sortOrder: maxSortOrder + 1,
        },
      ]);
    }
  };

  const onDragEnd = ({ source, destination }: DropResult) => {
    if (!destination || destination.index === source.index) return;

    const [moved] = linkedEntities.splice(source.index, 1);

    if (!moved) {
      console.error('Failed to end drag in EtSectionBuilderStep4, nothing was moved');

      return;
    }

    linkedEntities.splice(destination.index, 0, moved);

    linkedEntities.forEach((l, idx) => (l.sortOrder = idx));
  };

  const handleProductsCheckboxChange = (value: number) => {
    if (linkedProductsSectionIds.includes(value)) {
      setLinkedProductsSectionIds(linkedProductsSectionIds.filter(id => id !== value));
    } else {
      setLinkedProductsSectionIds([...linkedProductsSectionIds, value]);
    }
  };

  const handleSchedulersCheckboxChange = (value: number) => {
    if (linkedSchedulerIds.includes(value)) {
      setLinkedSchedulerIds(linkedSchedulerIds.filter(id => id !== value));
    } else {
      setLinkedSchedulerIds([...linkedSchedulerIds, value]);
    }
  };

  return (
    <BuilderStepTemplate
      canGoBack
      error={saveError}
      navStore={navStore}
      currentStep={currentStep}
      setStepOrder={setStepOrder}
      onSave={onSave}
    >
      <BuilderStepTitle>{t('title')}</BuilderStepTitle>

      <BuilderStepOutlinedSection>
        <CheckboxesList>
          <BuilderStepItemLabel label={t('cards')} />

          {etSectionsOptions.length > 0 || linkedEntities.length > 0 ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="workspace__EtSectionBuilderStep4--LinkedEntitiesWrapper">
                {provided => (
                  <LinkedEntitiesWrapper ref={provided.innerRef} {...provided.droppableProps}>
                    {/* Sorting in JSX made intentionally because otherwise DND lags */}
                    {linkedEntities
                      .slice()
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .map((l, idx) => (
                        <Draggable key={l.targetId} index={idx} draggableId={String(l.targetId)}>
                          {(provided, dragSnapshot) => (
                            <SectionItemWrapper
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              $dragging={dragSnapshot.isDragging}
                            >
                              <DragIconWrapper {...provided.dragHandleProps}>
                                <DragFieldIcon />
                              </DragIconWrapper>

                              <BuilderStepCheckboxItemWrapper>
                                <MyCheckbox
                                  checked
                                  onChange={() => handleEtCheckboxChange(l.targetId)}
                                />

                                {entityTypeStore.getById(l.targetId).section.name}
                              </BuilderStepCheckboxItemWrapper>
                            </SectionItemWrapper>
                          )}
                        </Draggable>
                      ))}

                    {provided.placeholder}

                    {etSectionsOptions.map(o => (
                      <SectionItemWrapper key={o.value}>
                        <DragIconWrapper $disabled>
                          <DragFieldIcon />
                        </DragIconWrapper>

                        <BuilderStepCheckboxItemWrapper>
                          <MyCheckbox
                            checked={data.linkedEntities.map(l => l.targetId).includes(o.value)}
                            onChange={() => handleEtCheckboxChange(o.value)}
                          />

                          {entityTypeStore.getById(o.value).section.name}
                        </BuilderStepCheckboxItemWrapper>
                      </SectionItemWrapper>
                    ))}
                  </LinkedEntitiesWrapper>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <NoLinksBlock />
          )}
        </CheckboxesList>
      </BuilderStepOutlinedSection>

      {!envUtil.builderHideMainModules && (
        <>
          <BuilderStepOutlinedSection $loading={areProductSectionsLoading}>
            <CheckboxesList>
              <BuilderStepItemLabel label={t('products')} />

              {productSectionsOptions.length > 0 ? (
                productSectionsOptions.map((o, idx) => (
                  <BuilderStepCheckboxItemWrapper key={idx}>
                    <MyCheckbox
                      checked={data.linkedProductsSectionIds.includes(o.value)}
                      onChange={() => handleProductsCheckboxChange(o.value)}
                    />

                    {o.label}
                  </BuilderStepCheckboxItemWrapper>
                ))
              ) : (
                <NoLinksBlock />
              )}
            </CheckboxesList>
          </BuilderStepOutlinedSection>

          <BuilderStepOutlinedSection $loading={areSchedulesLoading}>
            <CheckboxesList>
              <BuilderStepItemLabel label={t('schedulers')} />

              {schedulersOptions.length > 0 ? (
                schedulersOptions.map((o, idx) => (
                  <BuilderStepCheckboxItemWrapper key={idx}>
                    <MyCheckbox
                      checked={data.linkedSchedulerIds.includes(o.value)}
                      onChange={() => handleSchedulersCheckboxChange(o.value)}
                    />

                    {o.label}
                  </BuilderStepCheckboxItemWrapper>
                ))
              ) : (
                <NoLinksBlock />
              )}
            </CheckboxesList>
          </BuilderStepOutlinedSection>
        </>
      )}
    </BuilderStepTemplate>
  );
});

export { EtSectionBuilderStep4 };
