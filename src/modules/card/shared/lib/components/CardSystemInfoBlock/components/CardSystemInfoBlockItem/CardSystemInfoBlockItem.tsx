import { SpanWithEllipsis, TruncateMixin } from '@/shared';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;

  &:nth-child(even) {
    margin-left: auto;
  }

  ${TruncateMixin}
`;

const Label = styled.span`
  color: var(--button-text-graphite-primary-text);
`;

const Text = styled.span`
  color: var(--button-text-graphite-priory-text);
`;

interface Props {
  label: string;
  text: string;
}

const CardSystemInfoBlockItem = (props: Props) => {
  const { label, text } = props;

  return (
    <Root>
      <Label>{label}:</Label>

      <Text>
        <SpanWithEllipsis text={text} />
      </Text>
    </Root>
  );
};

export { CardSystemInfoBlockItem };
