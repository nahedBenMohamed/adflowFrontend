import { useMediaQuery } from '@mantine/hooks';
import { MediaBreakpoints } from '../models';

export const useMobile = () => useMediaQuery(MediaBreakpoints.SM);
