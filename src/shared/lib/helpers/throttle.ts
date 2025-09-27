export const throttle = (func: (...args: any[]) => void, duration: number) => {
  let shouldWait = false;

  return function (...args: any[]) {
    const context = window;

    if (!shouldWait) {
      func.apply(context, args);
      shouldWait = true;

      setTimeout(function () {
        shouldWait = false;
      }, duration);
    }
  };
};
