import { type ReactNode } from 'react';
import { BlockFileDocIcon, BlockFileFallbackIcon, BlockFilePdfIcon } from '../../assets';

export const getBlockFileItemIcon = (fileType: string): ReactNode => {
  if (fileType.includes('pdf')) return <BlockFilePdfIcon />;

  if (fileType.includes('document')) return <BlockFileDocIcon />;

  return <BlockFileFallbackIcon />;
};
