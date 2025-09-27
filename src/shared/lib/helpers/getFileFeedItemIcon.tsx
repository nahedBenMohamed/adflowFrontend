import { type ReactNode } from 'react';
import {
  FileDOCIcon,
  FileIMGIcon,
  FilePDFIcon,
  FilePPTIcon,
  FileXLSIcon,
  UniversalFileIcon,
} from '../../assets';

export const getFileFeedItemIcon = (fileType: string): ReactNode => {
  if (fileType.includes('pdf')) return <FilePDFIcon />;

  if (fileType.includes('presentation')) return <FilePPTIcon />;

  if (fileType.includes('image')) return <FileIMGIcon />;

  if (fileType.includes('sheet')) return <FileXLSIcon />;

  if (fileType.includes('document')) return <FileDOCIcon />;

  return <UniversalFileIcon />;
};
