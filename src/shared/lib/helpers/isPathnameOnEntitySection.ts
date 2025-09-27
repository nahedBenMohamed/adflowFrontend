import { routes } from '@/app';

/**
 * Checks if the current pathname is on entity section – list or board view
 */
export const isPathnameOnEntitySection = ({
  pathname,
  entityTypeId,
}: {
  pathname: string;
  entityTypeId: number;
}): boolean =>
  pathname.includes(routes.listSectionBase(entityTypeId)) ||
  pathname.includes(`${routes.sectionBase(entityTypeId)}/b`);
