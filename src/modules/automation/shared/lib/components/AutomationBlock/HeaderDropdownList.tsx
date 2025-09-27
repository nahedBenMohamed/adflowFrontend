import { DropdownListItem, SpanWithEllipsis, type Option } from '@/shared';
import { memo, useCallback } from 'react';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  flex-direction: column;

  padding: 4px 0;
`;

interface Props {
  options: Option<number>[];
  onSelect: (id: number) => void;
}

const HeaderDropdownList = memo((props: Props) => {
  const { options, onSelect } = props;

  const getSelectHandler = useCallback((id: number) => () => onSelect(id), [onSelect]);

  return (
    <Root>
      {options.map(o => (
        <DropdownListItem key={o.value} $padding="6px 8px" onClick={getSelectHandler(o.value)}>
          <SpanWithEllipsis showTitle={false} text={o.label} />
        </DropdownListItem>
      ))}
    </Root>
  );
});

HeaderDropdownList.displayName = 'HeaderDropdownList';
export { HeaderDropdownList };
