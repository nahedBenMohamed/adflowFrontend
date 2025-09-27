import type { InputModel } from '@/shared';
import styled from 'styled-components';
import { GiantOutlinedInput } from '../../../../../../../../shared';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled.p`
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: var(--button-text-graphite-priory-text);
`;

interface Props {
  title: string;
  model: InputModel;
  placeholder: string;
}

const SiteFormCustomizationTextInput = (props: Props) => {
  const { title, model, placeholder } = props;

  return (
    <Root>
      <Title>{title}</Title>

      <GiantOutlinedInput smaller model={model} padding="8px 16px" placeholder={placeholder} />
    </Root>
  );
};

SiteFormCustomizationTextInput.displayName = 'SizeCustomizationElementTemplate';
export { SiteFormCustomizationTextInput };
