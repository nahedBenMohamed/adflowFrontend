import { SkeletonAnimationMixin } from '@/shared';
import styled from 'styled-components';

export const Root = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;

  margin-top: 16px;
  margin-bottom: 32px;
`;

export const PromoHeader = styled.div`
  width: 100%;
  max-width: 1080px;

  display: flex;
  gap: 24px;
  align-items: center;
  justify-content: space-between;

  padding: 42px 72px;
  border-radius: 14px;
  background: var(--primary-statuses-green-520);
`;

export const HeaderCallout = styled.p`
  font-size: 38px;
  line-height: 58px;
  color: var(--primary-statuses-white-0);
  font-weight: 600;
  font-family: 'Geologica', sans-serif;
`;

export const Highlight = styled.span`
  white-space: nowrap;
  color: var(--graphite-graphite-840);

  background-color: #ffff00;
  padding: 4px 8px;
  border-radius: 12px;
`;

export const BlackText = styled.span`
  color: var(--graphite-graphite-840);
`;

export const PlansGrid = styled.div`
  display: grid;
  grid-auto-rows: auto;
  grid-template-columns: repeat(2, 468px);
  gap: 42px;
`;

export const LifetimeDealPricingBlockSkeleton = styled.div<{ $fullRounded?: boolean }>`
  width: 100%;
  height: 530px;

  border-bottom-right-radius: 14px;
  border-bottom-left-radius: 14px;

  ${p => p.$fullRounded && `border-radius: 14px`};

  ${SkeletonAnimationMixin}
`;

export const PricingBlockSkeleton = styled.div`
  width: 100%;
  height: 378px;

  border-radius: 14px;

  ${SkeletonAnimationMixin}
`;
