export function delayResolve<T extends (...args: unknown[]) => Promise<unknown>>(
  func: T,
  delay: number
): T {
  return async function (...args) {
    const startTime = Date.now();
    const result = await func(...args);
    const elapsedTime = Date.now() - startTime;

    const waitTime = Math.max(0, delay - elapsedTime);

    await new Promise(resolve => setTimeout(resolve, waitTime));

    return result;
  } as T;
}
