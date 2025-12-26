import type { PagingResponse } from "~/types/PagingResponse";
import type { CreatePresetRequest, CreatePresetResponse } from "~/types/preset/CreatePreset";
import type { DeletePresetResponse } from "~/types/preset/DeletePreset";
import type { GetAllPresetResponse } from "~/types/preset/GetAllPreset";
import type { GetPresetDetailResponse } from "~/types/preset/GetPresetDetail";
import type { UpdatePresetRequest, UpdatePresetResponse } from "~/types/preset/UpdatePreset";

export default function () {
  function getAllPreset() {
    return fetcher<PagingResponse<GetAllPresetResponse>>("/api/preset/getAll");
  }

  function getPresetDetail(id: number) {
    return fetcher<GetPresetDetailResponse>(`/api/preset/getDetail/${id}`);
  }

  function createPreset(payload: CreatePresetRequest) {
    return fetcher<CreatePresetResponse>("/api/preset/create", {
      method: "POST",
      body: payload,
    });
  }

  function updatePreset(id: number, payload: UpdatePresetRequest) {
    return fetcher<UpdatePresetResponse>(`/api/preset/update/${id}`, {
      method: "PUT",
      body: payload,
    });
  }

  function deletePreset(id: number) {
    return fetcher<DeletePresetResponse>(`/api/preset/delete/${id}`, {
      method: "DELETE",
    });
  }

  return {
    getAllPreset,
    getPresetDetail,
    createPreset,
    updatePreset,
    deletePreset,
  };
}
