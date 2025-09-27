import { ColumnCount, MyTooltip, NoSelectMixin, type Optional } from '@/shared';
import styled, { css } from 'styled-components';

const Root = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 4px 8px;
  border-radius: 8px;
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;
    background: var(--graphite-graphite-40);
  }

  ${p =>
    p.$active &&
    css`
      background: var(--neutral-green-120);

      ${Label} {
        color: var(--button-text-graphite-priory-text);
      }

      &:hover {
        background: var(--neutral-green-120);
      }
    `}
`;

const Label = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: var(--button-text-graphite-primary-text);

  white-space: nowrap;

  ${NoSelectMixin};
`;

interface Props {
  hint: string;
  label: string;
  count: Optional<number>;
  isActive?: boolean;
  onClick: () => void;
}

const StatsIndicator = (props: Props) => {
  const { hint, label, count, isActive, onClick } = props;

  return (
    <MyTooltip withinPortal label={hint}>
      <Root onClick={onClick} $active={isActive}>
        <Label>{label}</Label>

        <ColumnCount count={count ?? 0} />
      </Root>
    </MyTooltip>
  );
};

export { StatsIndicator };
