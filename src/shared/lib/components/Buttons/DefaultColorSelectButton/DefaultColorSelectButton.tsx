import { UnionIcon } from '@/shared';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.button<{ $active?: boolean }>`
  width: fit-content;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);

  padding: 4px 12px 4px 8px;
  border-radius: var(--border-radius-element);
  border: 1px solid var(--graphite-graphite-80);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    color: var(--graphite-graphite-840);

    background: #eff5eb;
    border: 1px solid #eff5eb;
  }

  &:active {
    color: var(--button-text-graphite-primary-text);

    background: #e9f1e4;
    border: 1px solid #e9f1e4;
  }
`;

const IconWrapper = styled.div`
  width: 20px;
  height: 20px;

  flex-shrink: 0;
`;

interface Props {
  onClick: () => void;
}

const DefaultColorSelectButton = (props: Props) => {
  const { onClick } = props;

  const { t } = useTranslation();

  return (
    <Root type="button" onClick={onClick}>
      <IconWrapper>
        <UnionIcon />
      </IconWrapper>

      {t('default')}
    </Root>
  );
};

export { DefaultColorSelectButton };
