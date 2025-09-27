import {
  AutomationBlock,
  type AutomationStore,
  getActionTypeEntityTypeInfos,
} from '@/modules/automation';
import {
  BoardType,
  ColorPicker,
  ColorUtil,
  debounce,
  DeleteButton,
  DragIcon,
  InputModel,
  MiniLoader,
  MyInputWithLimitedLength,
  type Option,
  SelectModel,
  Stage,
} from '@/shared';
import type { DraggableProvided } from '@hello-pangea/dnd';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import type { BoardSettingsStore } from '../../../../store';
import { DeleteStageWarningModal } from '../DeleteStageWarningModal/DeleteStageWarningModal';

interface RootProps {
  $system: boolean;
  $dragging: boolean;
  $loading: boolean;
}

const Root = styled.div<RootProps>`
  position: relative;

  min-width: 179px;

  display: flex;
  flex-direction: column;

  padding-top: 4px;
  border-radius: var(--border-radius-block);
  margin-right: ${p => (p.$system ? '11px' : '45px')};

  ${p => p.$dragging && `opacity: 0.4`};

  ${p =>
    p.$loading &&
    css`
      opacity: 0.5;

      pointer-events: none;
    `}
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;

  padding: 0 4px 8px;
`;

const Divider = styled.div<{ $color?: string }>`
  height: 4px;

  border-radius: var(--border-radius-block);
  background-color: ${p => p.$color ?? 'var(--primary-blue)'};
  transition: background-color var(--transition-200);
`;

const TopRowLeftBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const DragIconWrapper = styled.div`
  width: 16px;
  height: 16px;
`;

const StageActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const AutomationBlocksWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

interface Props {
  isSystem: boolean;
  boardType: BoardType;
  stage: Stage;
  store: BoardSettingsStore;
  automationStore?: AutomationStore;
  dragHandleProps?: DraggableProvided['dragHandleProps'];
}

const STAGE_NAME_MAX_LENGTH = 50;

const actionTypeEntityTypeInfos = getActionTypeEntityTypeInfos();

const StageColumn = observer((props: Props) => {
  const { isSystem, boardType, stage, store, automationStore, dragHandleProps } = props;

  const { t } = useTranslation('page.board-settings', {
    keyPrefix: 'board_settings.ui',
  });

  const [isDeleteWarningOpened, { close: hideDeleteWarning, open: showDeleteWarning }] =
    useDisclosure(false);
  const [hintOpened, { close: hideHint, open: showHint }] = useDisclosure(false);
  const [stageColor, setStageColor] = useState<string>(() =>
    ColorUtil.getProcessedBGColor(stage.color)
  );

  const stageName = useLocalObservable(() => InputModel.create(stage.name).required());
  const selectedStage = useLocalObservable<SelectModel>(() => SelectModel.create());

  // if id is less that 0, stage is created on frontend and not yet loaded from back
  // the main reason for this is optimistic stage creation
  const isLoading = stage.id < 0;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateStage = useCallback(
    debounce(() => {
      store.updateStage(stage);
    }, 500),
    [stage, store]
  );

  const handleStageDeleteApprove = () => {
    store.deleteStage({
      boardId: store.boardId,
      stageId: stage.id,
      newStageId: selectedStage.value,
    });

    selectedStage.setValue(null);

    hideDeleteWarning();
  };

  const handleHideDeleteWarning = () => {
    hideDeleteWarning();
    selectedStage.setValue(null);
  };

  const handleStageNameChange = (value: string) => {
    if (!hintOpened && value.length === STAGE_NAME_MAX_LENGTH) {
      showHint();
    } else {
      hideHint();
    }

    stageName.validate();

    stage.name = value;
    debouncedUpdateStage();
  };

  const handleChangeColor = (color: string) => {
    stage.color = color;

    debouncedUpdateStage();

    setStageColor(color);
  };

  const newStageOptions = store.stages
    .filter(s => s.id !== stage.id)
    .map<Option<number>>(s => ({
      value: s.id,
      label: s.name,
    }));

  return (
    <Root $dragging={false} $system={isSystem} $loading={isLoading}>
      <Header>
        <TopRow>
          <TopRowLeftBlock>
            {!stage.isSystem && dragHandleProps && (
              <DragIconWrapper {...dragHandleProps}>
                <DragIcon />
              </DragIconWrapper>
            )}

            <MyInputWithLimitedLength
              medium
              model={stageName}
              maxLength={STAGE_NAME_MAX_LENGTH}
              hint={t('stage_name_hint', { length: STAGE_NAME_MAX_LENGTH })}
              handleChange={handleStageNameChange}
            />
          </TopRowLeftBlock>

          <StageActions>
            <ColorPicker color={stageColor} onChange={handleChangeColor} />

            {!stage.isSystem && isLoading && (
              <MiniLoader color="var(--primary-statuses-green-520)" />
            )}
            {!stage.isSystem && !isLoading && <DeleteButton onClick={showDeleteWarning} />}
          </StageActions>
        </TopRow>

        <Divider $color={stageColor} />
      </Header>

      {boardType === BoardType.ENTITY_TYPE && (
        <AutomationBlocksWrapper>
          {automationStore &&
            actionTypeEntityTypeInfos.map(a => (
              <AutomationBlock
                key={a.type}
                type={a.type}
                stageId={stage.id}
                headerColor={stageColor}
                automationStore={automationStore}
                automations={automationStore.getByTypeAndStageId({
                  type: a.type,
                  stageId: stage.id,
                })}
              />
            ))}
        </AutomationBlocksWrapper>
      )}

      <DeleteStageWarningModal
        options={newStageOptions}
        selectedStage={selectedStage}
        isOpened={isDeleteWarningOpened}
        onApprove={handleStageDeleteApprove}
        onClose={handleHideDeleteWarning}
      />
    </Root>
  );
});

StageColumn.displayName = 'StageColumn';
export { StageColumn };
