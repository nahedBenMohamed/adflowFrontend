import { useEffect, useState } from 'react';

export const useLeftBlockWidth = () => {
  const [leftBlockWidth, setLeftBlockWidth] = useState<number>(0);

  useEffect(() => {
    const getLeftBlockWidth = () => {
      const leftBlock = document.getElementById('workspace__Card--LeftBlock');

      if (!leftBlock) return;

      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setLeftBlockWidth(leftBlock.clientWidth);
    };

    window.addEventListener('resize', getLeftBlockWidth);

    getLeftBlockWidth();

    return () => window.removeEventListener('resize', getLeftBlockWidth);
  }, []);

  return leftBlockWidth;
};
