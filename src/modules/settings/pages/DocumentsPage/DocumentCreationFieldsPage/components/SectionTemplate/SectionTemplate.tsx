import type { ReactNode } from 'react';
import styled from 'styled-components';

export const Root = styled.li`
  display: grid;
  grid-template-columns: calc(30% - 8px) calc(70% - 8px);
  gap: 16px;
`;

export const SectionNameBlock = styled.div`
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: var(--button-text-graphite-priory-text);

  padding-top: 8px;
  word-break: break-all;
  border-top: 1px solid var(--graphite-graphite-80);
`;

export const SystemFieldsBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FieldsBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: 24px;
  box-shadow:
    0px 0px 2px #eef4fe,
    0px 1px 2px #d0daeb;
  border-radius: var(--border-radius-block);
  background: var(--primary-statuses-white-0);
`;

interface Props {
  name: string;
  Fields: ReactNode;
  SystemFields: ReactNode;
}

const SectionTemplate = (props: Props) => {
  const { name, Fields, SystemFields } = props;

  return (
    <Root>
      <SectionNameBlock>{name}</SectionNameBlock>

      <FieldsBlock>
        <SystemFieldsBlock>{SystemFields}</SystemFieldsBlock>

        {Fields}
      </FieldsBlock>
    </Root>
  );
};

export { SectionTemplate };
