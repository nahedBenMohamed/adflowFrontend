import { DropdownScrollbarMixin } from '@/shared/lib/mixins/DropdownScrollbar.mixin';
import { MediaBreakpoints } from '@/shared/lib/models/MediaBreakpoints';
import styled from 'styled-components';

export const SettingsSidebar = styled.div`
  position: fixed;
  z-index: 10;

  width: var(--settings-sidebar-width);
  height: calc(100dvh - var(--header-height));

  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  gap: 8px;

  background: var(--primary-statuses-white-0);
  border-right: 1px solid var(--graphite-graphite-80);

  ${DropdownScrollbarMixin}

  padding: 8px;

  @media ${MediaBreakpoints.SM} {
    position: relative;
  }
`;
