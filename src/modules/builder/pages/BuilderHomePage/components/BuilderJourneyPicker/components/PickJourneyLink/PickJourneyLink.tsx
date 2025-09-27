import { useTranslation } from 'react-i18next';
import { Link, type LinkProps } from 'react-router-dom';
import styled, { css } from 'styled-components';

const Root = styled.div`
  width: fit-content;

  margin-left: auto;
`;

const StyledLink = styled(Link)<{ $disabled?: boolean }>`
  width: fit-content;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  z-index: 1;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--primary-statuses-white-0);

  border-radius: 20px;
  padding: 9px 16px 10px;
  background-color: var(--button-text-green-default);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    color: var(--primary-statuses-white-0);
    background-color: var(--button-text-green-hover);
  }

  &:active {
    background-color: var(--button-text-green-active);
  }

  ${p =>
    p.$disabled &&
    css`
      pointer-events: none;

      opacity: 0.5;
    `}
`;

interface Props extends Omit<LinkProps, 'rel'> {
  disabled?: boolean;
}

const PickJourneyLink = (props: Props) => {
  const { disabled, ...rest } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.builder_journey_picker_page',
  });

  return (
    <Root>
      <StyledLink {...rest} $disabled={disabled} rel="noopener noreferrer">
        {t('create_a_new_module')}
      </StyledLink>
    </Root>
  );
};

export { PickJourneyLink };
