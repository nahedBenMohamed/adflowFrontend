import { DeleteButton, DotsMediumIcon, MyDropdown } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const DotsIconWrapper = styled.div`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg path {
      fill: var(--button-text-blue-hover);
    }
  }

  &:active {
    svg path {
      fill: var(--button-text-blue-active);
    }
  }
`;

const List = styled.div`
  padding: 6px 16px;

  display: flex;
  flex-direction: column;
`;

interface Props {
  handleDelete: () => void;
}

const ProductActionsDropdown = (props: Props) => {
  const { handleDelete } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.product_page.ui.product_actions_dropdown',
  });

  const [opened, { close, open }] = useDisclosure(false);

  return (
    <MyDropdown
      withinPortal
      opened={opened}
      position="bottom-start"
      Button={
        <DotsIconWrapper>
          <DotsMediumIcon />
        </DotsIconWrapper>
      }
      show={open}
      hide={close}
    >
      <List>
        <DeleteButton text={t('delete_product')} onClick={handleDelete} />
      </List>
    </MyDropdown>
  );
};

export { ProductActionsDropdown };
