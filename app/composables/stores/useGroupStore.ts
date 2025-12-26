import type { CreateGroupRequest, CreateGroupResponse } from "~/types/group/CreateGroup";
import type { DeleteGroupResponse } from "~/types/group/DeleteGroup";
import type { GetAllGroupResponse } from "~/types/group/GetAllGroup";
import type { GetGroupDetailResponse } from "~/types/group/GetGroupDetail";
import type { UpdateGroupRequest, UpdateGroupResponse } from "~/types/group/UpdateGroup";
import type { PagingResponse } from "~/types/PagingResponse";

export default function () {
  function getAllGroup() {
    return fetcher<PagingResponse<GetAllGroupResponse>>("/api/group/getAll");
  }

  function getGroupDetail(id: number) {
    return fetcher<GetGroupDetailResponse>(`/api/group/getDetail/${id}`);
  }

  function createGroup(payload: CreateGroupRequest) {
    return fetcher<CreateGroupResponse>("/api/group/create", {
      method: "POST",
      body: payload,
    });
  }

  function updateGroup(id: number, payload: UpdateGroupRequest) {
    return fetcher<UpdateGroupResponse>(`/api/group/update/${id}`, {
      method: "PUT",
      body: payload,
    });
  }

  function deleteGroup(id: number) {
    return fetcher<DeleteGroupResponse>(`/api/group/delete/${id}`, {
      method: "DELETE",
    });
  }

  return {
    getAllGroup,
    getGroupDetail,
    createGroup,
    updateGroup,
    deleteGroup,
  };
}
