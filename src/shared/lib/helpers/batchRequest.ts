import pLimit from 'p-limit';

const MAX_CONCURRENT_REQUESTS = 5;

// iterates through provided array and applies an async callback to each element, limiting concurrency of requests
export async function batchRequest<T>({
  cb,
  array,
}: {
  cb: (param: T) => Promise<void>;
  array: T[];
}): Promise<void> {
  const limit = pLimit(MAX_CONCURRENT_REQUESTS);

  const promises = array.map(el => limit(() => cb(el)));

  await Promise.allSettled(promises);
}
