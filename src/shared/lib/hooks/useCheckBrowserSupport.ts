import Bowser from 'bowser';
import { useLayoutEffect, useState } from 'react';

export const useCheckBrowserSupport = (): boolean => {
  const [isBrowserSupported, setIsBrowserSupported] = useState(true);

  useLayoutEffect(() => {
    // https://github.com/bowser-js/bowser?tab=readme-ov-file#filtering-browsers
    const browser = Bowser.getParser(window.navigator.userAgent);

    // mostly based on https://caniuse.com/flexbox-gap
    const isValidBrowser = browser.satisfies({
      opera: '>=70',
      chrome: '>=84',
      firefox: '>=63',
      safari: '>=14.1',
    });

    // unable to determine, so we assume it's supported
    if (isValidBrowser === undefined) return;

    setIsBrowserSupported(isValidBrowser);
  }, []);

  return isBrowserSupported;
};
