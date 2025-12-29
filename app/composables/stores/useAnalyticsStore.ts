import type { GetDashboardStatisticResponse } from "~/types/analytics/GetDashboardStatistic";

export default function () {
  function getDashboardStatistic() {
    return fetcher<GetDashboardStatisticResponse>("/api/analytics/dashboard");
  }

  return {
    getDashboardStatistic,
  };
}
