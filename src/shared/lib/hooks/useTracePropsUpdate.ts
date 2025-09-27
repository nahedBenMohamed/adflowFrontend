import { useEffect, useRef } from 'react';

// https://stackoverflow.com/a/51082563/19103570
export const useTracePropsUpdate = ({
  props,
  msg,
}: {
  props: Record<string, any>;
  msg: string;
}): void => {
  const prev = useRef(props);

  useEffect(() => {
    // add index signature to allow indexing with a string
    const changedProps: Record<string, [unknown, unknown]> = Object.entries(props).reduce(
      (ps, [k, v]) => {
        if (prev.current[k] !== v) ps[k] = [prev.current[k], v];

        return ps;
      },
      {} as Record<string, [unknown, unknown]>
    );

    if (Object.keys(changedProps).length > 0)
      console.log('useTracePropsUpdate', { msg, changed: changedProps });

    prev.current = props;
  });
};
