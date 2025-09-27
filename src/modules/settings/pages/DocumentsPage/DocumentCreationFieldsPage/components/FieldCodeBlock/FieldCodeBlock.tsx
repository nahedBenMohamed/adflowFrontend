import { CopyButton, SpanWithEllipsis, TruncateMixin } from '@/shared';
import styled from 'styled-components';

const FieldCodeWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  ${TruncateMixin}
`;

const FieldCode = styled.div`
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin}
`;

interface Props {
  fieldCode: string;
}

const FieldCodeBlock = (props: Props) => {
  const { fieldCode } = props;

  return (
    <FieldCodeWrapper>
      <FieldCode>
        <SpanWithEllipsis text={fieldCode} />
      </FieldCode>

      <CopyButton copyText={fieldCode} />
    </FieldCodeWrapper>
  );
};

export { FieldCodeBlock };
