import {
  DeleteButton,
  MyCheckbox,
  PencilButton,
  type FunctionalOptionWithComponent,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import {
  getFeedItemColors,
  type FeedItemColorVariant,
  type FeedItemColors,
} from '../../../../../../helpers';
import { HeaderControlsDropdown } from '../HeaderControlsDropdown/HeaderControlsDropdown';

interface RootProps extends FeedItemColors {
  $highlighted?: boolean;
  $dashed?: boolean;
}

const Root = styled.div<RootProps>`
  display: flex;
  flex-direction: column;
  flex: 1;

  margin-bottom: 16px;
  border-radius: var(--border-radius-block);
  border: 1px solid ${p => (p.borderColor ? p.borderColor : `transparent`)};
  background: ${p => (p.bgColor ? p.bgColor : `var(--primary-statuses-white-0)`)};
  box-shadow: ${p =>
    !p.$highlighted && p.boxShadow
      ? p.boxShadow
      : `0px 1px 2px 0px #d0daeb, 0px 0px 2px 0px #eef4fe`};
  transition: var(--transition-200);

  ${p => p.$highlighted && `box-shadow: 0px 0px 2px 1px var(--primary-statuses-green-520)`};

  ${p => !p.$highlighted && p.$dashed && `border: 1px solid #7d89a1`};
`;

const CommonHeaderStyle = css`
  display: flex;
  justify-content: space-between;
  gap: 16px;

  padding: 16px 24px 12px;
`;

const FeedItemHeader = styled.div`
  ${CommonHeaderStyle}
`;

const HeaderButton = styled.div`
  ${CommonHeaderStyle}

  &:hover {
    cursor: pointer;
  }
`;

const LeftHeaderContent = styled.div`
  display: flex;
  gap: 16px;

  overflow: hidden;
`;

const CheckboxWrapper = styled.div`
  margin-top: 4px;
`;

export const FeedItemTitleTextStyle = css`
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: var(--button-text-graphite-priory-text);
  text-align: left;
`;

const FeedItemTitle = styled.span<{ $isResolvedTask?: boolean }>`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  overflow: hidden;
  transition: var(--transition-200);

  ${FeedItemTitleTextStyle}

  ${p =>
    p.$isResolvedTask &&
    css`
      text-decoration: line-through;
      color: var(--button-text-graphite-secondary-text);
    `}
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  padding: 4px 24px 16px;
`;

export interface CheckboxProps {
  resolved: boolean;
  checked: boolean;
  disabled: boolean;
  handleCheckboxChange: () => void;
}

interface Props {
  children: ReactNode;
  title: string | ReactNode;
  highlighted?: boolean;
  isResolvedTask?: boolean;
  dashed?: boolean;
  checkboxProps?: CheckboxProps;
  controls?: FunctionalOptionWithComponent[];
  itemStyle?: FeedItemColorVariant;
  handleEdit?: () => void;
  handleDelete?: () => void;
  handleHeaderClick?: () => void;
}

const FeedItem = (props: Props) => {
  const {
    children,
    title,
    highlighted,
    isResolvedTask,
    dashed,
    controls,
    itemStyle,
    checkboxProps,
    handleEdit,
    handleDelete,
    handleHeaderClick,
  } = props;

  const { t } = useTranslation();

  const [controlsOpened, { close: hideControls, open: showControls }] = useDisclosure(false);

  const options = useMemo((): FunctionalOptionWithComponent[] => {
    if (controls) return controls;

    const options: FunctionalOptionWithComponent[] = [];

    if (handleEdit)
      options.push({
        label: <PencilButton text={t('buttons.edit')} />,
        value: handleEdit,
      });

    if (handleDelete)
      options.push({
        label: <DeleteButton text={t('buttons.delete')} fontWeight={400} />,
        value: handleDelete,
        danger: true,
      });

    return options;
  }, [controls, handleEdit, handleDelete, t]);

  const colors = itemStyle ? getFeedItemColors(itemStyle) : null;

  const HeaderContent = (
    <>
      <LeftHeaderContent>
        {checkboxProps && (
          <CheckboxWrapper>
            <MyCheckbox
              stopPropagation
              gray={checkboxProps.resolved}
              checked={checkboxProps.checked}
              disabled={checkboxProps.disabled}
              onChange={checkboxProps.handleCheckboxChange}
            />
          </CheckboxWrapper>
        )}

        {typeof title === 'string' ? (
          <FeedItemTitle title={title} $isResolvedTask={isResolvedTask}>
            {title}
          </FeedItemTitle>
        ) : (
          title
        )}
      </LeftHeaderContent>

      {options.length > 0 && (
        <HeaderControlsDropdown
          options={options}
          opened={controlsOpened}
          hide={hideControls}
          show={showControls}
        />
      )}
    </>
  );

  return (
    <Root
      bgColor={colors?.bgColor}
      $highlighted={highlighted}
      $dashed={dashed}
      boxShadow={colors?.boxShadow}
      borderColor={colors?.borderColor}
    >
      {handleHeaderClick ? (
        <HeaderButton onClick={handleHeaderClick}>{HeaderContent}</HeaderButton>
      ) : (
        <FeedItemHeader>{HeaderContent}</FeedItemHeader>
      )}

      <Content>{children}</Content>
    </Root>
  );
};

export { FeedItem };
