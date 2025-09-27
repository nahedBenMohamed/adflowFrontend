import { appStore, boardApiUtil, routes } from '@/app';
import { authStore } from '@/modules/auth';
import { EntityApiUtil } from '@/modules/section/shared/lib/utils/EntityApiUtil';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Nullable } from '../types';

export const useCheckProjectOwnerOrAdmin = ({
  boardId,
  navigateToForbidden = false,
}: {
  boardId: Nullable<number>;
  navigateToForbidden?: boolean;
}): boolean => {
  const [isProjectOwner, setIsProjectOwner] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authStore.user;

    const ensureProjectOwner = async (): Promise<boolean> => {
      if (!boardId) return false;

      const board = await boardApiUtil.getBoard(boardId);

      if (!board || !board.recordId || !currentUser) return false;

      const entityId = board.recordId;
      const entity = await EntityApiUtil.getById(entityId);

      return entity.responsibleUserId === currentUser.id;
    };

    const checkForbidden = async (): Promise<void> => {
      const isProjectOwner = await ensureProjectOwner();
      const isAdmin = currentUser?.isAdmin();

      if (!isProjectOwner && !isAdmin) {
        setIsProjectOwner(false);

        if (navigateToForbidden) navigate(routes.forbiddenPage);

        return;
      }

      setIsProjectOwner(true);
    };

    if (!appStore.isLoaded) return;

    checkForbidden();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appStore.isLoaded, boardId, navigateToForbidden]);

  return isProjectOwner;
};
