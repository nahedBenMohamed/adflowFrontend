import type { MouseEvent } from 'react';
import styled from 'styled-components';
import { DeleteTag } from '../../../../../../assets';
import { TruncateMixin } from '../../../../../mixins';
import { SpanWithEllipsis } from '../../../../SpanWithEllipsis/SpanWithEllipsis';

interface TagProps {
  $bgColor: string;
  $color: string;
}

const Tag = styled.li<TagProps>`
  height: 32px;
  max-width: 100%;

  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 4px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${p => p.$color};

  border-radius: 32px;
  padding: 4px 4px 5px 10px;
  background-color: ${p => p.$bgColor};
  transition: var(--transition-200);

  ${TruncateMixin}

  &:active {
    scale: 0.98;
  }
`;

interface CloseIconWrapperProps {
  $color: string;
  $bgColor: string;
}

const CloseIconWrapper = styled.button<CloseIconWrapperProps>`
  height: 20px;
  width: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  transition: var(--transition-200);

  svg path {
    fill: ${p => p.$color};

    &:nth-child(2),
    &:nth-child(3) {
      stroke: ${p => p.$bgColor};
    }

    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    opacity: 0.7;
  }
`;

interface Props {
  color: string;
  bgColor: string;
  name: string;
  handleDelete: () => void;
}

const MyMultiselectColoredTag = (props: Props) => {
  const { color, bgColor, name, handleDelete } = props;

  const onDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    handleDelete();
  };

  return (
    <Tag $bgColor={bgColor} $color={color}>
      <SpanWithEllipsis text={name} />

      <CloseIconWrapper $color={color} $bgColor={bgColor} onClick={onDelete}>
        <DeleteTag />
      </CloseIconWrapper>
    </Tag>
  );
};

export { MyMultiselectColoredTag };
