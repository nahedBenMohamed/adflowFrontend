import { type AnyObject } from '../../types';
import { type ErrorCode } from './ErrorCode';

export interface ServiceError extends Error {
  errorCode: ErrorCode;
  details?: AnyObject;
}
