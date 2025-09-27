import { SpanWithEllipsis } from '@/shared';
import { useRef, type ReactNode, type RefObject } from 'react';
import styled from 'styled-components';
import { useOnClickOutside } from 'usehooks-ts';

const Root = styled.ul<{ $opened: boolean }>`
  position: absolute;
  top: calc(var(--bpmn-toggle-minimap-toggle-button-height) + 16px * 2);
  left: calc(var(--bpmn-automations-djs-palette-width) + 16px * 2);

  z-index: var(--modal-z-index);

  width: 400px;
  max-height: 440px;

  display: flex;
  flex-direction: column;

  padding: 8px 0;
  box-shadow: var(--dropdown-box-shadow);
  border-radius: var(--border-radius-block);
  border: 1px solid var(--graphite-graphite-80);
  background-color: var(--primary-statuses-white-0);

  transform-origin: top left;
  transition: var(--transition-200);

  opacity: ${p => (p.$opened ? 1 : 0)};
  scale: ${p => (p.$opened ? 1 : 0.8)};
  pointer-events: ${p => (p.$opened ? 'auto' : 'none')};
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  padding: 0 12px 8px 12px;
  border-bottom: 1px solid var(--graphite-graphite-120);
`;

interface Props {
  title: string;
  Icon: ReactNode;
  opened: boolean;
  children: ReactNode;
  onClose: () => void;
}

const PaletteSubMenu = (props: Props) => {
  const { title, Icon, opened, children, onClose } = props;

  const ref = useRef<HTMLUListElement>(null);

  useOnClickOutside(ref as RefObject<HTMLUListElement>, onClose);

  return (
    <Root ref={ref} $opened={opened}>
      <Title>
        {Icon}

        <SpanWithEllipsis text={title} />
      </Title>

      {children}
    </Root>
  );
};

export { PaletteSubMenu };
