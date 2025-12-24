import type { PagingResponse } from "~/types/PagingResponse";
import type { CreateSourceRequest, CreateSourceResponse } from "~/types/source/CreateSource";
import type { FilterSourceRequest, FilterSourceResponse } from "~/types/source/FilterSource";
import type { GetAllSourceResponse } from "~/types/source/GetAllSource";
import type { GetSourceDetailResponse } from "~/types/source/GetSourceDetail";
import type { UpdateSourceRequest, UpdateSourceResponse } from "~/types/source/UpdateSource";

export default function () {
  function getAllSource() {
    return fetcher<PagingResponse<GetAllSourceResponse>>("/api/source/getAll");
  }

  function getSourceDetail(sourceId: number) {
    return fetcher<GetSourceDetailResponse>(`/api/source/getDetail/${sourceId}`);
  }

  function createSource(payload: CreateSourceRequest) {
    return fetcher<CreateSourceResponse>(`/api/source/create`, {
      method: "POST",
      body: payload,
    });
  }

  function filterSource(payload?: FilterSourceRequest, groupId?: number) {
    return fetcher<FilterSourceResponse[]>(`/api/source/filter`, {
      method: "POST",
      body: payload,
      query: { groupId },
    });
  }

  function updateSource(sourceId: number, payload: UpdateSourceRequest) {
    return fetcher<UpdateSourceResponse>(`/api/source/update/${sourceId}`, {
      method: "PUT",
      body: payload,
    });
  }

  function deleteSource(sourceId: number) {
    return fetcher<GetSourceDetailResponse>(`/api/source/delete/${sourceId}`, {
      method: "DELETE",
    });
  }

  return {
    getAllSource,
    getSourceDetail,
    createSource,
    filterSource,
    updateSource,
    deleteSource,
  };
}
