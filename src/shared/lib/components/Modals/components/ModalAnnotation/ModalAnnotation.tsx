import styled from 'styled-components';

interface ModalAnnotationProps {
  $textColor?: string;
}

export const ModalAnnotation = styled.div<ModalAnnotationProps>`
  font-weight: 400;
  font-size: 14px;
  line-height: 160%;
  text-align: center;

  color: ${p => p.$textColor || 'var(--button-text-graphite-priory-text)'};
`;
