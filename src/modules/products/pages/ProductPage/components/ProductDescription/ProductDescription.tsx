import {
  FunctionalTextEditor,
  InnerHTMLNormalizerMixin,
  ShowMoreButton,
  useHasMore,
  type InputModel,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import DOMPurify from 'dompurify';
import { observer } from 'mobx-react-lite';
import { RefObject, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useOnClickOutside } from 'usehooks-ts';

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

interface TextProps {
  $expanded: boolean;
  $disabled: boolean;
}

const Text = styled.div<TextProps>`
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${p => (p.$expanded ? 'unset' : 8)};

  &:hover {
    cursor: pointer;
  }

  ${p => p.$disabled && `pointer-events: none`};

  ${InnerHTMLNormalizerMixin}
`;

const ShowMoreButtonWrapper = styled.div`
  margin-left: auto;
`;

interface Props {
  disabled: boolean;
  description: InputModel;
  onChange: () => void;
}

const ProductDescription = observer((props: Props) => {
  const { disabled, description, onChange } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.product_page.ui.product_description',
  });

  const editorRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const [editMode, { close: hideEditMode, open: showEditMode }] = useDisclosure(
    description.value.length === 0
  );
  const [textExpanded, { toggle: toggleTextExpanded, close: collapseText }] = useDisclosure(false);

  useOnClickOutside(editorRef as RefObject<HTMLDivElement>, e => {
    const target = e.target as HTMLElement;

    // to prevent close when clicked on emoji picker
    if (target.closest('.workspace__MyDropdown--StyledDropdown')) return;

    if (description.value.length) hideEditMode();

    collapseText();
  });

  const hasMore = useHasMore(textRef, [description.value]);

  return editMode ? (
    <FunctionalTextEditor
      autoFocus
      ref={editorRef}
      variant="outlined"
      model={description}
      disabled={disabled}
      contentMinHeight="80px"
      contentMaxHeight="560px"
      placeholder={t('placeholders.add_description')}
      handleChange={onChange}
    />
  ) : (
    <TextWrapper>
      <Text
        ref={textRef}
        $disabled={disabled}
        $expanded={textExpanded}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description.value) }}
        onClick={showEditMode}
      />

      <ShowMoreButtonWrapper>
        <ShowMoreButton visible={hasMore} active={textExpanded} onClick={toggleTextExpanded} />
      </ShowMoreButtonWrapper>
    </TextWrapper>
  );
});

ProductDescription.displayName = 'ProductDescription';
export { ProductDescription };
