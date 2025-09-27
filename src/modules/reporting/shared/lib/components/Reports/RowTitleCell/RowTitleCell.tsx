import { ProductCategory } from '@/modules/products';
import { Department } from '@/modules/settings';
import { SpanWithEllipsis, TruncateMixin, User, UserView } from '@/shared';
import type { Row } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ToggleExpandedIcon } from '../../../../assets';
import type { ReportSyntheticRow } from '../../../types';
import { RowTitleIcon } from '../RowTitleIcon/RowTitleIcon';

const Root = styled.div<{ $depth: number }>`
  max-width: 256px;

  display: flex;
  align-items: center;
  gap: 4px;

  ${TruncateMixin}
`;

const Order = styled.span`
  min-width: 24px;

  font-size: 14px;
  text-align: left;
  font-weight: 500;
  line-height: 20px;
  font-variant: tabular-nums;
  color: var(--button-text-graphite-primary-text);

  ${TruncateMixin}
`;

const DepartmentName = styled.span`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin}
`;

const ToggleExpandedIconWrapper = styled.button<{ $expanded: boolean }>`
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  transform: rotate(${p => (p.$expanded ? '90deg' : 0)});
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;
  }
`;

interface Props<R> {
  row: Row<R>;
  showOrder?: boolean;
}

const RowTitleCell = <R extends ReportSyntheticRow<unknown>>(props: Props<R>) => {
  const { row, showOrder } = props;

  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.pages.reports_page.components.row_title_cell',
  });

  const { originalObject } = row.original;

  const canExpand = row.getCanExpand();
  const isExpanded = row.getIsExpanded();

  const withoutGroup = row.original.type === 'group' && !originalObject;

  return (
    <Root $depth={row.depth}>
      {canExpand && (
        <ToggleExpandedIconWrapper $expanded={isExpanded} onClick={row.getToggleExpandedHandler()}>
          <ToggleExpandedIcon />
        </ToggleExpandedIconWrapper>
      )}

      {showOrder && row.original.type !== 'total' && <Order>{row.index + 1}</Order>}

      {row.original.type === 'user' || withoutGroup ? null : (
        <RowTitleIcon rowType={row.original.type} />
      )}

      {originalObject instanceof User && <UserView user={originalObject} />}

      {(originalObject instanceof Department || originalObject instanceof ProductCategory) && (
        <DepartmentName>
          <SpanWithEllipsis text={originalObject.name} />
        </DepartmentName>
      )}

      {withoutGroup && (
        <DepartmentName>
          <SpanWithEllipsis text={t('without_group')} />
        </DepartmentName>
      )}

      {row.original.type === 'empty-user' && (
        <DepartmentName>
          <SpanWithEllipsis text={t('empty_user')} />
        </DepartmentName>
      )}

      {typeof originalObject === 'string' && <SpanWithEllipsis medium text={originalObject} />}

      {row.original.type === 'total' && <SpanWithEllipsis text={t('total')} />}
    </Root>
  );
};

export { RowTitleCell };
