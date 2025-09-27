import { useTypedParams } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { PartnerInfoStore } from '../../store';
import { PartnerPageTemplate } from '../../templates';
import { BlockSkeleton, PartnerLeadsBlock, PartnerSummaryBlock } from './components';

const Root = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PartnerInfoPage = observer(() => {
  const { partnerId } = useTypedParams<{ partnerId: number }>();

  const partnerInfoStore = useMemo(() => new PartnerInfoStore(partnerId), [partnerId]);

  const { isSummaryLoading, areLeadsLoading, summary, leads, loadLeads, loadSummary } =
    partnerInfoStore;

  useEffect(() => {
    loadSummary();
    loadLeads();
  }, [loadLeads, loadSummary]);

  return (
    <PartnerPageTemplate>
      <Root>
        {isSummaryLoading || !summary ? (
          <BlockSkeleton $small $delay={0} />
        ) : (
          <PartnerSummaryBlock summary={summary} />
        )}

        {areLeadsLoading || !leads ? (
          <BlockSkeleton $delay={0} />
        ) : (
          <PartnerLeadsBlock leads={leads} />
        )}
      </Root>
    </PartnerPageTemplate>
  );
});

PartnerInfoPage.displayName = 'PartnerInfoPage';
export { PartnerInfoPage };
