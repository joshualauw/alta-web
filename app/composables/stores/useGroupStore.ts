import type { GetAllGroupResponse } from "~/types/group/GetAllGroup";
import type { PagingResponse } from "~/types/PagingResponse";

export default function () {
  function getAllGroup() {
    return fetcher<PagingResponse<GetAllGroupResponse>>("/api/group/getAll");
  }

  return {
    getAllGroup,
  };
}
