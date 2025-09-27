type Params = Map<string, string>;

export const dangerouslySetQueryParams = (params: Params): void => {
  const oldParams = new URLSearchParams(window.location.search);

  for (const [key, value] of params.entries()) {
    oldParams.set(key, value);
  }

  window.history.replaceState(
    {},
    '',
    `${window.location.pathname}?${oldParams.toString()}${window.location.hash}`
  );
};
