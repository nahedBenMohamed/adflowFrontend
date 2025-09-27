import { type AnyObject } from '../types';

export const shallowEqual = ({ obj1, obj2 }: { obj1: AnyObject; obj2: AnyObject }): boolean => {
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);

  // if the objects have different numbers of keys, they aren't equal
  if (obj1Keys.length !== obj2Keys.length) return false;

  // check if each key in obj1 exists in obj2 and has the same value
  for (const key of obj1Keys) {
    if (!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key]) return false;
  }

  // if we get here, the objects are equal
  return true;
};
