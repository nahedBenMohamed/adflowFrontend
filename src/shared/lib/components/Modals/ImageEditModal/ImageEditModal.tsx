import { Slider } from '@mantine/core';
import { useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import styled from 'styled-components';
import type { Nullable } from '../../../types';
import { DialogModalSecondary } from '../Dialog/DialogModalSecondary/DialogModalSecondary';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;

  padding: 16px;
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

const Annotation = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: var(--button-text-graphite-primary-text);
`;

const StyledSlider = styled(Slider)`
  .mantine-Slider-track {
    height: 2px;
    background-color: var(--button-text-graphite-secondary-text);
  }

  .mantine-Slider-thumb {
    border: none;
    background-color: var(--primary-blue);
  }
`;

interface Props {
  title: string;
  annotation: string;
  image: Nullable<File>;
  width: number;
  height: number;
  round?: boolean;
  onClose: () => void;
  onApprove: (value: Blob) => Promise<void>;
}

const ImageEditModal = (props: Props) => {
  const { title, annotation, image, width, height, round = false, onClose, onApprove } = props;

  const editorRef = useRef<AvatarEditor>(null);

  const [uploading, setUploading] = useState(false);
  const [scale, setScale] = useState(1);

  const handleApprove = () => {
    const canvas = editorRef.current?.getImage();

    if (canvas) {
      canvas.toBlob(
        async (blob): Promise<void> => {
          if (blob) {
            try {
              setUploading(true);

              await onApprove(blob);
            } catch (e) {
              throw new Error(`Failed to upload image`);
            } finally {
              setUploading(false);
            }
          }
        },
        'image/jpeg',
        1
      );
    }
  };

  return (
    <DialogModalSecondary
      width="384px"
      maxHeight="532px"
      loading={uploading}
      isOpened={Boolean(image)}
      approveDisabled={uploading}
      Header={<Title>{title}</Title>}
      onClose={onClose}
      onApprove={handleApprove}
    >
      <Root>
        <Annotation>{annotation}</Annotation>

        {image && (
          <AvatarEditor
            ref={editorRef}
            image={image}
            scale={scale}
            width={width}
            height={height}
            borderRadius={round ? Math.min(width, height) : 0}
            style={{
              borderRadius: 7,
            }}
          />
        )}

        <StyledSlider
          w={220}
          min={0.5}
          max={2.5}
          step={0.01}
          label={null}
          value={scale}
          onChange={setScale}
        />
      </Root>
    </DialogModalSecondary>
  );
};

export { ImageEditModal };
