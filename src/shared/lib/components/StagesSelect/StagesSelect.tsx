import { boardApiUtil, stageApiUtil } from '@/app';
import {
  NoOptionsMessage,
  ProjectBoardIcon,
  type Board,
  type Optional,
  type Stage,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { Fragment, useCallback, useMemo, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { useDropdownWidth } from '../../hooks';
import { DropdownScrollbarMixin, TruncateMixin } from '../../mixins';
import {
  MultiselectModel,
  StageCode,
  type MySelectTitleRootVariant,
  type SelectModel,
} from '../../models';
import { MyCheckbox } from '../Form/MyCheckbox/MyCheckbox';
import { MySelectCustomTemplate } from '../Form/MySelect/MySelectCustomTemplate/MySelectCustomTemplate';
import { SpanWithEllipsis } from '../SpanWithEllipsis/SpanWithEllipsis';

const Root = styled.div`
  max-height: 320px;

  display: flex;
  flex-direction: column;

  ${DropdownScrollbarMixin}

  padding: 0 8px;
`;

const BoardIconWrapper = styled.div`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const StageIndicatorWrapper = styled(BoardIconWrapper)<{ $bgColor: string }>`
  span {
    width: 14px;
    height: 14px;

    border-radius: 50%;
    background-color: ${p => p.$bgColor};
  }
`;

interface CheckboxWrapperProps {
  $stage?: boolean;
  $hoverable?: boolean;
}

const CheckboxWrapper = styled.label<CheckboxWrapperProps>`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 8px;

  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  padding: 8px;

  ${p =>
    p.$hoverable &&
    css`
      &:hover {
        cursor: pointer;
      }
    `};

  ${p =>
    p.$stage &&
    css`
      font-weight: 400;

      padding-left: 24px;
    `};

  ${TruncateMixin}
`;

const Delimiter = styled.hr`
  width: 100%;

  border-top: 1px solid var(--graphite-graphite-80);
`;

type MultiselectChangeHandler = (stagesIds: number[]) => void;
type SelectChangeHandler = (stageId: number) => void;

interface Props<M extends SelectModel | MultiselectModel<number>> {
  model: M;
  entityTypeId: number;
  stageCascade?: boolean;
  withinPortal?: boolean;
  titleWidth?: CSSProperties['width'];
  variant?: MySelectTitleRootVariant;
  disabled?: boolean;
  titleMinWidth?: CSSProperties['minWidth'];
  monochrome?: boolean;
  excludeLostFromCascade?: boolean;
  showBoardName?: boolean;
  handleChange?: M extends SelectModel ? SelectChangeHandler : MultiselectChangeHandler;
  handleChangeStage?: M extends SelectModel ? (stage: Stage) => void : (stages: Stage[]) => void;
}

const StagesSelect = observer(
  <M extends SelectModel | MultiselectModel<number> = MultiselectModel<number>>(
    props: Props<M>
  ) => {
    const {
      model,
      titleWidth,
      stageCascade,
      withinPortal,
      entityTypeId,
      variant = 'outlined',
      disabled,
      titleMinWidth,
      monochrome,
      showBoardName,
      excludeLostFromCascade,
      handleChange,
      handleChangeStage,
    } = props;

    const { t } = useTranslation();

    const { data: boards, isLoading: areBoardsLoading } = boardApiUtil.useGetBoardsByEntityTypeId({
      entityTypeId,
    });
    const stages = stageApiUtil.useGetStagesByBoardIds(boards?.map(b => b.id) ?? []);

    const [opened, { open, close }] = useDisclosure(false);

    const [dropdownWidth, ref] = useDropdownWidth();

    const isMultiselect = model instanceof MultiselectModel;

    const getStageById = useCallback(
      (id: number): Optional<Stage> => {
        if (!stages) return;

        return stages.find(s => s.id === id);
      },
      [stages]
    );

    const getBoardById = useCallback(
      (id: number): Optional<Board> => {
        if (!boards) return;

        return boards.find(s => s.id === id);
      },
      [boards]
    );

    const isBoardChecked = useCallback(
      (boardId: number): boolean => {
        if (isMultiselect)
          return (
            stages?.filter(s => s.boardId === boardId).every(s => model.values.includes(s.id)) ??
            false
          );

        return false;
      },
      [model, stages, isMultiselect]
    );

    const isBoardIndeterminate = useCallback(
      (boardId: number): boolean => {
        if (isMultiselect)
          return (
            !isBoardChecked(boardId) &&
            (stages?.filter(s => s.boardId === boardId).some(s => model.values.includes(s.id)) ??
              false)
          );

        return false;
      },
      [model, stages, isMultiselect, isBoardChecked]
    );

    const isStageChecked = useCallback(
      (stageId: number): boolean => {
        if (isMultiselect) {
          return model.values.includes(stageId);
        } else {
          return model.value === stageId;
        }
      },
      [model, isMultiselect]
    );

    const getCheckBoardHandler = useCallback(
      (boardId: number) => () => {
        if (!isMultiselect)
          throw new Error(
            `Failed to check board ${boardId}, this is not possible in single select mode`
          );

        let newStagesCandidates = stages?.filter(s => s.boardId === boardId) ?? [];

        if (isBoardChecked(boardId) || isBoardIndeterminate(boardId)) {
          model.values = model.values.filter(v => !newStagesCandidates.map(s => s.id).includes(v));
        } else {
          if (excludeLostFromCascade)
            newStagesCandidates = newStagesCandidates.filter(s => s.code !== StageCode.LOST);

          model.values = [
            ...model.values,
            ...newStagesCandidates.filter(s => !model.values.includes(s.id)).map(s => s.id),
          ];
        }

        (handleChange as MultiselectChangeHandler)?.(model.values);
        (handleChangeStage as (stages: Stage[]) => void)?.(
          model.values.map(getStageById).filter(Boolean)
        );
      },
      [
        model,
        stages,
        isMultiselect,
        excludeLostFromCascade,
        isBoardChecked,
        isBoardIndeterminate,
        getStageById,
        handleChange,
        handleChangeStage,
      ]
    );

    const getCheckStageHandler = useCallback(
      (stageId: number) => () => {
        if (!stages.length) return;

        if (!isMultiselect) {
          model.setValue(stageId);

          close();
          (handleChange as SelectChangeHandler)?.(stageId);
          (handleChangeStage as (stage: Stage) => void)?.(getStageById(model.value)!);

          return;
        }

        // logic for multiselect

        if (stageCascade) {
          if (isStageChecked(stageId)) {
            const stage = getStageById(stageId);

            if (!stage) throw new Error(`Failed to find stage with id ${stageId}`);

            const { code } = stage;

            const isLostStage = code === StageCode.LOST;

            if (excludeLostFromCascade && isLostStage) {
              model.values = model.values.filter(v => v !== stageId);
            } else if (excludeLostFromCascade) {
              model.values = model.values.filter(
                v =>
                  v !== stageId &&
                  stages
                    ?.filter(s => s.code !== StageCode.LOST)
                    .map<number>(s => s.id)
                    .includes(v)
              );
            } else {
              model.values = model.values.filter(
                v => v !== stageId && stages?.map<number>(s => s.id).includes(v)
              );
            }
          } else {
            const stage = getStageById(stageId);

            if (!stage) return;

            const allNextStages = stages.filter(
              s => s.boardId === stage.boardId && s.sortOrder > stage.sortOrder
            );

            let nextStagesCandidates = allNextStages.filter(s => !model.values.includes(s.id));

            if (excludeLostFromCascade)
              nextStagesCandidates = nextStagesCandidates.filter(s => s.code !== StageCode.LOST);

            model.values = [
              ...model.values,
              stageId,
              ...nextStagesCandidates.map<number>(s => s.id),
            ];
          }

          (handleChange as MultiselectChangeHandler)?.(model.values);
          (handleChangeStage as (stages: Stage[]) => void)?.(
            model.values.map(getStageById).filter(Boolean)
          );

          return;
        }

        if (isStageChecked(stageId)) {
          model.values = model.values.filter(v => v !== stageId);
        } else {
          model.values = [...model.values, stageId];
        }

        (handleChange as MultiselectChangeHandler)?.(model.values);
        (handleChangeStage as (stages: Stage[]) => void)?.(
          model.values.map(getStageById).filter(Boolean)
        );
      },
      [
        stages,
        isMultiselect,
        stageCascade,
        isStageChecked,
        handleChange,
        model,
        handleChangeStage,
        getStageById,
        close,
        excludeLostFromCascade,
      ]
    );

    const getStageFromQueryById = useCallback(
      (id: number) => {
        const stage = stages?.find(s => s.id === id);

        if (!stage) throw new Error(`Failed to find stage with id ${id}`);

        return stage;
      },
      [stages]
    );

    const generateLabel = useCallback((): Optional<string> => {
      if (!stages?.length) return;

      if (isMultiselect) {
        if (model.values.length === 0) return;

        const stagesLabels = model.values
          .map(getStageFromQueryById)
          .sort((a, b) => {
            if (a.boardId === b.boardId) return a.sortOrder - b.sortOrder;

            const aSortOrder = getBoardById(a.boardId)?.sortOrder ?? 0;
            const bSortOrder = getBoardById(b.boardId)?.sortOrder ?? 0;

            return aSortOrder - bSortOrder;
          })
          .map(s => s.name);

        return stagesLabels.join(', ');
      } else {
        if (!model.value) return;

        if (showBoardName && boards) {
          const stage = getStageFromQueryById(model.value);

          const board = boards.find(b => b.id === stage.boardId);

          if (board) return `${board.name} | ${stage.name}`;
        }

        return getStageFromQueryById(model.value).name;
      }
    }, [model, getStageFromQueryById, showBoardName, boards, stages, isMultiselect, getBoardById]);

    const placeholder = useMemo(() => {
      if (areBoardsLoading || !stages?.length) {
        return t('loading_title');
      } else {
        return t('select_stage');
      }
    }, [areBoardsLoading, stages?.length, t]);

    const label = generateLabel();
    const titleBgColor = isMultiselect
      ? undefined
      : model.value && stages?.length
        ? getStageFromQueryById(model.value).color
        : undefined;

    return (
      <MySelectCustomTemplate
        ref={ref}
        label={label}
        opened={opened}
        variant={variant}
        disabled={disabled || areBoardsLoading || !stages?.length}
        titleWidth={titleWidth}
        invalid={!model.isValid}
        dropdownMinWidth="256px"
        withinPortal={withinPortal}
        dropdownWidth={dropdownWidth}
        titleMinWidth={titleMinWidth}
        placeholder={placeholder}
        titleBgColor={monochrome ? undefined : titleBgColor}
        show={open}
        hide={close}
      >
        {(boards?.length ?? 0) > 0 ? (
          <Root>
            {boards?.map(b => (
              <Fragment key={b.id}>
                <CheckboxWrapper
                  $hoverable={isMultiselect}
                  htmlFor={isMultiselect ? String(b.id) : undefined}
                >
                  {isMultiselect && (
                    <MyCheckbox
                      id={String(b.id)}
                      checked={isBoardChecked(b.id)}
                      indeterminate={isBoardIndeterminate(b.id)}
                      onChange={getCheckBoardHandler(b.id)}
                    />
                  )}

                  <BoardIconWrapper>
                    <ProjectBoardIcon />
                  </BoardIconWrapper>

                  <SpanWithEllipsis text={b.name} />
                </CheckboxWrapper>

                {stages
                  .filter(s => s.boardId === b.id)
                  .map(s => (
                    <Fragment key={s.id}>
                      {s.code === StageCode.LOST && excludeLostFromCascade && <Delimiter />}

                      <CheckboxWrapper $hoverable $stage htmlFor={String(s.id)}>
                        <MyCheckbox
                          id={String(s.id)}
                          checked={isStageChecked(s.id)}
                          onChange={getCheckStageHandler(s.id)}
                        />

                        <StageIndicatorWrapper $bgColor={s.color}>
                          <span />
                        </StageIndicatorWrapper>

                        <SpanWithEllipsis text={s.name} />
                      </CheckboxWrapper>
                    </Fragment>
                  ))}
              </Fragment>
            ))}
          </Root>
        ) : (
          <NoOptionsMessage>{t('form.my_select.no_options')}</NoOptionsMessage>
        )}
      </MySelectCustomTemplate>
    );
  }
);

StagesSelect.displayName = 'StagesSelect';
export { StagesSelect };
