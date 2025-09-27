import { DropdownScrollbarMixin } from '@/shared';
import { useIntersection } from '@mantine/hooks';
import { Fragment, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { TOP_SELLERS_LIMIT } from '../../../../../../api';
import type { SellersRating } from '../../../../../../shared';
import { RatingItem } from '../RatingItem/RatingItem';

const Root = styled.div`
  height: 100%;

  display: flex;
  flex-direction: column;

  padding: 0;
  overflow-y: auto;
  overflow-x: hidden;

  ${DropdownScrollbarMixin}
`;

interface Props {
  topSellersData: SellersRating[];
  hasNextPage?: boolean;
  fetchNextPage: () => void;
}

const RatingList = (props: Props) => {
  const { topSellersData, hasNextPage, fetchNextPage } = props;

  const containerRef = useRef<HTMLDivElement>(null);

  const { ref: observerRef, entry } = useIntersection({
    root: containerRef.current,
    rootMargin: '160px',
    threshold: 1,
  });

  const isVisible = entry?.isIntersecting;

  useEffect(() => {
    if (isVisible) fetchNextPage();
  }, [isVisible, fetchNextPage]);

  return (
    <Root ref={containerRef}>
      {topSellersData.map((t, idx) => (
        <Fragment key={idx}>
          {t.users.map((u, uIdx) => (
            <RatingItem key={u.userId} topSeller={u} place={uIdx + 1 + idx * TOP_SELLERS_LIMIT} />
          ))}
        </Fragment>
      ))}

      {hasNextPage && <div ref={observerRef} />}
    </Root>
  );
};

export { RatingList };
