import { ApiRoutes, baseApi } from '@/app';
import { FeedItem, UrlTemplateUtil, type FeedItemFilter, type Nullable } from '@/shared';
import type { FeedItemMeta } from '../../shared';

const DEFAULT_FEED_ITEMS_LIMIT = 20;

class FeedApi {
  getFeedItems = async ({
    entityId,
    filter,
    offset = null,
  }: {
    entityId: number;
    filter: FeedItemFilter;
    offset?: Nullable<number>;
  }): Promise<{ meta: FeedItemMeta; feedItems: FeedItem[] }> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(ApiRoutes.GET_FEED_ITEMS, { entityId, filter }),
      {
        params: { limit: DEFAULT_FEED_ITEMS_LIMIT, offset },
      }
    );

    const meta: FeedItemMeta = response.data.meta;
    const feedItems: FeedItem[] = FeedItem.fromDtos(response.data.result);

    return {
      meta,
      feedItems,
    };
  };
}

export const feedApi = new FeedApi();
