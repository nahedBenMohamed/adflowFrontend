export type FeedItemColorVariant = 'red' | 'green' | 'blue';

export interface FeedItemColors {
  borderColor?: string;
  boxShadow?: string;
  bgColor?: string;
}

export const getFeedItemColors = (color: FeedItemColorVariant): FeedItemColors => {
  switch (color) {
    case 'red':
      return {
        borderColor: 'var(--primary-statuses-red-360)',
        boxShadow: '0px 0px 2px 0px var(--primary-statuses-red-360)',
        bgColor: 'var(--background-red-20)',
      };

    case 'green':
      return {
        borderColor: 'var(--primary-statuses-green-520)',
        boxShadow: '0px 0px 2px 0px var(--primary-statuses-green-520)',
        bgColor: 'var(--background-green-20)',
      };

    case 'blue':
      return {
        borderColor: '',
        boxShadow: '0px 0px 2px 0px #EEF4FE, 0px 0px 4px 0px #2CBDF1',
        bgColor: '',
      };

    default:
      return {
        borderColor: 'none',
        boxShadow: '0px 1px 2px 0px #d0daeb, 0px 0px 2px 0px #eef4fe',
        bgColor: 'var(--primary-statuses-white-0)',
      };
  }
};
