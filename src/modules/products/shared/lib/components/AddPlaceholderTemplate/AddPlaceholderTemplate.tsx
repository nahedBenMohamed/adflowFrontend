import { AddSquareIcon, NoOptionsMessage } from '@/shared';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Root = styled.div`
  width: 100%;

  display: flex;
  justify-content: center;
`;

const AddTemplateLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-secondary-text);
  transition: var(--transition-200);

  svg rect {
    transition: var(--transition-200);
  }

  &:hover {
    color: var(--button-text-blue-hover);

    svg rect {
      fill: var(--button-text-blue-hover);
    }
  }
`;

interface Props {
  title: string;
  link: string;
}

const AddPlaceholderTemplate = (props: Props) => {
  const { title, link } = props;

  return (
    <Root>
      <NoOptionsMessage>
        <AddTemplateLink to={link}>
          <AddSquareIcon />

          {title}
        </AddTemplateLink>
      </NoOptionsMessage>
    </Root>
  );
};

export { AddPlaceholderTemplate };
