import type { DraggableProvided } from '@hello-pangea/dnd';
import styled from 'styled-components';
import type { SiteFormElementsFieldModel } from '../../../../../../../../../shared';
import { SiteFormElementTemplate } from '../SiteFormElementTemplate/SiteFormElementTemplate';

const DelimiterWrapper = styled.div`
  height: 42px;

  display: flex;
  align-items: center;
`;

const Delimiter = styled.hr`
  width: 100%;

  border-top: 2px solid var(--graphite-graphite-80);
`;

interface Props {
  field: SiteFormElementsFieldModel;
  dragHandleProps: DraggableProvided['dragHandleProps'];
  onDelete: () => void;
}

const SiteFormDelimiterFieldElement = (props: Props) => {
  const { field, dragHandleProps, onDelete } = props;

  return (
    <SiteFormElementTemplate
      hideLabel
      field={field}
      fieldLabelEnabled={false}
      dragHandleProps={dragHandleProps}
      onDelete={onDelete}
    >
      <DelimiterWrapper>
        <Delimiter />
      </DelimiterWrapper>
    </SiteFormElementTemplate>
  );
};

export { SiteFormDelimiterFieldElement };
