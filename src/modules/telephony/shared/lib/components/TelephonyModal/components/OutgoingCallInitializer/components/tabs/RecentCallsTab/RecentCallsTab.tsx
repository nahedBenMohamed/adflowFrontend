import { DefaultLoader, DropdownScrollbarMixin, EmptyTableBlock, type SelectModel } from '@/shared';
import { useIntersection } from '@mantine/hooks';
import { Fragment, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useGetVoximplantCalls } from '../../../../../../../../../api';
import { getRecentCallsGroups } from '../../../../../../../helpers';
import type { RecentCallsGroup } from '../../../../../../../models';
import type { SetLastCallFromHandler } from '../../../../../../../types';
import { RecentCall } from './components';

const Root = styled.ul`
  position: relative;

  height: 100%;
  display: flex;
  flex-direction: column;

  ${DropdownScrollbarMixin};

  padding-bottom: 16px;
`;

const DateWrapper = styled.div`
  position: sticky;
  top: 8px;

  display: flex;
  justify-content: center;

  margin: 8px 0;
`;

const Date = styled.div`
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: var(--button-text-graphite-primary-text);

  opacity: 0.8;
  padding: 4px 12px;
  border-radius: 24px;
  background: var(--graphite-graphite-80);
`;

const LoaderWrapper = styled.div`
  margin: 80px auto 0;
`;

interface Props {
  callFromNumber: SelectModel;
  handleSetLastCallFrom: SetLastCallFromHandler;
}

const RecentCallsTab = (props: Props) => {
  const { callFromNumber, handleSetLastCallFrom } = props;

  const { t } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.components.telephony_modal.outgoing_call_initializer',
  });

  const containerRef = useRef<HTMLUListElement>(null);

  const {
    data: callLists,
    isLoading: areCallsLoading,
    hasNextPage,
    fetchNextPage,
  } = useGetVoximplantCalls();

  const { ref: observerRef, entry } = useIntersection({
    root: containerRef.current,
    rootMargin: '240px',
  });

  const isVisible = entry?.isIntersecting;

  useEffect(() => {
    if (isVisible) fetchNextPage();
  }, [isVisible, fetchNextPage]);

  const callsGroups = useMemo<RecentCallsGroup[]>(
    () => (callLists ? getRecentCallsGroups(callLists.pages) : []),
    [callLists]
  );

  return (
    <Root ref={containerRef}>
      {areCallsLoading ? (
        <LoaderWrapper>
          <DefaultLoader />
        </LoaderWrapper>
      ) : callsGroups.length > 0 ? (
        callsGroups.map((cg, idx) => (
          <Fragment key={idx}>
            <DateWrapper>
              <Date>{cg.date.displayLong()}</Date>
            </DateWrapper>

            {cg.calls.map(c => (
              <RecentCall
                key={c.id}
                call={c}
                callFromNumber={callFromNumber}
                handleSetLastCallFrom={handleSetLastCallFrom}
              />
            ))}
          </Fragment>
        ))
      ) : (
        <EmptyTableBlock $height="320px">{t('no_calls')}</EmptyTableBlock>
      )}

      {hasNextPage && <div ref={observerRef} />}
    </Root>
  );
};

export { RecentCallsTab };
