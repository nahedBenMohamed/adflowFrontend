import { SpanWithEllipsis, TruncateMixin } from '@/shared';
import styled from 'styled-components';

const Root = styled.ul`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-self: flex-start;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  text-align: left;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  padding: 0 0 0 40px;

  ${TruncateMixin}
`;

const EllipsisWrapper = styled.div`
  ${TruncateMixin}
`;

interface Props {
  missingTags: string[];
}

const MissingTagsList = (props: Props) => {
  const { missingTags } = props;

  return (
    <Root>
      {missingTags.map((mt, idx) => (
        <li key={idx}>
          <EllipsisWrapper>
            <SpanWithEllipsis text={mt} />
          </EllipsisWrapper>
        </li>
      ))}
    </Root>
  );
};

export { MissingTagsList };
