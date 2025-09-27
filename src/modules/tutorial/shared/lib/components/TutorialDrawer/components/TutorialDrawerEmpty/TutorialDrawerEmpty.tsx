import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TutorialEmptyIcon } from '../../../../../assets';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;

  padding: 32px 16px;
`;

const Title = styled.p`
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  text-align: center;
  color: var(--button-text-graphite-secondary-text);
`;

const TutorialDrawerEmpty = () => {
  const { t } = useTranslation('module.tutorial', {
    keyPrefix: 'tutorial.tutorial_drawer',
  });

  return (
    <Root>
      <Title>{t('empty')}</Title>

      <TutorialEmptyIcon />
    </Root>
  );
};

export { TutorialDrawerEmpty };
