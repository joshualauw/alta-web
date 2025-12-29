export interface GetDashboardStatisticResponse {
  statistics: {
    totalSources: number;
    totalSearches: number;
    totalGroups: number;
  };
  monthlyTopSources: {
    id: number;
    name: string;
    count: number;
  }[];
  weeklySearches: {
    date: string;
    count: number;
  }[];
}
