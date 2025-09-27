import type { MantineSize } from '@mantine/core';
import { type ReactNode } from 'react';

export interface MyDatePickerCommonProps {
  size?: MantineSize;
  renderDay?: (date: Date) => ReactNode;
  excludeDate?: (date: Date) => boolean;
}
