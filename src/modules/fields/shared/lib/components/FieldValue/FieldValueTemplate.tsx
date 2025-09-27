import { authStore } from '@/modules/auth';
import { MediaBreakpoints, type Nullable } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { useCardFieldHelperContext } from '../../../../context';
import type { FieldSettings } from '../../models';
import { FieldIndicator, type IndicatorType } from './FieldIndicator';

interface RootProps {
  $disabled: boolean;
  $rightIndicatorOnMobile?: boolean;
}

const Root = styled.div<RootProps>`
  width: 100%;

  display: flex;
  gap: 6px;

  ${p =>
    p.$disabled &&
    css`
      * {
        pointer-events: none;
      }
    `};

  ${p =>
    p.$rightIndicatorOnMobile &&
    css`
      @media ${MediaBreakpoints.SM} {
        flex-direction: row-reverse;
        justify-content: flex-end;
      }
    `}
`;

interface Props {
  filled: boolean;
  children: ReactNode;
  title?: string;
  readonly?: boolean;
  tableView?: boolean;
  withSelect?: boolean;
  settings?: FieldSettings;
  alwaysHideIndicator?: boolean;
  rightIndicatorOnMobile?: boolean;
  validate?: () => void;
}

const FieldValueTemplate = observer((props: Props) => {
  const {
    filled,
    children,
    title,
    readonly,
    tableView,
    withSelect,
    settings,
    alwaysHideIndicator,
    rightIndicatorOnMobile,
  } = props;

  const { t } = useTranslation();

  const helperContext = useCardFieldHelperContext();

  const { user: currentUser } = authStore;

  const isReadonly = useCallback(
    (currentUserId: number) => {
      if (!settings) return false;

      return settings.readonly(currentUserId);
    },
    [settings]
  );

  const getType = useCallback(
    (currentUserId: number): Nullable<IndicatorType> => {
      if (!settings) return null;

      const currentStageId = helperContext?.stageId;

      const isImportant = currentStageId
        ? settings.showImportantIndicator({ currentUserId, currentStageId })
        : false;

      const isMandatory = currentStageId ? settings.showMandatoryIndicator(currentStageId) : false;

      if (isImportant) return filled ? 'filled-important' : 'important';

      if (isMandatory) return filled ? 'filled-mandatory' : 'mandatory';

      return null;
    },

    [settings, filled, helperContext]
  );

  if (!currentUser) throw new Error('User if not defined, failed to show field value');

  const currentUserId = currentUser.id;

  const fieldIndicatorType = getType(currentUserId);
  const fieldReadonly = readonly || isReadonly(currentUserId);

  const isListView = helperContext?.isListView ?? false;

  const readonlyProps = useMemo(
    () => ({
      $disabled: fieldReadonly,
      'aria-readonly': fieldReadonly,
    }),
    [fieldReadonly]
  );

  const hideIndicator = tableView || isListView || alwaysHideIndicator;

  const rootTitle = title ? title : fieldReadonly ? t('field_readonly') : undefined;

  return hideIndicator ? (
    <Root title={rootTitle} {...readonlyProps}>
      {children}
    </Root>
  ) : (
    <Root title={rootTitle} {...readonlyProps} $rightIndicatorOnMobile={rightIndicatorOnMobile}>
      <FieldIndicator type={fieldIndicatorType} withSelect={withSelect} />

      {children}
    </Root>
  );
});

FieldValueTemplate.displayName = 'FieldValueTemplate';
export { FieldValueTemplate };
