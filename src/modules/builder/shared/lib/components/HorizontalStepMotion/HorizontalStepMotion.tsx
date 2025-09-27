import type { Optional } from '@/shared';
import { motion, type MotionProps } from 'framer-motion';
import { useCallback, type Key, type ReactNode } from 'react';

export type HorizontalStepMotionDirection = 'left' | 'right' | 'none';

interface Props {
  motionKey: Key;
  children: ReactNode;
  direction: HorizontalStepMotionDirection;
}

const HorizontalStepMotion = (props: Props) => {
  const { motionKey, children, direction } = props;

  const getAnimation = useCallback(
    (direction: HorizontalStepMotionDirection): Optional<MotionProps> =>
      direction === 'none'
        ? undefined
        : {
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.2 },
            style: { height: '100%', flex: 1 },
            exit: { opacity: 0, x: direction === 'left' ? 100 : -100 },
            initial: { opacity: 0, x: direction === 'left' ? -100 : 100 },
          },
    []
  );

  return (
    <motion.div key={motionKey} {...getAnimation(direction)}>
      {children}
    </motion.div>
  );
};

export { HorizontalStepMotion };
