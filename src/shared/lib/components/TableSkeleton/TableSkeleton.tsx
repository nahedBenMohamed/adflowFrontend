import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { SkeletonAnimationMixin } from '../../mixins';
import { BaseTableHeadRow, type BaseTableHeadRowProps } from '../BaseTable/BaseTableHeadRow';

const Root = styled.div`
  position: relative;

  width: 100%;
`;

const CheckboxSkeleton = styled.div<{ $delay: number }>`
  height: 16px;
  width: 16px;

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixin}
`;

const HeadCellSkeleton = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  flex-shrink: 0;

  padding-bottom: 8px;
`;

interface HeadCellContentSkeletonProps {
  $delay: number;
  $small?: boolean;
}

const HeadCellContentSkeleton = styled.div<HeadCellContentSkeletonProps>`
  height: 12px;

  flex: ${p => (p.$small ? 0.5 : 1)};

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixin}
`;

const TableBodyRowSkeleton = styled.div<{ $delay: number }>`
  height: 30px;
  width: 100%;

  display: flex;
  align-items: center;
  gap: 16px;

  padding: 4px 12px;
  margin-bottom: 8px;

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixin}
`;

interface Props {
  rows?: number;
  small?: boolean;
  headRowProps?: BaseTableHeadRowProps;
}

const TableSkeleton = (props: Props) => {
  const { rows, small = false, headRowProps } = props;

  const { t } = useTranslation();

  const rowsCount = rows ? rows : small ? 5 : 12;

  return (
    <Root title={t('loading_title')}>
      <BaseTableHeadRow {...headRowProps}>
        <HeadCellSkeleton>
          <CheckboxSkeleton $delay={0} />
        </HeadCellSkeleton>

        <HeadCellSkeleton>
          <HeadCellContentSkeleton $small $delay={300} />
        </HeadCellSkeleton>

        <HeadCellSkeleton>
          <HeadCellContentSkeleton $small $delay={600} />
        </HeadCellSkeleton>

        {!small && (
          <HeadCellSkeleton>
            <HeadCellContentSkeleton $small $delay={900} />
          </HeadCellSkeleton>
        )}

        <HeadCellSkeleton>
          <HeadCellContentSkeleton $delay={1200} />
        </HeadCellSkeleton>
      </BaseTableHeadRow>

      <div>
        {new Array(rowsCount).fill(0).map((_, idx) => (
          <TableBodyRowSkeleton key={idx} $delay={idx * 300} />
        ))}
      </div>
    </Root>
  );
};

export { TableSkeleton };
