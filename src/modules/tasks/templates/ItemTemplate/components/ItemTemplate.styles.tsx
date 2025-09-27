import { TruncateMixin } from '@/shared/lib/mixins/Truncate.mixin';
import styled, { css } from 'styled-components';
import { TaskHexColors } from '../../../shared';

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

interface DateProps {
  $resolved: boolean;
  $titleColor: string;
}

export const Date = styled.span<DateProps>`
  font-size: 13px;
  font-weight: 600;
  line-height: 17px;
  color: ${p => (p.$resolved ? 'var(--button-text-graphite-secondary-text)' : p.$titleColor)};
  text-decoration: ${p => (p.$resolved ? 'line-through' : 'none')};
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Text = styled.span<{ $resolved: boolean }>`
  font-size: 13px;
  line-height: 16px;
  text-decoration: ${p => (p.$resolved ? 'line-through' : 'none')};
  color: ${p =>
    p.$resolved
      ? 'var(--button-text-graphite-secondary-text)'
      : 'var(--button-text-graphite-priory-text)'};

  ${TruncateMixin}
`;

interface ActivityTypeProps {
  $bgColor: string;
  $resolved: boolean;
  $textColor: string;
  $hasBorder: boolean;
}

export const ActivityTypeTag = styled.span<ActivityTypeProps>`
  max-width: 208px;
  height: 20px;

  display: flex;
  align-items: center;

  font-size: 13px;
  font-weight: 500;
  color: ${p => p.$textColor};

  padding: 1px 6px 2px;
  background-color: ${p => p.$bgColor};
  border-radius: var(--border-radius-element);
  border: ${p => (p.$hasBorder ? `1px solid ${p.$textColor}` : 'none')};

  ${p =>
    p.$resolved &&
    css`
      border: none;
      background-color: transparent;

      color: ${TaskHexColors.BLUE};
      text-decoration: line-through;
    `}
`;

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;

  ${TruncateMixin}
`;
