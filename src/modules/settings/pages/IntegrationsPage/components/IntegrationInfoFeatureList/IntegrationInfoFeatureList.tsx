import styled from 'styled-components';
import { FeatureIcon } from '../../../../shared';
import { IntegrationInfoText } from '../IntegrationInfoText/IntegrationInfoText';

const Root = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FeatureItem = styled.li`
  display: flex;
  gap: 8px;
`;

const FeatureIconWrapper = styled.div`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

interface Props {
  features: string[];
}

const IntegrationInfoFeatureList = (props: Props) => {
  const { features } = props;

  return (
    <Root>
      {features.map((f, idx) => (
        <FeatureItem key={idx}>
          <FeatureIconWrapper>
            <FeatureIcon />
          </FeatureIconWrapper>

          <IntegrationInfoText>{f}</IntegrationInfoText>
        </FeatureItem>
      ))}
    </Root>
  );
};

export { IntegrationInfoFeatureList };
