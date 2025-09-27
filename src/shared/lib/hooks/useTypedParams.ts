import { useParams } from 'react-router-dom';

export function useTypedParams<T>(): T {
  const params = useParams();

  const result = {} as Record<string, unknown>;

  for (let key in params) {
    const value = params[key];

    if (isNaN(Number(value))) {
      result[key] = value;
    } else {
      result[key] = Number(value);
    }
  }

  return result as T;
}
