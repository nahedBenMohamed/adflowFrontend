import { HideScrollbarMixin, MyFloatingTooltip, type Stage } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ScrollController } from '../ScrollController/ScrollController';
import { STAGE_ITEM_MARGIN_RIGHT, STAGE_ITEM_WIDTH, StageItem } from './StageItem';
import { SystemStageItem } from './SystemStageItem';

const Root = styled.div`
  height: var(--card-stages-height);

  display: grid;
  flex-shrink: 0;
  grid-template-columns: 1fr 0.1fr;
  align-items: center;
  gap: 18px;

  padding-right: 14px;
  margin-top: var(--card-stages-margin-top);
`;

const StagesWrapper = styled.div`
  position: relative;

  display: flex;

  overflow-x: auto;
  overflow-y: hidden;

  padding-bottom: 2px;

  ${HideScrollbarMixin}
`;

const SystemStagesWrapper = styled.div`
  display: flex;
  gap: 8px;

  margin-left: auto;
`;

const StageList = styled.div`
  display: flex;

  margin-top: 2px;
`;

const ScrollControllerWrapper = styled.div`
  position: sticky;
  top: 2px;
  right: 0px;

  padding-right: 1px;
  background-color: var(--graphite-graphite-20);
  border-radius: var(--border-radius-block) 0 0 var(--border-radius-block);
`;

interface Props {
  stages: Stage[];
  entityStageId: number;
  disabled?: boolean;
  isAdding?: boolean;
  onStageChange: (stageId: number) => void;
}

const generateStageItemRootId = (stageId: number): string => `workspace__StageItem--${stageId}`;

const CardStages = observer((props: Props) => {
  const { stages, entityStageId, disabled, isAdding, onStageChange } = props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.ui.stages',
  });

  const stageListRef = useRef<HTMLDivElement>(null);
  const stagesWrapperRef = useRef<HTMLDivElement>(null);

  const scrollOffset = STAGE_ITEM_WIDTH + STAGE_ITEM_MARGIN_RIGHT;

  const currentStage = stages.find(s => s.id === entityStageId);

  const [hasOverflow, setHasOverflow] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    if (stagesWrapperRef.current && stageListRef.current) {
      const { clientWidth: wrapperWidth } = stagesWrapperRef.current;
      const { clientWidth: listWidth } = stageListRef.current;

      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setHasOverflow(listWidth > wrapperWidth);
    }
  }, [stages]);

  useEffect(() => {
    const calculateScroll = (e: WheelEvent) => {
      if (stagesWrapperRef.current) {
        const { scrollWidth, clientWidth, scrollLeft } = stagesWrapperRef.current;

        setCanScrollLeft(scrollLeft !== 0);
        setCanScrollRight(scrollLeft + clientWidth + 1 < scrollWidth);

        // programmatically scroll on mouse wheel event
        if (stagesWrapperRef.current.contains(e.target as Node)) {
          e.preventDefault();

          stagesWrapperRef.current.scrollLeft += e.deltaY + e.deltaX;
        }
      }
    };

    document.body.addEventListener('wheel', calculateScroll, { passive: false });

    return () => {
      document.body.removeEventListener('wheel', calculateScroll);
    };
  }, []);

  useEffect(() => {
    // scroll into view current stage if it is not visible
    if (!stagesWrapperRef.current) return;

    const currentStageItem = document.getElementById(generateStageItemRootId(entityStageId));

    if (!currentStageItem) return;

    currentStageItem.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
    // we want to scroll only once on first render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scroll = useCallback((direction: 'left' | 'right', offset: number) => {
    if (stagesWrapperRef.current) {
      stagesWrapperRef.current.scrollBy({
        left: direction === 'left' ? -offset : offset,
        behavior: 'smooth',
      });

      setTimeout(() => {
        if (stagesWrapperRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = stagesWrapperRef.current;

          setCanScrollLeft(stagesWrapperRef.current?.scrollLeft !== 0);
          setCanScrollRight(scrollLeft + clientWidth + 1 < scrollWidth);
        }
      }, 350);
    }
  }, []);

  if (!stages.length || !currentStage) return null;

  return (
    <MyFloatingTooltip withinPortal disabled={!isAdding} label={t('disabled_while_adding')}>
      <Root>
        <StagesWrapper ref={stagesWrapperRef}>
          <StageList ref={stageListRef}>
            {stages.map(
              s =>
                !s.isSystem && (
                  <StageItem
                    key={s.id}
                    stage={s}
                    rootId={generateStageItemRootId(s.id)}
                    active={s.sortOrder <= currentStage.sortOrder}
                    clickHandler={disabled ? null : onStageChange}
                  />
                )
            )}
          </StageList>

          {hasOverflow && (
            <ScrollControllerWrapper>
              <ScrollController
                leftButtonDisabled={!canScrollLeft}
                rightButtonDisabled={!canScrollRight}
                scrollLeft={() => scroll('left', scrollOffset)}
                scrollRight={() => scroll('right', scrollOffset)}
              />
            </ScrollControllerWrapper>
          )}
        </StagesWrapper>

        <SystemStagesWrapper>
          {stages.map(
            s =>
              s.isSystem && (
                <SystemStageItem
                  key={s.id}
                  stage={s}
                  currentStage={currentStage}
                  active={s.sortOrder === currentStage.sortOrder}
                  clickHandler={disabled ? null : onStageChange}
                />
              )
          )}
        </SystemStagesWrapper>
      </Root>
    </MyFloatingTooltip>
  );
});

CardStages.displayName = 'CardStages';
export { CardStages };
